import squeezie from "@/assets/squeezie.jpg";
import amixem from "@/assets/amixem.jpg";
import mcflyCarlito from "@/assets/mcfly-carlito.jpg";
import unchainedOff from "@/assets/unchained-off.jpg";
import unchained from "@/assets/unchained.jpg";
import gotaga from "@/assets/gotaga.jpg";

const youtubers = [
  { name: "squeezie", subscribers: "20M abonnés", avatar: squeezie },
  { name: "amixem", subscribers: "9M abonnés", avatar: amixem },
  { name: "mcfly et carlito", subscribers: "8M abonnés", avatar: mcflyCarlito },
  { name: "unchained_off", subscribers: "6M abonnés", avatar: unchainedOff },
  { name: "unchained", subscribers: "5M abonnés", avatar: unchained },
  { name: "gotaga", subscribers: "4M abonnés", avatar: gotaga },
];

const YouTuberCarousel = () => {
  // Duplicate the array to create seamless infinite scroll
  const duplicatedYoutubers = [...youtubers, ...youtubers];

  return (
    <section className="py-20 overflow-hidden">
      <div className="relative">
        {/* Gradient overlays for seamless effect */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10"></div>
        
        <div className="flex animate-scroll-x">
          {duplicatedYoutubers.map((youtuber, index) => (
            <div
              key={`${youtuber.name}-${index}`}
              className="flex-shrink-0 mx-4 w-80"
            >
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 hover-lift transition-all duration-300">
                <div className="flex items-center">
                  <img
                    src={youtuber.avatar}
                    alt={youtuber.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-secondary capitalize">
                      {youtuber.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {youtuber.subscribers}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouTuberCarousel;