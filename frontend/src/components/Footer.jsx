import React from 'react';
import { Facebook, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      
      {/* --- MAIN FOOTER CONTENT --- */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">IAAC</h3>
            <p className="leading-relaxed text-slate-500">
              Authorized by the TVEC and Ministry of Skills Development. Sri Lanka's premier aviation institute empowering the next generation since 2015.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon
                Icon={Facebook}
                href="https://www.facebook.com/iaacsl"
                label="IAAC on Facebook"
              />
              <SocialIcon
                Icon={Youtube}
                href="https://www.youtube.com/@internationalairlineaviati4986"
                label="IAAC on YouTube"
              />
              <SocialIcon
                Icon={Linkedin}
                href="https://www.linkedin.com/company/international-airline-aviation-college/posts/?feedView=all"
                label="IAAC on LinkedIn"
              />
              <SocialIcon
                Icon={Instagram}
                href="https://www.instagram.com/iaac_aviation/"
                label="IAAC on Instagram"
              />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/student-life" text="Student Life" />
              <FooterLink href="/training/courses" text="Training Courses" />
              <FooterLink href="/events/gallery" text="Gallery" />
            </ul>
          </div>

          {/* Column 3: General & Legal (Includes the Recommendation) */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">General</h4>
            <ul className="space-y-2">
              {/* --- RECOMMENDATION ADDED HERE --- */}
              <FooterLink href="/careers-at-iaac" text="Careers at IAAC" />
              
              <FooterLink href="/privacy-policy" text="Privacy Policy" />
              <FooterLink href="/terms" text="Terms of Service" />
              <FooterLink href="/faq" text="FAQs" />
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <span>
                 49A Siri Dhamma Mawatha,<br />
                  Colombo 01000,<br />
                  Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-600 shrink-0" />
                <span>+94 76 676 3777</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-600 shrink-0" />
                <span>info@iaac.lk</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- COPYRIGHT BAR --- */}
      <div className="border-t border-slate-900 bg-slate-950">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} International Airline & Aviation College. All rights reserved.</p>
          <p className="text-slate-600">Designed & Developed by IAAC IT Team.</p>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Components ---

function FooterLink({ href, text }) {
  return (
    <li>
      <a href={href} className="hover:text-blue-500 transition-colors">
        {text}
      </a>
    </li>
  );
}

function SocialIcon({ Icon, href, label }) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
    >
      <Icon size={16} />
    </a>
  );
}

export default Footer;