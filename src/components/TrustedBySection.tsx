import stadeRennais from "@/assets/Logo_Stade_Rennais_FC.svg.png";

const TrustedBySection = () => {
  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-gray-200">
        {/* Gradient banner style */}
        <div className="relative px-6 sm:px-10 py-14 sm:py-16 text-center bg-[radial-gradient(1200px_600px_at_50%_-20%,hsl(268_83%_60%_/0.35),transparent_60%),radial-gradient(1000px_600px_at_90%_120%,hsl(292_76%_60%_/0.35),transparent_60%),linear-gradient(135deg,hsl(261_65%_22%),hsl(270_55%_16%))] text-white">
          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
            Partenariat avec le <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Stade Rennais</span>
          </h2>
          <p className="mt-4 text-white/80 max-w-3xl mx-auto text-base sm:text-lg">
            Une collaboration stratégique avec un club phare du football français
          </p>

          {/* Logo */}
          <div className="mt-8 flex justify-center">
            <img src={stadeRennais} alt="Stade Rennais F.C." className="h-16 sm:h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;


