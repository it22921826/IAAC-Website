import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Ticket,
  Package,
  Trophy,
  Award
} from 'lucide-react';

function WelcomeToIAAC() {
  const fastTransition = { duration: 0.5, ease: 'easeOut' };

  // Data for the 3 awards
  const awards = [
    { year: '2020 - 2021', title: 'Best Airline Training College' },
    { year: '2021 - 2022', title: 'Best Airline Training College' },
    { year: '2022 - 2023', title: 'Best Airline Training College' },
  ];

  return (
    <>
      {/* --- SECTION 1: INTRO & VIDEO --- */}
      <motion.section
        id="welcome"
        className="py-16 bg-white scroll-mt-[140px]"
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
        <div className="container mx-auto px-6">
          
          {/* Top Grid: Text & Video */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            
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
            </motion.div>

            {/* Video Section */}
            <motion.div
              className="relative h-80 lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black mt-4 lg:mt-0"
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

          {/* --- 3-PART AWARD SECTION --- */}
          <div className="mb-16">
            <motion.div 
              className="text-center mb-10"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <h3 className="text-3xl font-bold text-slate-900">Recognized for Excellence</h3>
              <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                Consistently awarded by the industry for delivering the highest standards in aviation training and student success in Sri Lanka.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
            >
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl border border-slate-100 p-8 shadow-lg shadow-slate-200/40 flex flex-col items-center text-center relative overflow-hidden group"
                >
                  {/* Subtle hover background glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-50/0 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Trophy Icon */}
                  <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Trophy size={32} strokeWidth={1.5} />
                  </div>
                  
                  {/* Year Tag */}
                  <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-600 tracking-widest mb-4">
                    {award.year}
                  </div>
                  auto object-contain
                  {/* Title */}
                  <h4 className="text-xl font-bold text-slate-900 leading-snug">
                    {award.title}
                  </h4>
                  
                  {/* Small decorative star */}
                  <div className="mt-6 text-amber-300 group-hover:text-amber-400 transition-colors">
                    <Award size={20} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* --- WIDE BANNER IMAGE --- */}
          <motion.div
            className="w-full rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
            variants={{
              hidden: { opacity: 0, scale: 0.98 },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.7, ease: 'easeOut' }
              }
            }}
          >
            <img 
              src="/w1.jpeg"
              alt="IAAC Awards and Recognition" 
              className="w-full h-auto rounded-3xl"
            />
          </motion.div>

        </div>
      </motion.section>

      {/* --- SECTION 2: OUR COURSES --- */}
      <motion.section
        className="py-20 bg-slate-50 border-t border-slate-100"
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

          <motion.div
            className="flex flex-wrap justify-center gap-8"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Airline Cabin Crew"
                Icon={Users}
                image="/h1.jpeg"
                description="Comprehensive training for aspiring flight attendants focusing on safety, grooming, and in-flight service."
                />
            </div>

            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Airport Ground Operations"
                Icon={Building2}
                image="/h2.jpeg"
                description="Mastering passenger handling, check-in procedures, terminal operations, and ramp safety."
                />
            </div>

            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Ticketing & Reservations"
                Icon={Ticket}
                image="/h3.jpeg"
                description="Expert training in global airline ticketing systems (GDS), reservations, and travel management."
                />
            </div>

            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] min-w-[300px] flex-grow-0">
                <CourseCard
                title="Cargo & Logistics"
                Icon={Package}
                image="/h4.png"
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

function CourseCard({ title, Icon, description, image }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <motion.div
      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm group h-full flex flex-col overflow-hidden"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      whileHover={{ y: -8, boxShadow: '0px 25px 50px -28px rgba(15, 23, 42, 0.35)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-200 shrink-0">
        {image && !imgError ? (
          <img
            src={image}
            alt={title}
            loading="eager"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
            <Icon strokeWidth={1.5} className="w-16 h-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-base flex-grow">{description}</p>
      </div>
    </motion.div>
  );
}

export default WelcomeToIAAC;