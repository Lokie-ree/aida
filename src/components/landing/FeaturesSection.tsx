import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import GradientText from "@/components/shared/GradientText";
import { features } from "@/data/landingPageContent";

export function FeaturesSection() {
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

  const blueGradient = ['#0ea5e9', '#1e40af', '#0ea5e9'];

  return (
    <section className="py-20 px-6 bg-muted/30">
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
              colors={blueGradient}
              className="text-4xl md:text-5xl font-bold mb-4 font-heading"
            >
              Built by Louisiana Educators, For Louisiana Educators
            </GradientText>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-primary">
            We're not another AI tool to learn. We're Louisiana educators helping Louisiana educators 
            <span className="text-foreground font-semibold"> use whatever AI platform you already have {" "}</span> 
            more effectively, ethically, and aligned to our state standards.
          </motion.p>
        </motion.div>

        {/* Feature Cards with BorderBeam */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative overflow-hidden group">
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
                  <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base font-primary">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

