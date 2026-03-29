import * as motion from "motion/react-client";
import React from "react";
import { TechnologyWithIcon } from "@/components/TechIcons";
import { cn } from "@/lib/utils";
import AnimatedUnderline from "@/components/ui/AnimatedUnderline";
import { BentoCard } from "@/components/ui/bento-card";

interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  location?: string;
  description: string[];
  skills: string[];
}

const experiences: ExperienceItem[] = [
  {
    title: "Software Engineer",
    company: "Maluk",
    duration: "May 2025 - Present",
    location: "Amman, Jordan",
    description: [
      "Sole mobile developer at a fintech startup; rebuilt the entire Flutter application from scratch using Riverpod 3.0 code generation and Clean Architecture patterns.",
      "Delivered 54+ screens across 15 feature modules with a custom design system, totaling ~122K lines of Dart across 837 files.",
      "Contributed ~28% of the NestJS backend codebase, implementing 169 REST API endpoints for core fintech operations.",
      "Built the React/Refine admin panel for internal operations and user management.",
      "Shipped bilingual (Arabic/English) UI, Firebase push notifications, multi-account budgeting, and AI financial chat features to ~286 users.",
    ],
    skills: [
      "flutter",
      "dart",
      "riverpod",
      "nestjs",
      "react",
      "firebase",
      "typescript",
    ],
  },
  {
    title: "AI Engineer Intern",
    company: "SAGER",
    duration: "Feb 2025 - May 2025",
    location: "Amman, Jordan",
    description: [
      "Developed computer vision and geospatial AI solutions for ultra-HD aerial mapping applications.",
      "Built motion detection and UAE license plate recognition systems using YOLOv9 with custom post-processing algorithms.",
      "Created CNN models from scratch and implemented custom image processing functions without external libraries.",
      "Developed two full-stack applications: AI-powered image categorization platform and interactive geospatial query system with natural language processing.",
      "Processed geospatial data using Python (rasterio), QGIS, and PostgreSQL/PostGIS for spatial analysis and visualization.",
    ],
    skills: [
      "Computer Vision",
      "YOLOv9",
      "CNN",
      "python",
      "qgis",
      "nextjs",
      "typescript",
      "gemini",
      "leafletjs",
      "postgresql",
      "PostGIS",
    ],
  },

  {
    title: "Fabrication Engineer Intern",
    company: "Orange Jordan",
    duration: "Jul 2022 - Nov 2022",
    location: "Amman, Jordan",
    description: [
      "Divided into teams to build a project with the theme: Tech for Good.",
      "Built a pair of glasses that help blind people read by converting written content into audible content.",
      "Designed reading glasses using Fusion360 with features ensuring smooth reading experience.",
      "Led team design efforts, learning 3D modeling, 3D printing, and Laser Cutting techniques.",
    ],
    skills: ["fusion360", "3dprinting", "lasercutting"],
  },
];

const ExperienceCard: React.FC<{
  experience: ExperienceItem;
  index: number;
}> = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full pb-8 pl-0 will-change-transform last:pb-0 sm:pl-8"
    >
      {/* Timeline line - hidden on mobile */}
      <div
        className={cn(
          "bg-navy-700 absolute top-0 left-0 hidden h-full w-px sm:block",
          index === 0 ? "mask-t-from-80% mask-t-to-100%" : "",
          index === experiences.length - 1
            ? "mask-b-from-80% mask-b-to-100%"
            : "",
        )}
      />

      {/* Timeline dot aligned with title - hidden on mobile */}
      <div className="bg-neon absolute top-[3.2rem] left-[-4px] hidden h-2 w-2 rounded-full sm:block" />

      {/* Bento Card */}
      <BentoCard className="w-full">
        <div className="z-10 p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="text-left">
              <h3 className="text-foreground text-xl font-semibold">
                {experience.title}
              </h3>
              <p className="text-navy-300 text-lg">{experience.company}</p>
              {experience.location && (
                <p className="text-navy-400 text-sm">{experience.location}</p>
              )}
            </div>
            <p className="pill-container mt-2 inline-block px-3 py-1 text-sm sm:mt-0">
              {experience.duration}
            </p>
          </div>

          <ul className="foreground mb-5 space-y-3 text-left text-sm font-medium tracking-wider lg:text-base">
            {experience.description.map((item, i) => (
              <motion.li
                key={i}
                className="group flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                viewport={{ once: true }}
                style={{ willChange: "transform, opacity" }}
              >
                {/* animated bullet point */}
                <motion.div
                  className="from-neon-10 to-neon mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r transition-all duration-300 will-change-transform group-hover:scale-150 group-hover:text-white"
                  whileHover={{ scale: 1.5 }}
                />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill, i) => (
              <div
                key={i}
                className="pill-container hover:border-navy-400 flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all duration-300 hover:scale-110"
              >
                <TechnologyWithIcon techId={skill} />
              </div>
            ))}
          </div>
        </div>
      </BentoCard>
    </motion.div>
  );
};

const AboutPageExperience: React.FC = () => {
  return (
    <section className="container mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center will-change-transform"
      >
        <h2 className="section-title:small relative mb-12 inline-block text-center">
          Professional Experience
          <AnimatedUnderline />
        </h2>

        <div className="relative">
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutPageExperience;
