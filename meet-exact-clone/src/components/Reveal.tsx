import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

const Reveal = ({ children, className = "", delayMs = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respecte prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("reveal-visible");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const show = () => el.classList.add("reveal-visible");
          if (delayMs > 0) setTimeout(show, delayMs);
          else show();
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
};

export default Reveal;


