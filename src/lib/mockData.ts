import type { Profile, Post, Specialisation, Project } from './types';

export const mockProfile: Profile = {
  id: 1,
  name: 'James K. Mabunda',
  title: 'Senior Mining Engineer',
  tagline:
    'Optimising extraction processes and driving operational excellence across open-pit and underground mining operations in Southern Africa.',
  profile_image_url: '',
  landing_background_url: '',
  phone: '+27 82 456 7890',
  email: 'james.mabunda@miningpro.co.za',
  notification_email: 'james.mabunda@miningpro.co.za',
  bio: `With over 14 years of progressive experience in mining engineering, I specialise in mine planning, blast optimisation, and geotechnical assessment for large-scale open-pit and underground operations.

My career has spanned platinum, gold, coal, and chrome operations across South Africa, Botswana, and Mozambique. I hold a BEng (Mining Engineering) from the University of Pretoria and am a registered Professional Engineer with ECSA.

I am passionate about leveraging modern technology — including drone surveys, machine learning-assisted ore body modelling, and real-time fleet management systems — to drive measurable improvements in safety, productivity, and cost efficiency.

Outside of operations, I contribute to industry knowledge through technical publications, mentoring of graduate engineers, and active participation in SAIMM and GSSA conferences.`,
  linkedin_url: 'https://linkedin.com/in/jamesmabunda',
  facebook_url: 'https://facebook.com/jamesmabunda.mining',
  instagram_url: 'https://instagram.com/jmabunda_mining',
  x_url: 'https://x.com/jmabunda_eng',
  threads_url: '',
  whatsapp_url: 'https://wa.me/27824567890',
  show_linkedin: true,
  show_facebook: true,
  show_instagram: true,
  show_x: true,
  show_threads: false,
  show_whatsapp: true,
  cv_file_url: '',
  cv_file_name: 'James_Mabunda_CV_2024.pdf',
  demo_mode: true,
};

export const mockPosts: Post[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    text_content:
      'Completed the Phase 3 blast optimisation study at the Mogalakwena complex. We achieved a 12% reduction in powder factor while maintaining fragmentation targets below P80 of 350mm. The key was integrating high-precision drone photogrammetry with our blast design software to account for geological discontinuities in real time.\n\nFull technical report will be presented at the upcoming SAIMM symposium in Johannesburg.',
    image_urls: [],
    video_links: [
      {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        source: 'youtube',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      },
    ],
    slug: 'blast-optimisation-mogalakwena-phase3',
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    text_content:
      'Site visit to the new decline development at Shaft 4. The ground conditions are challenging — we are encountering a fault zone that was not fully characterised in the pre-feasibility study. Implemented additional support measures including 2.4m grouted bolts at 1.0m × 1.0m spacing with W-straps and 100mm shotcrete.\n\nSafety remains the absolute priority. Zero tolerance for shortcuts in ground support.',
    image_urls: [],
    video_links: [],
    slug: 'shaft4-decline-ground-support',
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    text_content:
      'Proud to have been invited as a keynote speaker at the Southern African Institute of Mining and Metallurgy (SAIMM) annual conference. My topic: "Integrating Machine Learning with Traditional Mine Planning — Practical Applications and Pitfalls."\n\nThe mining industry is at an inflection point. Those who embrace data-driven decision making while respecting fundamental geological and engineering principles will lead the next generation of operations.',
    image_urls: [],
    video_links: [],
    slug: 'saimm-keynote-ml-mine-planning',
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    text_content:
      'Fleet management optimisation project update: After implementing the new dispatch algorithm at our open-pit operation, we have seen a 9% improvement in truck utilisation and a 15% reduction in queue times at the primary crusher. The system now dynamically adjusts routing based on real-time payload data, road conditions, and crusher throughput.\n\nNext phase: integrating autonomous haulage compatibility into the dispatch logic.',
    image_urls: [],
    video_links: [],
    slug: 'fleet-management-dispatch-optimisation',
  },
  {
    id: '5',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    text_content:
      'Conducted a slope stability assessment on the eastern wall of the main pit. Using a combination of limit equilibrium analysis (Slide2) and finite element modelling (RS2), we confirmed that the current inter-ramp angle of 48° provides an adequate factor of safety of 1.35 for static conditions and 1.05 for pseudo-static (seismic) loading.\n\nRecommended installing additional piezometers at 30m spacing along the critical bench to monitor pore pressure variations during the wet season.',
    image_urls: [],
    video_links: [],
    slug: 'slope-stability-eastern-wall-assessment',
  },
];

