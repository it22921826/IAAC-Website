import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Ticket,
  Package,
} from 'lucide-react';

function WelcomeToIAAC() {
  const fastTransition = { duration: 0.5, ease: 'easeOut' };

  return (
    <>
      {/* --- SECTION 1: INTRO & VIDEO --- */}
      <motion.section
        id="welcome"
        className="py-20 bg-white scroll-mt-[140px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 28 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.55,
              ease: [0.16, 0.84, 0.44, 1],
              when: 'beforeChildren',
              staggerChildren: 0.08,
            },
          },
        }}
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: 'easeOut', staggerChildren: 0.08 },
              },
            }}
          >
            <motion.div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
              Since 2015
            </motion.div>
            <motion.h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Welcome to <span className="text-[#2563EB]">IAAC</span>
            </motion.h2>
            <motion.p className="text-slate-600 text-lg leading-relaxed">
              International Airline and Aviation College (IAAC) is a private educational institute based in Sri Lanka,
              strategically located in the heart of Colombo. We are authorized and monitored by the
              <strong> TVEC</strong> (Tertiary and Vocational Education Commission) under the Ministry of Skills Development.
            </motion.p>
            <motion.p className="text-slate-600 text-lg leading-relaxed">
              We cater to about 20,000 potential students near 12 leading national schools, providing top-tier vocational
              training in Airline and Aviation studies.
            </motion.p>

            <motion.div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-4 flex items-start gap-3">
              <div className="mt-1 text-yellow-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-800">Award Winner 2020-2021</p>
                <p className="text-sm text-slate-600">
                  Recognized as the "Best Airline Training College" in Sri Lanka twice.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] },
              },
            }}
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/0X1SG86awVM"
              title="IAAC Introduction Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </motion.section>

      {/* --- SECTION 2: OUR COURSES --- */}
      <motion.section
        className="py-24 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { ...fastTransition, staggerChildren: 0.08 } },
        }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: fastTransition },
            }}
          >
            <h2 className="text-3xl font-bold text-slate-900">Our Specialized Training</h2>
            <p className="mt-4 text-slate-600 text-lg">
              We offer specialized training courses designed to meet the future employment needs of the aviation industry.
            </p>
          </motion.div>

          {/* 2x2 GRID LAYOUT LOGIC:
             - flex-wrap: Allows items to wrap to next line
             - justify-center: Centers the grid in the middle of page
             - width logic: "lg:w-[calc(50%-1.5rem)]" forces 2 items per row with gap
          */}
          <motion.div
            className="flex flex-wrap justify-center gap-8"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {/* Card 1 */}
            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Airline Cabin Crew"
                Icon={Users}
                description="Comprehensive training for aspiring flight attendants focusing on safety, grooming, and in-flight service."
                />
            </div>

            {/* Card 2 */}
            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Airport Ground Ops"
                Icon={Building2}
                description="Mastering passenger handling, check-in procedures, terminal operations, and ramp safety."
                />
            </div>

            {/* Card 3 */}
            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Ticketing & Reservations"
                Icon={Ticket}
                description="Expert training in global airline ticketing systems (GDS), reservations, and travel management."
                />
            </div>

            {/* Card 4 */}
            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Cargo & Logistics"
                Icon={Package}
                description="Specialized courses in air cargo operations, supply chain management, and global logistics."
                />
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

// --- HELPER COMPONENTS ---

function CourseCard({ title, Icon, description }) {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm group h-full flex flex-col"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      whileHover={{ y: -8, boxShadow: '0px 25px 50px -28px rgba(15, 23, 42, 0.35)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="mb-6 inline-flex items-center justify-center p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors w-fit">
        <Icon strokeWidth={1.5} className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm flex-grow">{description}</p>
    </motion.div>
  );
}

export default WelcomeToIAAC;