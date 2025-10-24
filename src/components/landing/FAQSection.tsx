import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import GradientText from "@/components/shared/GradientText";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/landingPageContent";

export function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
    <section id="faq" className="py-20 px-6 bg-muted/30">
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
              Questions from Louisiana Educators
            </GradientText>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 font-primary">
            Everything you need to know about joining Louisiana's first platform-agnostic AI guidance program.
          </motion.p>
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
                className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative overflow-hidden"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                role="button"
                tabIndex={0}
                aria-expanded={expandedFaq === index}
                aria-label={`${expandedFaq === index ? 'Collapse' : 'Expand'} FAQ: ${faq.question}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedFaq(expandedFaq === index ? null : index);
                  }
                }}
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
                    <CardTitle className="text-lg text-left font-heading">{faq.question}</CardTitle>
                    <ChevronDown 
                      className={`h-5 w-5 shrink-0 transition-transform text-primary ${expandedFaq === index ? 'rotate-180' : ''}`}
                    />
                  </div>
                </CardHeader>
                {expandedFaq === index && (
                  <CardContent>
                    <p className="text-muted-foreground font-primary">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

