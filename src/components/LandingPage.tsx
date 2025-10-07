import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BorderBeam } from "@/components/ui/border-beam";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import RotatingText from "@/components/RotatingText";
import GradientText from "@/components/GradientText";
import { 
  Sparkles, 
  Users, 
  BookOpen, 
  ArrowRight, 
  ChevronDown,
  CheckCircle,
  Quote,
  Target,
  Shield,
  Clock,
  Lightbulb,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Logo } from "./logo";

export function LandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const signupForBeta = useMutation(api.betaSignup.signupForBeta);

  const handleBetaSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await signupForBeta({ email });
      setIsSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Consistent color scheme - Blues and Golds
  const blueGradient = ['#0ea5e9', '#1e40af', '#0ea5e9'];
  const blueGoldGradient = ['#0ea5e9', '#f59e0b', '#0ea5e9'];
  const goldGradient = ['#f59e0b', '#fbbf24', '#f59e0b'];


  // Features based on brand guidelines
  const features = [
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

  // How it works - Louisiana alignment examples
  const louisianaExamples = [
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

  // Testimonials
  const testimonials = [
    {
      quote: "This isn't another tool to learn—it's guidance on using the tools I already have access to. I saved 4 hours last week on lesson planning alone!",
      author: "Sarah Johnson",
      title: "High School English Teacher, Jefferson Parish"
    },
    {
      quote: "The ethical guardrails give me confidence. I know I'm using AI responsibly while still saving time on administrative tasks.",
      author: "Michael Chen",
      title: "Elementary Math Teacher, Lafayette"
    },
    {
      quote: "Finally, AI guidance that understands Louisiana standards! The frameworks are specific, practical, and actually help me teach better.",
      author: "Dr. Lisa Rodriguez",
      title: "Middle School Science Teacher, Baton Rouge"
    },
    {
      quote: "Platform-agnostic means I can use whatever my district provides. No subscription fatigue, just better teaching strategies.",
      author: "James Williams",
      title: "Elementary Principal, New Orleans"
    },
    {
      quote: "The community aspect is incredible. I'm learning from other Louisiana educators who face the same challenges I do every day.",
      author: "Maria Garcia",
      title: "Special Education Teacher, Shreveport"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "Is this another AI tool I have to learn?",
      answer: "No! We teach you how to use whatever AI platform you already have access to—MagicSchool AI, Brisk, SchoolAI, Gemini, ChatGPT, or others. We're a guidance system, not a software product."
    },
    {
      question: "How is this aligned to Louisiana standards?",
      answer: "Every framework, prompt, and example is built specifically for Louisiana's educational standards and the Louisiana Educator Rubric. We understand your district's expectations and requirements."
    },
    {
      question: "What about ethical concerns and academic integrity?",
      answer: "Every framework includes clear ethical guardrails. We show you how to use AI as a productivity partner while maintaining academic integrity, protecting student privacy, and following district policies."
    },
    {
      question: "How much time will this actually save me?",
      answer: "Beta testers report saving 3-5 hours per week on lesson planning, email drafting, resource development, and administrative tasks. The time savings are immediate and measurable."
    },
    {
      question: "What's included in the beta program?",
      answer: "Beta testers get access to curated AI frameworks, weekly productivity prompts, bi-weekly office hours with facilitators, a community space to share innovations, and direct input into our development."
    },
    {
      question: "Do I need to be tech-savvy to benefit?",
      answer: "Not at all! We meet you where you are. Whether you're an AI novice or an eager innovator, we have guidance tailored to your readiness level. Start simple, grow at your pace."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                <img src="/icon.svg" alt="Pelican" className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-foreground">Pelican AI</span>
            </div>
          </div>

           <div className="flex items-center gap-2 sm:gap-4">
             <AnimatedThemeToggler className="p-2 rounded-lg hover:bg-accent/10 transition-colors" />
             <Button 
               size="lg" 
               onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
               className="bg-primary hover:bg-primary/90 transition-colors"
             >
               <span className="hidden sm:inline">Join Beta Program</span>
               <span className="sm:hidden">Join Beta</span>
             </Button>
           </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
        {/* Background */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Decorative Elements - Pelican Blue */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0ea5e9]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#1e40af]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8"
          >
            <div className="relative px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <BorderBeam 
                colorFrom="#0ea5e9"
                colorTo="#1e40af"
                size={60}
                duration={6}
              />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Curated AI Guidance for LA Educators</span>
              </div>
            </div>
          </motion.div>

          {/* Main Headline with RotatingText */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground"
          >
             <RotatingText 
               texts={[
                 "Reclaim Time.",
                 "Navigate AI.",
                 "Transform Practice.",
                 "Empower Teaching."
               ]}
               className="inline-block"
               elementLevelClassName="text-primary"
               rotationInterval={3000}
               staggerDuration={0.03}
             />
          </motion.h1>

           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
           >
             Platform-agnostic guidance that works with <span className="text-primary font-semibold">any AI tool</span> you already use. Designed specifically for Louisiana educators.
           </motion.p>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-sm text-muted-foreground">
              Louisiana educators save <span className="text-primary font-semibold">3-5 hours per week</span> with ethical AI guidance
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Join Beta Program - Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16"
          >
            <ChevronDown className="w-6 h-6 mx-auto text-muted-foreground animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Features Section with GlassIcons */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <GradientText 
                as="h2"
                colors={blueGradient}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Practical, Ethical AI Guidance
              </GradientText>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're not a software company. We're an educator-led support system helping you navigate AI with confidence.
            </motion.p>
          </motion.div>

           {/* Detailed Feature Cards with BorderBeam */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 relative overflow-hidden group">
                  <BorderBeam 
                    size={80} 
                    duration={8} 
                    delay={index * 2}
                    colorFrom="#0ea5e9"
                    colorTo="#1e40af"
                  />
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - Louisiana Framework Section */}
      <section id="how-it-works" className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <GradientText 
                as="h2"
                colors={blueGoldGradient}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Louisiana-Aligned AI Solutions
              </GradientText>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every framework addresses real Louisiana educator pain points with platform-agnostic AI solutions
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {louisianaExamples.map((example, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                  <BorderBeam 
                    size={60} 
                    duration={10} 
                    delay={index * 1.5}
                    colorFrom="#0ea5e9"
                    colorTo="#f59e0b"
                    borderWidth={2}
                  />
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-primary">{example.component}</Badge>
                    <CardTitle className="text-lg text-muted-foreground italic">
                      "{example.pain}"
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <p className="text-sm">{example.solution}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Beta Signup Section */}
      <section id="beta-signup" className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <GradientText 
                as="h2"
                colors={blueGradient}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Join the Beta Program
              </GradientText>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be among the first 50 Louisiana educators to access curated AI guidance frameworks, save time, and shape the future of AI in education.
            </motion.p>
          </motion.div>

          <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
            <BorderBeam 
              size={100} 
              duration={6}
              colorFrom="#0ea5e9"
              colorTo="#f59e0b"
              borderWidth={2}
            />
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Early Access Program</CardTitle>
              <CardDescription className="text-lg">
                Get exclusive access to AI frameworks designed specifically for Louisiana educators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleBetaSignup} className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 text-base py-3"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 px-6 py-3 text-base"
                    >
                      {isSubmitting ? "Joining..." : "Join Beta"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    No spam, ever. Unsubscribe at any time.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 bg-primary/10 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Welcome to the Beta Program!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check your email for next steps and exclusive updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section with Marquee */}
      <section className="py-20 px-6 bg-background overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <GradientText 
                as="h2"
                colors={blueGradient}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                What Louisiana Educators Are Saying
              </GradientText>
            </motion.div>
          </motion.div>

          <Marquee pauseOnHover className="[--duration:40s]">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="w-[300px] h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mx-2">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/60 mb-4" />
                  <p className="text-base italic mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Marquee>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <GradientText 
                as="h2"
                colors={blueGradient}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Common Questions
              </GradientText>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  {expandedFaq === index && (
                    <BorderBeam 
                      size={50} 
                      duration={4}
                      colorFrom="#0ea5e9"
                      colorTo="#1e40af"
                    />
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                      <ChevronDown 
                        className={`w-5 h-5 shrink-0 transition-transform text-primary ${expandedFaq === index ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </CardHeader>
                  {expandedFaq === index && (
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp}>
              <Card className="text-center relative overflow-hidden bg-background/80 backdrop-blur-sm border-2">
                <BorderBeam 
                  size={100} 
                  duration={6}
                  colorFrom="#0ea5e9"
                  colorTo="#1e40af"
                  borderWidth={3}
                />
                <CardContent className="p-12">
                  <motion.div variants={fadeInUp} className="mb-6">
                    <GradientText 
                      as="h2"
                      colors={['#0ea5e9', '#f59e0b', '#1e40af', '#f59e0b', '#0ea5e9']}
                      className="text-4xl md:text-5xl font-bold"
                      animationSpeed={3}
                      showBorder={false}
                    >
                      Ready to Transform Your Teaching?
                    </GradientText>
                  </motion.div>
                  <motion.p variants={fadeInUp} className="text-xl mb-8 text-muted-foreground">
                    Join Louisiana educators who are reclaiming their time and deepening their practice with ethical, platform-agnostic AI guidance.
                  </motion.p>
                  <motion.div variants={fadeInUp}>
                    <Button
                      size="lg"
                      onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white shadow-xl"
                    >
                      Join Beta Program - Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                  <img src="/icon.svg" alt="Pelican" className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-foreground">Pelican AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Created and supported by educators for educators
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Beta Program
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pelican AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}