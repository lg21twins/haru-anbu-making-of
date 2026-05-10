export function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-[-25%] opacity-60 blur-[100px]">
        <div className="animate-blob1 absolute left-[8%] top-[12%] h-[42vw] w-[42vw] rounded-full bg-[color:var(--color-accent)] mix-blend-screen" />
        <div className="animate-blob2 absolute right-[4%] top-[28%] h-[50vw] w-[50vw] rounded-full bg-[color:var(--color-accent-violet)] mix-blend-screen" />
        <div className="animate-blob3 absolute bottom-[6%] left-[28%] h-[36vw] w-[36vw] rounded-full bg-[color:var(--color-accent-cyan)] mix-blend-screen" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--color-bg)_75%)]" />
    </div>
  );
}
