import stadeRennais from "@/assets/Logo_Stade_Rennais_FC.svg.png";
import stadeFrancais from "@/assets/Logo_Stade_français.svg.png";

const TrustedBySection = () => {
  return (
    <section id="partenariat" className="py-10 px-6 bg-transparent scroll-mt-28">
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-gray-200">
        {/* Gradient banner style - éliminer séparation en ajoutant halo externe et ton de fond lissé */}
        <div className="relative px-6 sm:px-10 py-14 sm:py-16 text-center bg-[linear-gradient(135deg,hsl(261_65%_22%),hsl(270_55%_16%))] text-white">
          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
            Déjà utilisé par :
          </h2>

          {/* Logos */}
          <div className="mt-8 flex justify-center items-center gap-8 sm:gap-12">
            <img src={stadeRennais} alt="Stade Rennais F.C." className="h-16 sm:h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]" />
            <img src={stadeFrancais} alt="Stade Français Paris" className="h-16 sm:h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;


