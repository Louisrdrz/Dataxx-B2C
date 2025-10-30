const SupportersMarqueeSection = () => {
  const phrase = (
    <>
      <span className="mx-12">Pour les <span className="font-extrabold">Sportifs</span>.</span>
      <span className="mx-12">Par les <span className="font-extrabold">Sportifs</span>.</span>
    </>
  );

  return (
    <section className="py-8 md:py-12 px-0 overflow-hidden select-none">
      <div className="relative">
        <div className="absolute left-0 top-0 w-28 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-28 h-full bg-gradient-to-l from-background to-transparent z-10"></div>

        <div className="flex animate-scroll-x whitespace-nowrap" style={{ animationDuration: "16s" }}>
          <div className="text-secondary text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {phrase}
            {phrase}
            {phrase}
            {phrase}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportersMarqueeSection;


