import Image from "next/image";
import { Technology } from "@/types/technology";

// Using SVG components in public folder instead of importing them as React components
// This reduces the bundle size significantly as seen in the Lighthouse Treemap

const NextJSIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 text-black dark:text-white"
  >
    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 0-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.049-.106.005-4.703.007-4.705.073-.091a.637.637 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
  </svg>
);

const JavaScriptIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 text-yellow-400"
  >
    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
  </svg>
);

const SupabaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 text-emerald-600"
  >
    <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
  </svg>
);

const GoRouterIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 text-cyan-500"
  >
    <path d="M3.79 15.045L7.2 0H8.4l-3.27 13.884H14.4c-2.016 0-2.82 1.008-2.172 3.024L12.3 24H0L3.79 15.045z" />
    <path d="M14.03 15.045L17.4 0H24l-3.82 8.97L24 17.933h-1.2l-3.6-8.925L16.02 17.933H24L20.21 24h-9.42l.79-3.176c.63-2.016-.3-3.024-2.1-3.024h.6l3.95-2.756z" />
  </svg>
);

const DefaultIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

// Create components that use Next/Image for SVG icons from public folder
const PublicSVGIcon = ({
  iconName,
  className = "h-5 w-5",
}: {
  iconName: string;
  className?: string;
}) => (
  <Image
    src={`/assets/icons/${iconName}.svg`}
    alt={`${iconName} icon`}
    className={className}
    draggable={false}
    width={24}
    height={24}
  />
);

// Export the list of technologies as a structured array
export const TECHNOLOGIES: Technology[] = [
  // Web specific
  {
    id: "react",
    name: "React",
    icon: () => <PublicSVGIcon iconName="react" />,
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: NextJSIcon,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: () => <PublicSVGIcon iconName="tailwind-css" />,
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: () => <PublicSVGIcon iconName="typescript" />,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: JavaScriptIcon,
  },
  {
    id: "appwrite",
    name: "Appwrite",
    icon: () => (
      <Image
        width={100}
        height={100}
        draggable={false}
        src="/assets/icons/appwrite.png"
        className="h-5 w-5"
        alt="appwrite"
      />
    ),
  },
  {
    id: "nestjs",
    name: "NestJS",
    icon: () => <PublicSVGIcon iconName="nestjs" />,
  },
  // Flutter specific
  {
    id: "flutter",
    name: "Flutter",
    icon: () => <PublicSVGIcon iconName="flutter" />,
  },
  {
    id: "gorouter",
    name: "Go Router",
    icon: GoRouterIcon,
  },
  {
    id: "riverpod",
    name: "Riverpod",
    icon: () => <PublicSVGIcon iconName="riverpod" />,
  },
  {
    id: "hive",
    name: "Hive",
    icon: () => (
      <Image
        width={100}
        height={100}
        draggable={false}
        src="/assets/icons/hive.png"
        className="h-5 w-5"
        alt="hive"
      />
    ),
  },
  {
    id: "dart",
    name: "Dart",
    icon: () => <PublicSVGIcon iconName="dart" />,
  },
  // AI and cloud
  {
    id: "openai",
    name: "OpenAI",
    icon: () => <PublicSVGIcon iconName="openai" />,
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: () => <PublicSVGIcon iconName="gemini" />,
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: SupabaseIcon,
  },
  {
    id: "firebase",
    name: "Firebase",
    icon: () => <PublicSVGIcon iconName="firebase" />,
  },
  // Python and ML
  {
    id: "python",
    name: "Python",
    icon: () => <PublicSVGIcon iconName="python" />,
  },
  {
    id: "opencv",
    name: "OpenCV",
    icon: DefaultIcon,
  },
  {
    id: "pytorch",
    name: "PyTorch",
    icon: DefaultIcon,
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    icon: DefaultIcon,
  },
  // databases
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: () => <PublicSVGIcon iconName="postgresql" />,
  },
  // others
  {
    id: "qgis",
    name: "QGIS",
    icon: () => <PublicSVGIcon iconName="qgis" />,
  },
  {
    id: "leafletjs",
    name: "Leaflet.js",
    icon: () => <PublicSVGIcon iconName="leaflet" />,
  },
  {
    id: "fusion360",
    name: "Fusion 360",
    icon: () => <PublicSVGIcon iconName="fusion360" />,
  },
  {
    id: "3dprinting",
    name: "3D Printing",
    icon: () => <PublicSVGIcon iconName="3dprinter" />,
  },
  {
    id: "lasercutting",
    name: "Laser Cutting",
    icon: () => <PublicSVGIcon iconName="lasercutting" />,
  },
];

// Map technology IDs to icon components for backward compatibility
const techIconsMap: Record<string, React.FC> = {};
TECHNOLOGIES.forEach((tech) => {
  techIconsMap[tech.name] = tech.icon;
  // Add alternate names/formats
  if (tech.id === "react") {
    techIconsMap["ReactJS"] = tech.icon;
    techIconsMap["React.js"] = tech.icon;
  }
  if (tech.id === "nextjs") {
    techIconsMap["NextJS"] = tech.icon;
    techIconsMap["Next"] = tech.icon;
  }
  if (tech.id === "tailwind") {
    techIconsMap["TailwindCSS"] = tech.icon;
  }
  if (tech.id === "typescript") {
    techIconsMap["TS"] = tech.icon;
  }
  if (tech.id === "javascript") {
    techIconsMap["JS"] = tech.icon;
  }
});

// Function to get the icon component for a given technology
export function getTechIcon(tech: string): React.FC | null {
  const normalizedTech = tech.trim();
  return techIconsMap[normalizedTech] || DefaultIcon;
}

// Function to get a technology by its ID
export function getTechById(id: string): Technology | undefined {
  return TECHNOLOGIES.find((tech) => tech.id === id);
}

// Component to display a technology with its icon
export function TechnologyWithIcon({ techId }: { techId: string }) {
  const tech = getTechById(techId);

  if (!tech) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-5 w-5">
          <DefaultIcon />
        </div>
        <span className="text-navy-300 text-sm">{techId}</span>
      </div>
    );
  }

  const Icon = tech.icon;

  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-5">
        <Icon />
      </div>
      <span className="text-navy-300 text-sm">{tech.name}</span>
    </div>
  );
}
