import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import RotatingText from "@/components/shared/RotatingText";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";

// Lazy load framer-motion to reduce initial bundle size
let motionModule: typeof import("framer-motion") | null = null;
let motionLoading = false;

const loadMotion = async () => {
  if (motionModule || motionLoading) return motionModule;
  motionLoading = true;
  motionModule = await import("framer-motion");
  motionLoading = false;
  return motionModule;
};

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

export function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  const [motionLoaded, setMotionLoaded] = useState(false);
  const [MotionDiv, setMotionDiv] = useState<React.ComponentType<any>>(() => ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>);
  const [MotionH1, setMotionH1] = useState<React.ComponentType<any>>(() => ({ children, className, ...props }: any) => <h1 className={className} {...props}>{children}</h1>);

  // Load framer-motion after initial render
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const loadMotionAsync = async () => {
      const motion = await loadMotion();
      if (motion) {
        setMotionDiv(() => motion.motion.div);
        setMotionH1(() => motion.motion.h1);
        setMotionLoaded(true);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadMotionAsync, { timeout: 2000 });
    } else {
      setTimeout(loadMotionAsync, 100);
    }
  }, []);

  // Animation variants
  const fadeInUp = motionLoaded ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : undefined;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Decorative Elements - Pelican Blue */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <MotionDiv
          {...(motionLoaded ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 }
          } : {})}
          className="inline-block mb-8"
        >
          <div className="relative px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <BorderBeam 
              colorFrom="hsl(var(--primary))"
              colorTo="hsl(var(--secondary))"
              size={60}
              duration={6}
            />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Guidance for Louisiana Educators</span>
            </div>
          </div>
        </MotionDiv>

        {/* Main Headline - More Compelling */}
        <MotionH1
          {...(motionLoaded ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.1 }
          } : {})}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground leading-tight font-heading"
        >
          Navigate AI with Confidence
          <br />
        </MotionH1>

        {/* Simplified Rotating Platform Names */}
        <MotionDiv
          {...(motionLoaded ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.2 }
          } : {})}
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
        </MotionDiv>

        {/* Simplified Value Proposition */}
        <MotionDiv
          {...(motionLoaded ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.3 }
          } : {})}
          className="mb-12 max-w-3xl mx-auto"
        >
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-primary">
            An intelligent coaching assistant that helps you generate <span className="text-foreground font-semibold">Louisiana-aligned prompts</span> for any AI tool. 
            <span className="text-foreground font-semibold"> Just describe what you're teaching</span>, and our coach asks clarifying questions like a colleague—then gives you a prompt ready to paste into ChatGPT, Claude, or whatever you already use.
          </p>
        </MotionDiv>

        {/* CTA Button */}
        <MotionDiv
          {...(motionLoaded ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.4 }
          } : {})}
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
            Free for Louisiana educators • Start your first conversation today
          </p>
        </MotionDiv>

        {/* Scroll Indicator */}
        <MotionDiv
          {...(motionLoaded ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay: 0.5 }
          } : {})}
          className="mt-16"
        >
          <ChevronDown 
            className="h-6 w-6 mx-auto text-muted-foreground animate-bounce" 
            aria-label="Scroll down for more information"
          />
        </MotionDiv>
      </div>
    </section>
  );
}
