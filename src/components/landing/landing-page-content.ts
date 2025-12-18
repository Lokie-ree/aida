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
    solution: "Tell our coach what standard you're teaching. It asks clarifying questions, then generates a Louisiana-aligned prompt you paste into ChatGPT or Claude to get differentiated 'I can' statements."
  },
  {
    component: "Lesson Planning",
    pain: "Not enough time to internalize the lesson plan and anticipate misconceptions",
    solution: "Describe your lesson topic to our coach. It understands your grade and subject context, then gives you a prompt to use in any AI tool that helps identify potential student misconceptions aligned to Louisiana standards."
  },
  {
    component: "Differentiation",
    pain: "I need to differentiate for my IEP students but don't know where to start",
    solution: "Share your lesson objective with our coach. It asks about your students' needs, then generates a prompt you can use in your preferred AI tool to create differentiated activities aligned to LER indicators."
  },
  {
    component: "Assessment Analysis",
    pain: "I have LEAP data but struggle to identify specific next steps for my students",
    solution: "Tell our coach about your assessment results. It helps you craft a prompt that analyzes your data through a Louisiana standards lens, giving you actionable insights you can use in any AI platform."
  },
  {
    component: "LER Evidence",
    pain: "I know what I'm doing well, but I struggle to articulate it in LEADS observation language",
    solution: "Describe a teaching moment to our coach. It asks targeted questions about LER indicators, then generates a prompt you paste into Claude or ChatGPT to help you articulate your practice using Louisiana Educator Rubric language."
  },
  {
    component: "Curriculum Internalization",
    pain: "I have curriculum resources but need help unpacking them for my specific students",
    solution: "Tell our coach about your curriculum and students. It asks clarifying questions about your context, then gives you a Louisiana-aligned prompt to use in any AI tool that helps you internalize and adapt the curriculum effectively."
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: "Just describe what you're teaching, and the AI coach asks smart questions like a colleague would—then gives you a prompt ready to paste into ChatGPT or Claude.",
    author: "Louisiana Educator",
    title: "Conversational Coaching"
  },
  {
    quote: "Finally, prompts that actually understand Louisiana standards and the Educator Rubric. No more generic AI outputs that don't fit our context.",
    author: "Louisiana Educator",
    title: "Louisiana-Specific Intelligence"
  },
  {
    quote: "It's not another tool to learn. It's like having a colleague help me write better prompts for the AI I already use. Game changer.",
    author: "Louisiana Educator",
    title: "Platform-Agnostic"
  },
  {
    quote: "The conversation feels natural, not like filling out a form. It actually understands what I'm trying to do in my classroom.",
    author: "Louisiana Educator",
    title: "Teacher-to-Teacher"
  },
  {
    quote: "Real conversations, not automation. Your honest feedback literally shapes what we build next.",
    author: "Louisiana Educator",
    title: "Building Together"
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
    answer: "You get immediate access to the Conversational Prompt Coach—our core product. Simply describe what you're teaching in a natural conversation, get Louisiana-aligned prompts you can copy and paste into any AI tool, and save them to your personal library. Your feedback shapes what we build next."
  },
  {
    question: "Do I need to be tech-savvy to benefit?",
    answer: "Not at all! The conversational interface is designed to feel natural. Just describe what you're teaching in plain language, and the coach guides you through generating a high-quality prompt. Whether you're an AI novice or an eager innovator, we meet you where you are."
  }
];

