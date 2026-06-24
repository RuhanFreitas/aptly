const DISCIPLINES = [
  "Cognitive science",
  "Accessibility",
  "Human-computer interaction",
  "Education research",
  "Readability",
  "Attention & focus",
  "Working memory",
  "Universal design",
];

export function MarqueeStrip() {
  const items = [...DISCIPLINES, ...DISCIPLINES];
  return (
    <section className="border-y border-mist-200 bg-bone py-6">
      <p className="mb-5 text-center text-xs font-medium tracking-widest text-mist-500 uppercase">
        Grounded in research across
      </p>
      <div className="mask-fade-edges overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="text-base font-medium tracking-tight text-mist-400"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
