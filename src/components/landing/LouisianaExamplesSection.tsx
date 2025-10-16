import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import GradientText from "@/components/shared/GradientText";
import { Sparkles, Target } from "lucide-react";
import { louisianaExamples } from "@/data/landingPageContent";

export function LouisianaExamplesSection() {
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

  const blueGoldGradient = ['#0ea5e9', '#f59e0b', '#0ea5e9'];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
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
              Your Pain Points. Our Solutions. Together.
            </GradientText>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We start with the <span className="text-foreground font-semibold">Lesson Objective Unpacker</span>—saving you 7-12 minutes per lesson. 
            Then <span className="text-foreground font-semibold">YOU tell us what to build next</span> based on your biggest challenges. 
            This is collaborative development, not just testing.
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

        {/* Co-creation Callout Card */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12"
        >
          <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
            <BorderBeam 
              size={100} 
              duration={8}
              colorFrom="#0ea5e9"
              colorTo="#f59e0b"
              borderWidth={2}
            />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                Beta Testers Drive Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-base">
                <li className="flex items-start gap-2">
                  <span className="text-xl shrink-0">📅</span>
                  <span><strong>Week 1-2:</strong> Master the Lesson Objective Unpacker</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl shrink-0">📊</span>
                  <span><strong>Week 3-4:</strong> Share your biggest pain points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl shrink-0">🛠️</span>
                  <span><strong>Week 5-12:</strong> Co-create NEW frameworks together</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl shrink-0">🎯</span>
                  <span><strong>Your feedback</strong> directly shapes what we build next</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

