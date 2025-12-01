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
    title: "Conversational AI Coach",
    description: "Describe what you're teaching, and our intelligent coach asks clarifying questions like a colleague—then generates Louisiana-aligned prompts you can use in ANY AI tool."
  },
  {
    icon: Target,
    title: "Louisiana Standards Aligned",
    description: "Every generated prompt demonstrates knowledge of Louisiana's educational standards, the Louisiana Educator Rubric, and LEADS evaluation framework."
  },
  {
    icon: Shield,
    title: "Platform-Agnostic Guidance",
    description: "Works with whatever AI tool you already use—ChatGPT, Claude, Gemini, MagicSchool AI, or others. We generate prompts, not lock you into our platform."
  },
  {
    icon: Clock,
    title: "Quality Over Speed",
    description: "Better aligned, more thoughtful prompts that improve your practice—not just faster prompts that save time."
  },
  {
    icon: Users,
    title: "Teacher-to-Teacher Voice",
    description: "Built by a Louisiana educator for Louisiana educators. Authentic conversations, not corporate EdTech speak."
  },
  {
    icon: Lightbulb,
    title: "Intelligent Prompt Library",
    description: "Save successful prompts, refine them based on classroom feedback, and build your personal library of Louisiana-aligned AI prompts."
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
    author: "Louisiana Educator",
    title: "Building Together"
  },
  {
    quote: "We're Not Waiting for LDOE - Louisiana educators building practical AI guidance NOW.",
    author: "Louisiana Educator",
    title: "Grassroots Launch"
  },
  {
    quote: "Just describe what you're teaching, and the AI coach asks smart questions like a colleague would—then gives you a prompt ready to paste into ChatGPT or Claude.",
    author: "Louisiana Educator",
    title: "Conversational Coaching"
  },
  {
    quote: "Real conversations, not automation. Your honest feedback literally shapes what we build next.",
    author: "Louisiana Educator",
    title: "Building Together"
  },
  {
    quote: "Finally, prompts that actually understand Louisiana standards and the Educator Rubric. No more generic AI outputs that don't fit our context.",
    author: "Louisiana Educator",
    title: "Louisiana-Specific Intelligence"
  }
];

export const faqs: FAQ[] = [
  {
    question: "Is this another AI tool I have to learn?",
    answer: "No! Pelican AI is a conversational coach that helps you generate better prompts for whatever AI tool you already use—ChatGPT, Claude, Gemini, MagicSchool AI, or others. We're a guidance layer, not a replacement for your existing AI tools."
  },
  {
    question: "How does the conversational coach work?",
    answer: "Simply describe what you're teaching (grade, subject, topic, challenge). Our AI coach asks clarifying questions like a colleague would, then generates a Louisiana-aligned prompt you can copy and paste into your preferred AI tool. The conversation feels natural, not like filling out a form."
  },
  {
    question: "How is this aligned to Louisiana standards?",
    answer: "Every generated prompt demonstrates knowledge of Louisiana's educational standards, the Louisiana Educator Rubric, and LEADS evaluation framework. The coach understands your context and generates prompts that reference specific LER indicators and LSS standards relevant to what you're teaching."
  },
  {
    question: "What about ethical concerns and academic integrity?",
    answer: "Every generated prompt includes clear ethical guardrails. We show you how to use AI as a productivity partner while maintaining academic integrity, protecting student privacy, and following district policies. The coach helps you generate prompts that improve your practice, not replace your teaching."
  },
  {
    question: "Can I save and reuse prompts?",
    answer: "Yes! Every generated prompt can be saved to your personal library. You can mark prompts that worked well in your classroom, add notes for refinement, and build a collection of Louisiana-aligned prompts tailored to your teaching context."
  },
  {
    question: "What's included when I sign up?",
    answer: "You get immediate access to the Conversational Prompt Coach—our core product. Describe what you're teaching, get Louisiana-aligned prompts, and save them to your library. We also provide a Framework Library with exemplar prompts from successful beta conversations. Your feedback shapes what we build next."
  },
  {
    question: "Do I need to be tech-savvy to benefit?",
    answer: "Not at all! The conversational interface is designed to feel natural. Just describe what you're teaching in plain language, and the coach guides you through generating a high-quality prompt. Whether you're an AI novice or an eager innovator, we meet you where you are."
  }
];