export const mockSpecialisations: Specialisation[] = [
  {
    id: '1',
    display_order: 1,
    title: 'Blast Design & Optimisation',
    description:
      'Precision blast engineering using advanced modelling software and drone-based face profiling to optimise fragmentation while minimising environmental impact.',
    icon_url: '',
    visible: true,
  },
  {
    id: '2',
    display_order: 2,
    title: 'Open Pit Mine Planning',
    description:
      'Strategic and tactical mine planning for open-pit operations including pit optimisation, scheduling, cut-off grade analysis, and haul road design.',
    icon_url: '',
    visible: true,
  },
  {
    id: '3',
    display_order: 3,
    title: 'Slope Stability Analysis',
    description:
      'Geotechnical assessment of pit slopes using limit equilibrium and numerical methods to ensure safe and economically optimal wall angles.',
    icon_url: '',
    visible: true,
  },
  {
    id: '4',
    display_order: 4,
    title: 'Underground Support Design',
    description:
      'Design of ground support systems for tunnels, declines, and stopes in varying geotechnical conditions, from competent rock to weak fault zones.',
    icon_url: '',
    visible: true,
  },
  {
    id: '5',
    display_order: 5,
    title: 'Fleet Management Systems',
    description:
      'Implementation and optimisation of real-time dispatch and fleet management systems to maximise equipment utilisation and reduce operating costs.',
    icon_url: '',
    visible: true,
  },
  {
    id: '6',
    display_order: 6,
    title: 'Mine Ventilation',
    description:
      'Ventilation network design and optimisation for underground operations using computational fluid dynamics and ventilation simulation software.',
    icon_url: '',
    visible: true,
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    display_order: 1,
    title: 'Mogalakwena PGM Expansion',
    description:
      'Led the mine planning and blast optimisation workstream for the Phase 3 expansion of the Mogalakwena platinum group metals open-pit operation. Delivered a 12% improvement in powder factor efficiency and supported a 15% increase in annual ROM tonnage through optimised pushback sequencing.',
    category: 'Open Pit',
    image_url: '',
    start_date: 'Jan 2022',
    end_date: 'Present',
    visible: true,
  },
  {
    id: '2',
    display_order: 2,
    title: 'Twickenham Underground Development',
    description:
      'Managed the geotechnical design and ground support specification for 3.2km of decline development in challenging geological conditions. Implemented a risk-based support design methodology that reduced support costs by 18% while maintaining safety compliance.',
    category: 'Underground',
    image_url: '',
    start_date: 'Mar 2020',
    end_date: 'Dec 2022',
    visible: true,
  },
  {
    id: '3',
    display_order: 3,
    title: 'Moatize Coal Fleet Optimisation',
    description:
      'Deployed a real-time fleet management and dispatch system across a 40-truck coal haulage operation in Mozambique. Achieved 9% improvement in truck utilisation and 15% reduction in crusher queue times within the first quarter of operation.',
    category: 'Open Pit',
    image_url: '',
    start_date: 'Jun 2019',
    end_date: 'Feb 2020',
    visible: true,
  },
  {
    id: '4',
    display_order: 4,
    title: 'Venetia Diamond Mine Slope Study',
    description:
      'Conducted a comprehensive slope stability assessment for the eastern wall of the main pit ahead of the transition to underground block caving. Utilised 3D numerical modelling and real-time piezometric monitoring to validate inter-ramp design angles.',
    category: 'Consulting',
    image_url: '',
    start_date: 'Aug 2018',
    end_date: 'May 2019',
    visible: true,
  },
];

export const mockData = {
  profile: mockProfile,
  posts: mockPosts,
  specialisations: mockSpecialisations,
  projects: mockProjects,
};