import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { categories, tools } from "@/lib/tools/registry";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search 28 tools…" />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        {categories.map((category) => (
          <CommandGroup key={category.id} heading={category.name}>
            {tools
              .filter((t) => t.category === category.id)
              .map((tool) => (
                <CommandItem
                  key={tool.slug}
                  value={`${tool.name} ${tool.keywords.join(" ")}`}
                  onSelect={() => {
                    onOpenChange(false);
                    navigate({ to: "/tools/$slug", params: { slug: tool.slug } });
                  }}
                >
                  <tool.icon className="mr-2 h-4 w-4 text-primary" />
                  <span>{tool.name}</span>
                  <span className="ml-auto hidden truncate text-xs text-muted-foreground sm:block">
                    {tool.short}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}