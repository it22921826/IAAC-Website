import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Trophy, BookOpen } from 'lucide-react';

const p1 = '/p1.jpeg';
const p2 = '/p2.jpeg';
const p3 = '/p3.jpeg';
const p4 = '/p4.jpeg';
const p5 = '/p5.jpeg';
const p6 = '/p6.jpeg';
const p7 = '/p7.jpeg';
const p8 = '/p8.jpeg';
const p9 = '/p9.jpeg';
const p10 = '/p10.jpeg';
const p11 = '/p11.jpeg';
const p12 = '/p12.jpeg';
const p13 = '/p13.jpeg';
const p14 = '/p14.jpeg';

const DEFAULT_SLIDE_INTERVAL_MS = 5500;
const DEFAULT_FADE_DURATION_MS = 700;

const ImageSlideshow = ({
  images,
  alt,
  intervalMs = DEFAULT_SLIDE_INTERVAL_MS,
  fadeDurationMs = DEFAULT_FADE_DURATION_MS,
}) => {
  const normalizedImages = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images.filter(Boolean);
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (normalizedImages.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % normalizedImages.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [normalizedImages.length, intervalMs]);

  if (normalizedImages.length === 0) return null;

  return (
    <div className="relative w-full h-full">
      {normalizedImages.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={alt}
          className={
            'absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out ' +
            (index === activeIndex ? 'opacity-100' : 'opacity-0')
          }
          style={{ transitionDuration: `${fadeDurationMs}ms` }}
          draggable={false}
        />
      ))}
    </div>
  );
};

