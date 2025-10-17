import { LucideIcon, BookOpen, Target, Shield, Clock, Users, Lightbulb } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface LouisianaExample {
  component: string;
  pain: string;
  solution: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Platform-Agnostic Guidance",
    description: "Learn to use ANY AI tool effectively—MagicSchool AI, Brisk, SchoolAI, Gemini, or others. We teach principles, not platforms."
  },
  {
    icon: Target,
    title: "Louisiana Standards Aligned",
    description: "Every framework and prompt is designed specifically for Louisiana's educational standards and the Louisiana Educator Rubric."
  },
  {
    icon: Shield,
    title: "Ethical Guardrails Built-In",
    description: "Clear guidance on academic integrity, data privacy, and responsible AI use that aligns with district policies."
  },
  {
    icon: Clock,
    title: "Reclaim 3-5 Hours Per Week",
    description: "Practical solutions for lesson planning, email drafting, differentiation, and admin tasks that save real time."
  },
  {
    icon: Users,
    title: "Community-Driven Learning",
    description: "Share innovations with Louisiana educators. Learn from peers who understand your classroom challenges."
  },
  {
    icon: Lightbulb,
    title: "Educator-First Approach",
    description: "No corporate jargon. No tech-speak. Just practical advice from educators for educators."
  }
];

export const louisianaExamples: LouisianaExample[] = [
  {
    component: "Standards Alignment",
    pain: "It takes so long to unpack standards and write clear, measurable objectives",
    solution: "Use any AI platform to analyze a state standard and generate three differentiated 'I can' statements in 30 seconds"
  },
  {
    component: "Resource Development",
    pain: "I struggle to find high-quality texts that align with my unit and students' reading levels",
    solution: "Upload your curriculum guide to any AI platform, then ask it to find and summarize primary sources"
  },
  {
    component: "Lesson Planning",
    pain: "Not enough time to internalize the lesson plan and anticipate misconceptions",
    solution: "Ask any AI tool: 'What are 3 potential misconceptions students might have about this topic?'"
  },
  {
    component: "High Expectations",
    pain: "Creating exemplar work to set a vision for 'what good looks like' is time-consuming",
    solution: "Provide your rubric and prompt, ask AI to generate an 'A' level and 'C' level response with explanations"
  },
  {
    component: "Student Engagement",
    pain: "I want more engaging activities, but I'm drawing a blank on new ideas",
    solution: "Describe your lesson and ask for three engagement strategies: kinesthetic, verbal, and logical"
  },
  {
    component: "Parent Communication",
    pain: "Drafting newsletters and parent emails takes up my entire planning period",
    solution: "Ask any AI platform to write professional emails with suggestions for at-home support"
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: "Will you be the first to share your success story?",
    author: "[Your Name Here]",
    title: "[Your School Here]"
  },
  {
    quote: "Join Louisiana educators shaping the future of AI in education",
    author: "[Your Name Here]",
    title: "[Your School Here]"
  },
  {
    quote: "Be part of the movement that's reclaiming time for what matters",
    author: "[Your Name Here]",
    title: "[Your School Here]"
  },
  {
    quote: "Help us build the AI guidance Louisiana educators actually need",
    author: "[Your Name Here]",
    title: "[Your School Here]"
  },
  {
    quote: "Your feedback will directly shape what we create next",
    author: "[Your Name Here]",
    title: "[Your School Here]"
  }
];

export const faqs: FAQ[] = [
  {
    question: "Is this another AI tool I have to learn?",
    answer: "No! We teach you how to use whatever AI platform you already have access to—MagicSchool AI, Brisk, SchoolAI, Gemini, ChatGPT, or others. We're a guidance system, not a software product."
  },
  {
    question: "How is this aligned to Louisiana standards?",
    answer: "Our framework and prompts are built specifically for Louisiana's educational standards and the Louisiana Educator Rubric. We understand your district's expectations and requirements, and we co-create additional frameworks based on what Louisiana educators actually need."
  },
  {
    question: "What about ethical concerns and academic integrity?",
    answer: "Every framework includes clear ethical guardrails. We show you how to use AI as a productivity partner while maintaining academic integrity, protecting student privacy, and following district policies."
  },
  {
    question: "How much time will this actually save me?",
    answer: "Our Lesson Objective Unpacker saves 7-12 minutes per lesson planned. With 5-10 lessons planned weekly, that's 35-120 minutes saved just on objective unpacking and success criteria creation. As we co-create additional frameworks based on YOUR pain points, time savings compound."
  },
  {
    question: "What's the beta program timeline?",
    answer: "The beta program runs for 8-12 weeks. You'll start with our Lesson Objective Unpacker framework (saves 7-12 minutes per lesson), then co-create additional frameworks based on YOUR pain points. Weekly check-ins and bi-weekly office hours ensure we're building what Louisiana educators actually need."
  },
  {
    question: "What's included in the beta program?",
    answer: "Beta testers start with our AI-assisted lesson planning framework, then co-create additional frameworks with us. You get weekly prompts via email, feedback surveys, bi-weekly office hours, and direct influence on what we build next. This isn't just testing—it's collaborative development based on YOUR needs. Platform access comes in Phase 2."
  },
  {
    question: "Do I need to be tech-savvy to benefit?",
    answer: "Not at all! We meet you where you are. Whether you're an AI novice or an eager innovator, we have guidance tailored to your readiness level. Start simple, grow at your pace."
  }
];

