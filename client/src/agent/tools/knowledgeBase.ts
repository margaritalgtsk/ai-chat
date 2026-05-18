export type KBCategory = 'people' | 'product' | 'company' | 'tech';

export type KBEntry = {
  id: string;
  keywords: string[];
  category: KBCategory;
  content: string;
};

export const KNOWLEDGE_BASE: KBEntry[] = [
  // People
  {
    id: 'person_alina',
    keywords: ['alina', 'semenova', 'founder', 'lead developer', 'ceo'],
    category: 'people',
    content:
      'Alina Semenova is the founder and lead developer of the studio. She specializes in full-stack web development, React, Node.js, and AI-powered applications. She is based in Limassol, Cyprus and leads client engagements end-to-end.',
  },
  {
    id: 'person_max',
    keywords: ['max', 'petrov', 'designer', 'ui', 'ux'],
    category: 'people',
    content:
      'Max Petrov is the UI/UX designer on the team. He focuses on clean, minimal interfaces and has deep experience with Figma, design systems, and mobile-first design. Max joined the studio in 2023.',
  },
  {
    id: 'person_sofia',
    keywords: ['sofia', 'chen', 'backend', 'devops', 'infrastructure', 'engineer'],
    category: 'people',
    content:
      'Sofia Chen is the backend engineer and DevOps lead. She manages cloud infrastructure, CI/CD pipelines, and server-side architecture using Node.js and AWS. She has a strong background in distributed systems.',
  },
  {
    id: 'person_ivan',
    keywords: ['ivan', 'korolev', 'mobile', 'ios', 'android', 'react native'],
    category: 'people',
    content:
      'Ivan Korolev is the mobile developer on the team. He builds cross-platform apps with React Native and has shipped apps on both iOS and Android. He also contributes to the frontend on web projects.',
  },
  {
    id: 'team_overview',
    keywords: ['team', 'team members', 'who', 'staff', 'people', 'everyone', 'crew'],
    category: 'people',
    content:
      'The studio team consists of four people: Alina Semenova (founder & lead developer), Max Petrov (UI/UX designer), Sofia Chen (backend engineer & DevOps lead), and Ivan Korolev (mobile developer).',
  },
  // Company
  {
    id: 'company_location',
    keywords: ['limassol', 'office', 'location', 'where', 'cyprus', 'based'],
    category: 'company',
    content:
      'The studio is headquartered in Limassol, Cyprus. Limassol has a Mediterranean climate with warm, dry summers and mild winters. The office is open Monday to Friday, 9:00–18:00 EET (Eastern European Time, UTC+2/+3).',
  },
  {
    id: 'company_services',
    keywords: ['services', 'offers', 'what do you do', 'consulting', 'development', 'hire', 'work', 'looking for a developer', 'need a developer', 'find a developer', 'looking for help'],
    category: 'company',
    content:
      'The studio offers custom software development, UI/UX design, technical consulting, and AI integration. Typical engagements include web apps, mobile apps, API design, and AI-powered features. Project-based and retainer contracts are available.',
  },
  {
    id: 'company_contact',
    keywords: ['contact', 'email', 'reach', 'get in touch', 'schedule', 'inquiry'],
    category: 'company',
    content:
      'You can reach the studio at hello@studio.dev. For project inquiries, book a discovery call via the website contact form. Response time is typically within 1 business day.',
  },
  {
    id: 'company_values',
    keywords: ['values', 'culture', 'principles', 'how you work', 'approach'],
    category: 'company',
    content:
      'The studio values simplicity, transparency, and iterative delivery. We ship working software early and refine based on feedback. We avoid over-engineering and prefer pragmatic solutions over theoretical perfection.',
  },
  {
    id: 'company_pricing',
    keywords: ['price', 'pricing', 'cost', 'how much', 'rates', 'hourly rate', 'budget', 'expensive', 'cheap', 'affordable', 'fee', 'charge', 'quote', 'estimate'],
    category: 'company',
    content:
      'Pricing depends on project scope and engagement model. Hourly rates range from $60–$120/hour depending on the specialist. A typical small web app (4–8 weeks) starts at $8,000–$15,000. Fixed-price quotes are available after a paid discovery phase. We provide a detailed estimate before any commitment.',
  },
  {
    id: 'company_timeline',
    keywords: ['timeline', 'how long', 'duration', 'deadline', 'when', 'delivery', 'turnaround', 'time to build', 'how fast', 'schedule', 'mobile app', 'web app', 'application', 'app development', 'build an app'],
    category: 'company',
    content:
      'Project timelines vary by scope: a landing page or MVP takes 2–4 weeks, a full web or mobile app typically 6–16 weeks. Complex platforms with integrations can take 3–6 months. We share a detailed project plan with milestones before kickoff and provide weekly progress updates.',
  },
  {
    id: 'company_process',
    keywords: ['process', 'workflow', 'how do you work', 'methodology', 'steps', 'phases', 'discovery', 'sprint', 'agile', 'kickoff', 'what happens next'],
    category: 'company',
    content:
      'Our process: 1) Discovery — we clarify requirements, define scope, and produce a technical spec (1–2 weeks). 2) Design — wireframes and UI mockups for approval. 3) Development — iterative sprints with regular demos. 4) QA & Delivery — testing, staging deploy, client acceptance. 5) Handoff — documentation, source code, and optional support contract.',
  },
  {
    id: 'company_engagement_models',
    keywords: ['fixed price', 'time and material', 'retainer', 'contract type', 'billing', 'payment model', 'monthly', 'hourly', 'dedicated team'],
    category: 'company',
    content:
      'We offer three engagement models: Fixed Price — best for well-defined projects with a clear spec; Time & Material — best for evolving scope, billed monthly by actual hours; Retainer — a set number of hours per month for ongoing feature work or support. We recommend Fixed Price for MVPs and T&M for long-term product development.',
  },
  {
    id: 'company_portfolio',
    keywords: ['portfolio', 'examples', 'case studies', 'previous work', 'past projects', 'clients', 'references', 'showcase', 'samples'],
    category: 'company',
    content:
      'We have delivered projects across SaaS platforms, marketplace apps, internal tools, and AI-powered products. Case studies are available on request — we share relevant examples that match your industry or tech stack. Contact us at hello@studio.dev to request a portfolio review call.',
  },
  {
    id: 'company_nda',
    keywords: ['nda', 'non-disclosure', 'confidentiality', 'ip', 'intellectual property', 'ownership', 'source code ownership', 'privacy', 'secure'],
    category: 'company',
    content:
      'We sign NDAs before any project discussion upon request. All source code and intellectual property developed for a client is fully transferred to the client upon final payment. We do not reuse client-specific code in other projects.',
  },
  {
    id: 'company_industries',
    keywords: ['industry', 'industries', 'sector', 'domain', 'fintech', 'healthcare', 'e-commerce', 'startup', 'enterprise', 'experience in', 'worked with'],
    category: 'company',
    content:
      'We have experience across multiple industries: fintech (payment flows, dashboards), e-commerce (marketplaces, custom storefronts), SaaS (B2B tools, subscription platforms), healthcare (patient portals, scheduling), and internal enterprise tools. We adapt quickly to new domains — a short discovery phase is enough to get up to speed.',
  },
  {
    id: 'company_support',
    keywords: ['support', 'maintenance', 'after delivery', 'post-launch', 'bug fix', 'updates', 'ongoing', 'long-term', 'warranty'],
    category: 'company',
    content:
      'After delivery, we offer a 30-day warranty period covering bugs related to our work at no extra charge. For ongoing support, we offer monthly retainer plans starting at 10 hours/month. This covers bug fixes, minor updates, dependency upgrades, and monitoring. Support contracts can be cancelled with 30 days notice.',
  },
  {
    id: 'company_start',
    keywords: ['get started', 'start', 'next steps', 'how to hire', 'onboarding', 'first step', 'begin', 'kick off', 'ready to start', 'interested'],
    category: 'company',
    content:
      'To get started: 1) Send a brief project description to hello@studio.dev or fill out the contact form on our website. 2) We schedule a free 30-minute discovery call to understand your goals. 3) We send a scope estimate and proposal within 3 business days. 4) Once approved, we sign a contract and kick off the discovery phase. No commitment required until the proposal is signed.',
  },
  // Product
  {
    id: 'product_ai_chat',
    keywords: ['ai chat', 'chat app', 'this app', 'product', 'what is this'],
    category: 'product',
    content:
      'This AI chat application is built around a client-side ReAct agent (Reasoning + Acting loop). It supports streaming responses, tool use (internal search, memory, time), and multi-session chat history persisted in localStorage.',
  },
  {
    id: 'product_features',
    keywords: ['features', 'capabilities', 'can it', 'does it support', 'tools', 'memory', 'what can you do', 'what do you do', 'do for me', 'actually do'],
    category: 'product',
    content:
      'Key features: real-time streaming chat, a ReAct agent with tool use, persistent memory across sessions, conversation history, abort/cancel in-flight requests, and a critic pass that evaluates response quality before finalizing.',
  },
  // Tech
  {
    id: 'tech_stack',
    keywords: ['stack', 'technology', 'built with', 'groq', 'llm', 'model', 'vite', 'built', 'how is this', 'how was this', 'architecture', 'how it works'],
    category: 'tech',
    content:
      'Frontend: React 19, TypeScript, Redux Toolkit, Vite. Backend: Node.js, Express, Groq API (llama-3.3-70b-versatile). Agent: custom ReAct loop running entirely client-side with Zod schema validation.',
  },
  {
    id: 'tech_react',
    keywords: ['react version', 'latest react', 'react 19'],
    category: 'tech',
    content: 'The project uses React 19, the latest stable release. React 19 introduced the Actions API, useActionState, useOptimistic, and first-class support for async transitions.',
  },
  {
    id: 'tech_redux',
    keywords: ['redux', 'state management', 'redux toolkit'],
    category: 'tech',
    content: 'State management uses Redux Toolkit 2.x with Redux Listener Middleware for side effects like persisting chat to localStorage. The store has a single chat reducer managing sessions and messages.',
  },
];
