import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import GradientText from "@/components/shared/GradientText";
import { spacing } from "@/lib/spacing";

export interface WelcomeHeroProps {
  user: {
    name?: string;
    school?: string;
    subject?: string;
    gradeLevel?: string;
  };
  onPrimaryAction?: () => void;
}

export function WelcomeHero({
  user,
  onPrimaryAction,
}: WelcomeHeroProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  // Personalized messaging focused on prompt generation
  const getPersonalizedMessage = () => {
    if (user.school && user.subject && user.gradeLevel) {
      return `Let's create Louisiana-aligned prompts for your ${user.subject} students`;
    }

    if (user.subject && user.gradeLevel) {
      return `Ready to create Louisiana-aligned prompts for Grade ${user.gradeLevel} ${user.subject}`;
    }

    if (user.subject) {
      return `Ready to generate Louisiana-aligned prompts for ${user.subject} education`;
    }

    return "Ready to create Louisiana-aligned prompts for your classroom";
  };

  const getMotivationalSubtext = () => {
    return "Your personal AI coach for Louisiana Educator Rubric-aligned teaching";
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
      className={`rounded-2xl ${spacing.card} border border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Personal Welcome */}
        <motion.div
          variants={fadeInUp}
          className="flex-1 min-w-0"
        >
          <h1 className="text-xl md:text-3xl font-bold text-foreground leading-tight">
            Welcome back,{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GradientText
                as="span"
                colors={['#0ea5e9', '#1e40af']}
                className="!mx-0 !inline-flex !px-0 !py-0 !rounded-none !cursor-default font-bold font-heading"
              >
                {user.name || "Educator"}
              </GradientText>
            </motion.span>!
          </h1>
          <div className="mt-1 max-w-2xl">
            <p className="text-muted-foreground text-base">
              {getPersonalizedMessage()}
            </p>
            <p className="text-primary/80 text-xs sm:text-sm font-medium mt-1">
              {getMotivationalSubtext()}
            </p>
            {user.school && user.subject && user.gradeLevel && (
              <p className="text-muted-foreground text-xs mt-1">
                <span className="font-medium">Grade {user.gradeLevel}</span>
                <span className="mx-2">•</span>
                <span className="font-medium">{user.subject}</span>
                <span className="mx-2">•</span>
                <span>{user.school}</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* Right: Primary Action - Start Coach */}
        <motion.div
          variants={fadeInUp}
          className="flex-shrink-0"
        >
          <Button
            size="lg"
            className="h-12 px-6 bg-primary hover:bg-primary/90 text-base font-semibold"
            onClick={onPrimaryAction}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2">Start Creating Prompts</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
