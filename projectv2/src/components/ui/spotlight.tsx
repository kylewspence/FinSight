import { cn } from "@/lib/utils";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spotlight({ className, ...props }: SpotlightProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/30 to-transparent" />
    </div>
  );
} 