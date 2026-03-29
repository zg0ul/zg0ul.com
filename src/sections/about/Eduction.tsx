"use client";

import AnimatedUnderline from "@/components/ui/AnimatedUnderline";
import React from "react";
import { FaRobot, FaCode, FaCogs } from "react-icons/fa";
import * as motion from "motion/react-client";

function AboutPageEducation() {
  return (
    <section className="container mb-16 px-4 sm:mb-20 lg:mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center will-change-transform"
      >
        <h2 className="relative mb-8 inline-block text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
          Education 🎓
          <AnimatedUnderline />
        </h2>

        {/* Education Card */}
        <div className="relative mx-auto max-w-4xl">
          {/* Education Entry */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Content with improved card styling */}
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="group border-navy-500 bg-navy-700 hover:border-neon-10/30 relative overflow-hidden rounded-xl border p-4 shadow-xl backdrop-blur-sm transition-all duration-300 sm:p-6"
              >
                {/* Subtle gradient overlay */}
                <div className="from-neon-4/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Degree Header with improved typography */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-text-200 mb-3 text-xl leading-tight font-bold sm:text-2xl lg:text-3xl">
                      Mechatronics Engineering
                    </h3>
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-2">
                      <p className="text-navy-200 flex items-center text-base font-medium sm:text-lg">
                        🎓 The Hashemite University
                      </p>
                      <div className="text-navy-300 text-sm font-medium sm:text-base">
                        2020 - 2025
                      </div>
                    </div>
                    <motion.div
                      className="mt-3 flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <span className="from-neon/20 to-neon-4/20 text-neon border-neon/30 shadow-glow-xs rounded-lg border bg-gradient-to-r px-3 py-1.5 text-xs font-semibold backdrop-blur-sm sm:text-sm">
                        GPA: 3.58/4.0 (Excellent) — Top of Class
                      </span>
                    </motion.div>
                  </div>

                  {/* Description with icons to visualize mechatronics */}
                  <motion.div
                    className="mb-4 sm:mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <p className="text-text-300 mb-4 text-sm leading-relaxed sm:text-base lg:text-lg">
                      Mechatronics engineering is an interdisciplinary field
                      that combines mechanical, electrical, and software
                      engineering to create innovative robotic and automated
                      systems.
                    </p>

                    {/* Icons representing mechatronics disciplines */}
                    <div className="mt-4 grid grid-cols-3 gap-4 sm:mt-6 sm:gap-6 lg:gap-8">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="from-navy-700 to-navy-800 shadow-glow-xs border-navy-600/50 hover:border-neon-4/50 hover:shadow-glow-sm relative flex h-10 w-10 items-center justify-center rounded-full border bg-gradient-to-br transition-all duration-300 sm:h-12 sm:w-12">
                          <FaCogs className="text-neon-4 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        </div>
                        <span className="text-navy-200 text-xs font-medium sm:text-sm">
                          Mechanical
                        </span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="from-navy-700 to-navy-800 shadow-glow-xs border-navy-600/50 hover:border-neon-4/50 hover:shadow-glow-sm relative flex h-10 w-10 items-center justify-center rounded-full border bg-gradient-to-br transition-all duration-300 sm:h-12 sm:w-12">
                          <FaCode className="text-neon-4 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        </div>
                        <span className="text-navy-200 text-xs font-medium sm:text-sm">
                          Software
                        </span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="from-navy-700 to-navy-800 shadow-glow-xs border-navy-600/50 hover:border-neon-4/50 hover:shadow-glow-sm relative flex h-10 w-10 items-center justify-center rounded-full border bg-gradient-to-br transition-all duration-300 sm:h-12 sm:w-12">
                          <FaRobot className="text-neon-4 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        </div>
                        <span className="text-navy-200 text-xs font-medium sm:text-sm">
                          Robotics
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Specialization */}
                  <motion.div
                    className="border-navy-500 bg-navy-800 rounded-lg border p-3 backdrop-blur-sm sm:p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    <h4 className="text-neon-10 mb-2 flex items-center text-sm font-semibold sm:text-base">
                      🎯 Specialization
                    </h4>
                    <p className="text-text-400 text-xs leading-relaxed sm:text-sm lg:text-base">
                      Focused on autonomous systems and robotics, combining
                      mechanical engineering principles with advanced
                      programming expertise. Completed capstone project on crack
                      detection wall climbing robot using computer vision and
                      autonomous navigation systems.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default AboutPageEducation;
