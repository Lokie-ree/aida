import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import RotatingText from "@/components/shared/RotatingText";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

export function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
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
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Guidance for Louisiana Educators</span>
            </div>
          </div>
        </motion.div>

        {/* Main Headline - More Compelling */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground leading-tight font-heading"
        >
          Navigate AI with Confidence
          <br />
        </motion.h1>

        {/* Simplified Rotating Platform Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-center">
            <RotatingText 
              texts={[
                "MagicSchool AI",
                "Brisk", 
                "Gemini",
                "ChatGPT",
                "ANY AI Tool"
              ]}
              className="inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-heading"
              elementLevelClassName="text-primary font-bold font-heading"
              rotationInterval={3000}
              staggerDuration={0.03}
            />
          </div>
        </motion.div>

        {/* Simplified Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-primary">
            Platform-agnostic guidance frameworks for Louisiana educators. 
            <span className="text-foreground font-semibold"> Save 3-5 hours per week</span> with 
            <span className="text-foreground font-semibold"> ethical AI use</span> on any tool your district provides.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
        >
          <Button
            size="lg"
            onClick={onGetStartedClick}
            className="text-xl px-10 py-7 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto font-semibold font-primary"
          >
            Get Started
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Free for Louisiana educators • Start using AI frameworks today
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16"
        >
          <ChevronDown 
            className="h-6 w-6 mx-auto text-muted-foreground animate-bounce" 
            aria-label="Scroll down for more information"
          />
        </motion.div>
      </div>
    </section>
  );
}

