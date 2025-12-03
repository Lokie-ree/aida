import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "lucide-react";
import { WelcomeHero } from "./WelcomeHero";
import { QuickAccessGrid } from "./QuickAccessGrid";
import { spacing } from "@/lib/spacing";

export interface DashboardProps {
  user: {
    name?: string;
    school?: string;
    subject?: string;
    gradeLevel?: string;
    email?: string;
  };
}

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();

  // Navigation handler - focus on core product: Prompt Coach
  const handleStartCoach = () => navigate('/coach');

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className={`max-w-7xl mx-auto ${spacing.container} ${spacing.containerY}`}>
        {/* Welcome Hero Section */}
        <div className="mb-6">
          <WelcomeHero
            user={user}
            onPrimaryAction={handleStartCoach}
          />
        </div>

        {/* Profile Completion Prompt */}
        {(!user.school || !user.subject || !user.gradeLevel) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert className="mb-6 border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:shadow-md hover:border-primary/30">
              <User className="h-4 w-4 text-primary" />
              <AlertDescription>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm sm:text-base">
                    Complete your profile to personalize your coaching experience.
                  </span>
                  <Button
                    size="sm"
                    variant="default"
                    className="sm:ml-4 bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/profile')}
                  >
                    Complete Profile
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Quick Access - Conversational Coach Focus */}
        <div className="mb-6">
          <QuickAccessGrid
            onStartCoach={handleStartCoach}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
