import clem from "@/assets/clem.jpeg";
import martin from "@/assets/martin.jpeg";
import louis from "@/assets/louis.jpeg";

type Founder = {
  name: string;
  roleShort: "CEO" | "COO" | "CTO";
  title: string;
  photo: string;
  linkedin?: string;
};

const founders: Founder[] = [
  {
    name: "Clément Authier",
    roleShort: "CEO",
    title: "CEO & Co-founder",
    photo: clem,
    linkedin: "https://www.linkedin.com/in/cl%C3%A9ment-authier-3a8a75206/",
  },
  {
    name: "Martin Masseline",
    roleShort: "CPO",
    title: "COO & Co-founder",
    photo: martin,
    linkedin: "https://www.linkedin.com/in/martin-masseline-5282a01ba/",
  },
  {
    name: "Louis Rodriguez",
    roleShort: "CTO",
    title: "CTO & Co-founder",
    photo: louis,
    linkedin: "https://www.linkedin.com/in/louis-rodriguez1/",
  },
];

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" style={{ width: size, height: size }} fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.83v1.98h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V23h-4v-6.47c0-1.54-.03-3.52-2.15-3.52-2.15 0-2.48 1.67-2.48 3.41V23h-4V8.5z"/>
  </svg>
);

const Badge = ({ label, colorHex }: { label: string; colorHex: string }) => (
  <span
    className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-sm text-white"
    style={{ backgroundColor: colorHex }}
  >
    {label}
  </span>
);

const HEX_BY_INDEX = ["#9334EB", "#2663EB", "#DC2777"] as const; // violet, blue, pink
const LIGHT_BY_INDEX = ["#B06AF0", "#5B8FF0", "#E46AA3"] as const;
const SHADOW_RGBA_BY_INDEX = [
  "rgba(147, 52, 235, 0.35)", // violet
  "rgba(38, 99, 235, 0.35)",  // blue
  "rgba(220, 39, 119, 0.35)", // pink
] as const;

const Card = ({ founder, index }: { founder: Founder; index: number }) => {
  const colorHex = HEX_BY_INDEX[index] ?? "#9334EB";
  const lightHex = LIGHT_BY_INDEX[index] ?? "#B06AF0";
  const shadowRgba = SHADOW_RGBA_BY_INDEX[index] ?? "rgba(147, 52, 235, 0.35)";
  return (
    <div className="text-center">
      <div
        className="relative mx-auto rounded-full bg-white p-[4px]"
        style={{ width: 152, height: 152, boxShadow: `0 12px 24px -14px ${shadowRgba}` }}
      >
        <div className="rounded-full overflow-hidden w-full h-full">
          <img
            src={founder.photo}
            alt={founder.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 35%" }}
          />
        </div>
        <span
          className="absolute left-1/2 -bottom-4 -translate-x-1/2 inline-flex items-center justify-center font-extrabold text-white"
          style={{ backgroundColor: colorHex, height: 32, padding: "0 14px", borderRadius: 18, boxShadow: `0 10px 18px -12px ${shadowRgba}`, fontSize: 14 }}
        >
          {founder.roleShort}
        </span>
      </div>

      <h3 className="mt-7 text-2xl font-extrabold text-secondary">{founder.name}</h3>
      <p className="mt-1 text-base font-semibold" style={{ color: colorHex }}>{founder.title}</p>

      {founder.linkedin && (
        <a
          href={founder.linkedin}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full select-none"
          style={{
            width: 60, height: 60,
            background: `linear-gradient(180deg, #FFFFFF 0%, ${lightHex}26 100%)`,
            boxShadow: `0 12px 22px -14px ${shadowRgba}, 0 4px 10px -8px rgba(0,0,0,0.06)`,
            border: `1px solid ${lightHex}30`
          }}
          aria-label={`LinkedIn de ${founder.name}`}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: colorHex, color: "#FFFFFF" }}
          >
            <LinkedInIcon size={16} />
          </span>
        </a>
      )}
    </div>
  );
};

const FoundersSection = () => {
  return (
    <section id="equipe" className="py-24 px-6 bg-gradient-to-b from-white via-[hsl(270_100%_98%)] to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-secondary mb-3">Rencontrez nos fondateurs</h2>
          <p className="text-lg text-muted-foreground">
            L'équipe derrière Dataxx, combinant expertise en IA, opérations et technologie
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {founders.map((f, i) => (
            <Card key={f.name} founder={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;


