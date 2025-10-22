import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import GradientText from "@/components/shared/GradientText";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onGetStartedClick: () => void;
}

export function CTASection({ onGetStartedClick }: CTASectionProps) {
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

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp}>
            <Card className="text-center relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
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
                    className="text-4xl md:text-5xl font-bold font-heading"
                    animationSpeed={3}
                    showBorder={false}
                  >
                    Ready to Get Started with AI?
                  </GradientText>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-xl mb-8 text-muted-foreground leading-relaxed font-primary">
                  Access <span className="text-foreground font-semibold">platform-agnostic AI guidance frameworks</span> that save 
                  <span className="text-foreground font-semibold"> 3-5 hours per week</span>. Use with any AI tool your district provides. 
                  <span className="text-foreground font-semibold"> Start saving time today.</span>
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Button
                    size="lg"
                    onClick={onGetStartedClick}
                    className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white shadow-xl w-full sm:w-auto font-primary"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

