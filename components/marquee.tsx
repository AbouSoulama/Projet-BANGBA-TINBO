export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy-deep">
      <div className="animate-marquee flex w-max items-center gap-10 py-5 pr-10">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10 text-sm tracking-[0.22em] text-gold-light uppercase">
            {item}
            <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
