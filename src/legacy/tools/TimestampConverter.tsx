// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useEffect } from 'react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [date, setDate] = useState('');
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timestamp) {
      const ts = Number(timestamp);
      if (!isNaN(ts)) {
        const d = new Date(ts < 1e12 ? ts * 1000 : ts);
        setDate(d.toISOString());
      }
    }
  }, [timestamp]);

  useEffect(() => {
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        setTimestamp(String(Math.floor(d.getTime() / 1000)));
      }
    }
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Current Unix Timestamp</p>
        <p className="text-3xl font-bold font-mono text-primary">{now}</p>
        <p className="text-xs text-muted-foreground mt-1">{new Date(now * 1000).toUTCString()}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Unix Timestamp</label>
          <input type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="1700000000" className="h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm" />
          {timestamp && !isNaN(Number(timestamp)) && (
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>UTC: {new Date(Number(timestamp) < 1e12 ? Number(timestamp) * 1000 : Number(timestamp)).toUTCString()}</p>
              <p>Local: {new Date(Number(timestamp) < 1e12 ? Number(timestamp) * 1000 : Number(timestamp)).toString()}</p>
              <p>ISO: {new Date(Number(timestamp) < 1e12 ? Number(timestamp) * 1000 : Number(timestamp)).toISOString()}</p>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Date String</label>
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="2024-01-01T00:00:00Z" className="h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm" />
          {date && !isNaN(new Date(date).getTime()) && (
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>Seconds: {Math.floor(new Date(date).getTime() / 1000)}</p>
              <p>Milliseconds: {new Date(date).getTime()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
