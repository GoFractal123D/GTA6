import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_24px_4px_rgba(255,77,166,0.7)] animate-gta6-loader",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 animate-gta6-light" />
    </div>
  );
}

export { Skeleton };
