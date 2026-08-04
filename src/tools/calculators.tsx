import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Panel, Stat } from "@/components/tool-ui";

export function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState("1995-06-15");
  const [to, setTo] = useState(today);

  const result = useMemo(() => {
    const a = new Date(from);
    const b = new Date(to);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
    const [start, end] = a <= b ? [a, b] : [b, a];
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000);
    return { years, months, days, totalDays };
  }, [from, to]);

  return (
    <div className="space-y-4">
      <Panel title="Dates">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age-from">Start date / date of birth</Label>
            <Input id="age-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age-to">End date</Label>
            <Input id="age-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </Panel>
      {result && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Age" value={`${result.years}y ${result.months}m ${result.days}d`} />
          <Stat label="Total days" value={result.totalDays.toLocaleString()} />
          <Stat label="Weeks" value={Math.floor(result.totalDays / 7).toLocaleString()} />
          <Stat label="Hours" value={(result.totalDays * 24).toLocaleString()} />
          <Stat label="Minutes" value={(result.totalDays * 1440).toLocaleString()} />
        </div>
      )}
    </div>
  );
}

export function AspectRatioRem() {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);
  const [targetW, setTargetW] = useState(1280);
  const [px, setPx] = useState(24);
  const [root, setRoot] = useState(16);

  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const divisor = w && h ? gcd(w, h) : 1;
  const targetH = w ? Math.round((targetW * h) / w) : 0;

  return (
    <div className="space-y-4">
      <Panel title="Aspect ratio">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Original width", w, setW],
            ["Original height", h, setH],
            ["New width", targetW, setTargetW],
          ].map(([label, value, set]) => (
            <div key={label as string} className="space-y-2">
              <Label htmlFor={`ar-${label as string}`}>{label as string}</Label>
              <Input
                id={`ar-${label as string}`}
                type="number"
                value={value as number}
                onChange={(e) => (set as (n: number) => void)(Number(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Ratio" value={`${w / divisor} : ${h / divisor}`} />
          <Stat label="New height" value={`${targetH} px`} />
        </div>
      </Panel>

      <Panel title="PX ↔ REM">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rem-px">Pixels</Label>
            <Input
              id="rem-px"
              type="number"
              value={px}
              onChange={(e) => setPx(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rem-root">Root font size</Label>
            <Input
              id="rem-root"
              type="number"
              value={root}
              onChange={(e) => setRoot(Number(e.target.value) || 16)}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label={`${px}px in rem`} value={`${(px / (root || 16)).toFixed(4)} rem`} />
          <Stat label={`${px}rem in px`} value={`${(px * (root || 16)).toFixed(0)} px`} />
        </div>
      </Panel>
    </div>
  );
}

export function PercentageCalculator() {
  const [percent, setPercent] = useState(15);
  const [value, setValue] = useState(200);
  const [from, setFrom] = useState(80);
  const [to, setTo] = useState(120);
  const [price, setPrice] = useState(129.99);
  const [discount, setDiscount] = useState(20);
  const [tax, setTax] = useState(0);

  const change = from ? ((to - from) / Math.abs(from)) * 100 : 0;
  const discounted = price * (1 - discount / 100);
  const final = discounted * (1 + tax / 100);

  const field = (
    id: string,
    label: string,
    val: number,
    set: (n: number) => void,
    step = 1,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={val}
        onChange={(e) => set(Number(e.target.value) || 0)}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <Panel title="Percentage of a value">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("pc-percent", "Percent (%)", percent, setPercent)}
          {field("pc-value", "Of value", value, setValue)}
        </div>
        <div className="mt-4">
          <Stat label="Result" value={((percent / 100) * value).toLocaleString()} />
        </div>
      </Panel>

      <Panel title="Percentage change">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("pc-from", "From", from, setFrom)}
          {field("pc-to", "To", to, setTo)}
        </div>
        <div className="mt-4">
          <Stat
            label={change >= 0 ? "Increase" : "Decrease"}
            value={`${change.toFixed(2)}%`}
          />
        </div>
      </Panel>

      <Panel title="Discount & final price">
        <div className="grid gap-4 sm:grid-cols-3">
          {field("pc-price", "Original price", price, setPrice, 0.01)}
          {field("pc-discount", "Discount (%)", discount, setDiscount)}
          {field("pc-tax", "Tax (%)", tax, setTax)}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="You save" value={(price - discounted).toFixed(2)} />
          <Stat label="After discount" value={discounted.toFixed(2)} />
          <Stat label="Final with tax" value={final.toFixed(2)} />
        </div>
      </Panel>
    </div>
  );
}

const UNITS = {
  Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254, yd: 0.9144 },
  Weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523 },
  Data: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
} as const;

type UnitGroup = keyof typeof UNITS;

export function UnitConverter() {
  const [group, setGroup] = useState<UnitGroup>("Length");
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [celsius, setCelsius] = useState(20);

  const table = UNITS[group] as Record<string, number>;
  const units = Object.keys(table);
  const factorFrom = table[from] ?? 1;
  const factorTo = table[to] ?? 1;
  const converted = (amount * factorFrom) / factorTo;

  return (
    <div className="space-y-4">
      <Panel title="Converter">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(UNITS) as UnitGroup[]).map((g) => (
            <Button
              key={g}
              size="sm"
              variant={group === g ? "default" : "outline"}
              onClick={() => {
                setGroup(g);
                const keys = Object.keys(UNITS[g]);
                setFrom(keys[0] ?? "");
                setTo(keys[1] ?? keys[0] ?? "");
              }}
            >
              {g}
            </Button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="unit-amount">Amount</Label>
            <Input
              id="unit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit-from">From</Label>
            <select
              id="unit-from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit-to">To</Label>
            <select
              id="unit-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Stat label="Result" value={`${converted.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${to}`} />
        </div>
      </Panel>

      <Panel title="Temperature">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="temp-c">Celsius</Label>
            <Input
              id="temp-c"
              type="number"
              value={celsius}
              onChange={(e) => setCelsius(Number(e.target.value) || 0)}
            />
          </div>
          <Stat label="Fahrenheit" value={`${(celsius * 9) / 5 + 32}°F`} />
          <Stat label="Kelvin" value={`${(celsius + 273.15).toFixed(2)} K`} />
        </div>
      </Panel>
    </div>
  );
}