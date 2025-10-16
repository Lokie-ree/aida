import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import GradientText from "@/components/shared/GradientText";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/landingPageContent";

export function TestimonialsSection() {
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
    <section className="py-20 px-6 bg-background overflow-hidden">
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
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Louisiana Educators Leading the Way
            </GradientText>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Real stories from Louisiana educators who are already transforming their teaching with AI guidance.
          </motion.p>
        </motion.div>

        <Marquee pauseOnHover className="[--duration:90s] [--gap:0.5rem]" repeat={2}>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="w-[280px] sm:w-[300px] h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mx-2">
              <CardContent className="p-4 sm:p-6">
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/60 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base italic mb-4 sm:mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="text-sm sm:text-base font-semibold">{testimonial.author}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