const inductees = [
  {
    id: 1,
    name: "Peter Hill",
    year: "2024",
    role: "Aviation Industry Veteran",
    experience: "52 Years",
    images: [p1, p2],
    bio:` The IAAC Awards Council has the distinct honour of inducting Mr. Peter Hill into the Sri Lanka Aviation Hall of Fame for 2024, in recognition of his unique and indelible contribution to the Aviation industry in Sri Lanka.
A career that began in 1972 grew into a legacy 52 years in the making. Meet Peter Murray Hill, a seasoned veteran in the aviation industry whose illustrious career and reputation precede him.
The journey began in 1961 when he joined British Overseas Airways Corporation (BOAC), now known as British Airways, as a commercial trainee. 
In 1974, he took his expertise to Gulf Aviation in Bahrain, playing a key role in establishing Gulf Air.
By 1978, Hill found himself in Dubai, contributing to the birth of Emirates Airlines. As part of a pioneering team at Dnata, he played a crucial role in presenting Emirates' first business plan. 
His journey continued at Emirates, where he served as the Commercial Manager until 1996. His strategic vision helped shape the early success of this now-global airline. 
In 1998, a new chapter unfolded as he took on the CEO role at Sri Lankan Airlines. Over the next 10 years, he led the airline through rebranding, restructuring, and profitability. Under Hill's watch, Sri Lankan Airlines became a hub for South Asia, achieving profitability in eight out of the 10 years, without additional funding.
Fast forward to 2008, Hill's expertise as an Airline maestro led him to assume the position of CEO at Oman Air where his leadership has been instrumental in shaping the sultanate's flag carrier. 
For over 50 years, Peter Hill's journey through British Airways, Gulf Air, Emirates, Sri Lankan Airlines, and Oman Air is a testament to his enduring impact on the aviation industry."`
  },
  {
    id: 2,
    name: "Rizmi Reyal",
    year: "2023",
    experience: "50+ Years",
    images: [p3, p4],
    bio: `The IAAC Awards Council has the distinct honor of inducting Mr. Rizmi Reyal into the Sri Lanka Aviation Hall of Fame for 2023, in recognition of his unique and indelible contribution to the Aviation industry in Sri Lanka.
Rizmi Reyal, is the Founder, Chairman, and Managing Director of The Traveller Global Pvt Ltd., was established in 1989. From humble beginnings, Mr. Reyal has overseen the growth of The Traveller Global over a span of three decades into a leading inspiration to the Aviation and Travel & Tourism industry in Sri Lanka. The Company with its branch offices in major cities in Sri Lanka and overseas has accumulated numerous achievements and milestones for its service excellence in its lifetime. The obligation of Mr. Reyal and his team is to ensuring maximum customer satisfaction, leadership abilities and strong humanitarian qualities has won the hearts of their patrons. While the global pandemic and the nation’s economic crisis in the country brought country to a stand still and the corporate world faced many challenges. Mr. Reyal, stood as a shining example that nothing is impossible. Mr. Reyal’s visionary approach and unwavering determination has helped the Organization and community to stay ahead and lights the way to a united progressive front.
Your dedication and commitment to the betterment of the aviation industry is truly respected and appreciated.`
  },
  {
    id: 3,
    name: "Chandana de Silva",
    year: "2023",
    experience: "35 Years",
    images: [p5, p6],
    bio: `The IAAC Awards Council has the distinct honor of inducting Mr. Chandana De Silva into the Sri Lanka Aviation Hall of Fame for 2023, in recognition of his unique and indelible contribution to the Aviation industry in Sri Lanka.
Chandana De Silva studied at St. Peters College, Colombo and started working in the aviation field for almost 4 decades. Joining Sri Lankan Airlines as a Manager, his tenure saw him rise to the position of Head of Corporate Communications of Sri Lankan Airlines. Most recently he joined Emirates Airlines. In one of the highest positions in the Airline and is currently working as the ‘Area Manager of Emirates for Sri Lanka and Maldives’. Amongst his many achievements in the Aviation industry, Mr. De Silva was instrumental in the opening of Emirates First branch office in Kandy. Under Mr. De Silva’s stewardship, the Emirates Sri Lanka station won the Outstanding Achievements Award in the Passenger category. A man of many his passions and interests, one of the most fascinating aspects of this unique gentleman is his repertoire for unique skills and hobbies, such as
• Rally driver
• holder of a private pilot license
• Golfer
• Avid Gardner
• Loves old Sinhala songs
• Passionate singer and dancer
The personification of versatility, Mr. De Silva in his own word describes his music career “If I go back to the late seventies or the early eighties, my biggest passion was music – singing and I played for the band called Topaz, which was very popular among music lovers at the time. I love that part of my life even though I am working for an airline. Music was very closer to my heart”. As a member of the Topaz band, he has played at several open-air shows in almost all parts of the country and were most noted for paying as the second band of Gypsies or Super Golden Chimes.
Your dedication and commitment to the betterment of the aviation industry is truly respected and appreciated.`
  },
  {
    id: 4,
    name: "Mohan Pandithage",
    year: "2023",
    experience: "42 Years",
    images: [p7, p8],
    bio: `Mr Mohan Pandithage, Chairman and Chief Executive of  Hayleys PLC was inducted into the Sri Lanka Aviation Hall of Fame hall in recognition of his outstanding contribution to the nation’s aviation and shipping industry. Mr. Pandithage was inducted into the hall of fame by Hon. Minister of Aviation Mr. Nimal Siripala De Silva, and the Hon. Deputy Speaker of Parliament Mr. Ajith Rajapakse in the presence of the eminent IAAC lecturer panel, and graduates at the IAAC Graduation ceremony 2023.    
Today under Mr. Pandithage’s diligent stewardship and stellar leadership. Hayley’s PLC has grown to be one of the country’s leading corporate entities. His induction into the Hall of Fame is representative of his dedication and commitment and a deserves recognition as a truly remarkable individual.`
  },
  {
    id: 5,
    name: "Sunil Malawana",
    year: "2023",
    experience: "28 Years",
    images: [p11, p12],
    bio: `The IAAC Awards Council has the distinct honor of inducting Mr. Sunil Malawana into the Sri Lanka Aviation Hall of Fame for 2023, in recognition of his unique and indelible contribution to the Aviation industry in Sri Lanka.
Mr.Sunil Malawana was always an inspired individual, driven by passion and a desire to stand amongst the giants of the freight forwarding industry, a journey that led to him becoming one of the nation’s foremost leaders and a giant in his own right in the freight forwarding industry. Inspiration never ceased for Mr.Malawana as his favorite hobby of music also led to him becoming one of the nation’s most popular musicians. From his beginning as a musician, he transitioned into the Garment Manufacturing sector and then to freight forwarding when he established Speedmark Transportation (Pvt.) Ltd. An international freight forwarder that pioneered supply chain management in Sri Lanka.
Since its inception, Mr. Malawana has helmed Speedmark and guided the company from a fledgling freight forwarded with just 7 employees to one of the Nation’s largest freight specialists, with over 150 employees, ranked among top 3 freight forwarders by IATA for the last two decades.
Your dedication and commitment to the betterment of the aviation industry is truly respected and appreciated.`
  },
  {
    id: 6,
    name: "Ramzeen Azeez",
    year: "2023",
    experience: "32 Years",
    images: [p9, p10],
    bio: `The IAAC Awards Council has the distinct honor of inducting Mr. Ramzeen Azeez into the Sri Lanka Aviation Hall of Fame for 2023, in recognition of his unique and indelible contribution to the Aviation industry in Sri Lanka.
“Give your best to whatever job you do. Civil Aviation is a as cinating and an adventurous career”. Mr. Ramzeen Azeez, is one of the most senior members of Sri Lanka’s Aviation industry, with well over a half century of experience under his belt. Soaring high on the wings of a career that took off in 1969 when he took up his first posting as a Radio Technician at the Department of Civil Aviation, Mr. Azeez’s career has taken him across the globe including training assignments in France, UK, USA, Canada, Singapore, and Pakistan, and job postings in Riyad,Saudi Arabia.
An individual of unwavering drive and determination Mr. Azeez rose to the rank of Airport Manager (BIA) in 2005. True to his nurturing spirit, Mr. Azeez has devoted the latter years of his career to his passion for teaching. Always the educator, Mr. Azeez never passed on an opportunity to educate the youth in Sri Lanka, or as he more affectionately referred to them “The Future of Aviation”. Known fondly as Azeez Sir by his students at the IAAC and in his other teaching assignments, he is beloved by all and looked upon as an expert in the aviation industry, whose expertise is only rivalled by the many.
Your dedication and commitment to the betterment of the aviation industry is truly respected and appreciated.`
  },
  {
    id: 7,
    name: "Keerthi Peiris",
    year: "2023/24",
    experience: "32 Years",
    images: [p13, p14],
    bio: `Mr. Keerthi Peiris Inducted into the Sri Lanka Aviation Hall of Fame
The IAAC Awards Council is honored to induct Mr. Keerthi Peiris, Head of Training and former AOC Chairman, into the Sri Lanka Aviation Hall of Fame for 2023/24. This prestigious recognition celebrates his exceptional and lasting contributions to the aviation industry in Sri Lanka as a true legend in aviation and a distinguished expert in customer service.
With an illustrious career spanning over 50 years, Mr. Peiris has become a pillar of excellence in airport operations and customer service. His journey reflects an unwavering commitment to elevating standards in the aviation industry, with landmark contributions across globally renowned airlines and organizations:
Air Ceylon (1974–1978) – Airport Assistant, laying the foundation for his remarkable career.
KLM (1978–1995)—Airport Officer, mastering operational efficiency and service quality.
Gulf Air (1995–1998) – Airport Manager, leading with distinction.
British Airways (1998–2003) – Airport Manager, delivering world-class service.
Oman Air (2004–2007) – Airport Manager, driving operational excellence.
Etihad Airways (2007–2010)—Airport Manager, raising customer experience to new levels.
Oman Air (2010–2020) – Handling Representative, ensuring consistent quality.
Royal Air Force Operations—Contributing to critical international aviation operations.
Hayleys Pvt Ltd (2019–2020)—Consultant for Airport Operations, sharing his expertise to uplift industry standards.
Today, as Head of Training at IAAC, Mr. Peiris continues to inspire and mentor the next generation of aviation professionals, instilling his passion for service and operational excellence. His leadership as former AOC Chairman further underscores his influence in shaping Sri Lanka’s aviation landscape.
The Hall of Fame Certificate was presented to Mr. Keerthi Peiris by Mr. Sunil Jayaratne, Chairman of the Civil Aviation Authority of Sri Lanka, in recognition of his remarkable achievements and lifelong dedication to aviation.`
  }
];

const HallOfFameProfile = ({ inductee }) => {
  return (
    <div className="min-h-screen bg-white font-sans py-12">
      <main className="max-w-6xl mx-auto p-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            {inductee.name} <span className="text-amber-500">| Hall of Fame</span>
          </h1>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><Trophy size={16} className="text-amber-600" /> Sri Lanka Aviation Hall of Fame</span>
            <span className="flex items-center gap-1"><Calendar size={16} /> Inducted in {inductee.year}</span>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl h-[400px] md:h-[500px]">
          <ImageSlideshow images={inductee.images} alt={inductee.name} />
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-6 flex items-center gap-2">
            <BookOpen size={18} /> Career Biography
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            {inductee.bio}
          </p>
        </div>
      </main>
    </div>
  );
};

// Updated App component to render all inductees
export default function App() {
  return (
    <div>
      {inductees.map((person) => (
        <HallOfFameProfile key={person.id} inductee={person} />
      ))}
    </div>
  );
}