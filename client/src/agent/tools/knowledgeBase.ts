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
    keywords: ['services', 'offers', 'what do you do', 'consulting', 'development', 'hire', 'work'],
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
    keywords: ['features', 'capabilities', 'can it', 'does it support', 'tools', 'memory'],
    category: 'product',
    content:
      'Key features: real-time streaming chat, a ReAct agent with tool use, persistent memory across sessions, conversation history, abort/cancel in-flight requests, and a critic pass that evaluates response quality before finalizing.',
  },
  // Tech
  {
    id: 'tech_stack',
    keywords: ['stack', 'technology', 'built with', 'groq', 'llm', 'model', 'vite'],
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
