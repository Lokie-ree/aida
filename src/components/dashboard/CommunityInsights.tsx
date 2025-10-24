import { motion } from "framer-motion";
import { Users, Quote, MapPin, Clock, TrendingUp, Heart, MessageCircle } from "lucide-react";

export interface Testimonial {
  _id: string;
  quote: string;
  userName: string;
  school: string;
  subject: string;
  timeSaved?: number;
  impact: string;
  featured?: boolean;
}

export interface CommunityInsightsProps {
  testimonials: Testimonial[];
  onViewAll?: () => void;
  className?: string;
  communityStats?: {
    totalEducators: number;
    innovationsThisWeek: number;
    averageTimeSaved: number;
    activeThisWeek: number;
  };
}

export function CommunityInsights({ 
  testimonials, 
  onViewAll,
  communityStats,
  className = ""
}: CommunityInsightsProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const featuredTestimonials = testimonials.slice(0, 2);

  if (featuredTestimonials.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-heading">Louisiana Educator Community</h2>
            <p className="text-muted-foreground">Real feedback from your fellow educators</p>
          </div>
        </div>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      {/* Community Pulse - Dynamic Activity Indicators */}
      {communityStats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6 p-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl border border-secondary/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-secondary-600" />
            <h3 className="text-sm font-semibold text-foreground">Community Pulse</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-primary">{communityStats.totalEducators}</span>
              </div>
              <p className="text-xs text-muted-foreground">Louisiana Educators</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="h-4 w-4 text-secondary-600" />
                <span className="text-lg font-bold text-secondary-600">{communityStats.innovationsThisWeek}</span>
              </div>
              <p className="text-xs text-muted-foreground">Innovations This Week</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-accent-600" />
                <span className="text-lg font-bold text-accent-600">{communityStats.averageTimeSaved}h</span>
              </div>
              <p className="text-xs text-muted-foreground">Avg Time Saved</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="h-4 w-4 text-purple-600" />
                <span className="text-lg font-bold text-purple-600">{communityStats.activeThisWeek}</span>
              </div>
              <p className="text-xs text-muted-foreground">Active This Week</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial._id}
            variants={fadeInUp}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Quote className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-foreground font-medium leading-relaxed mb-3">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{testimonial.school}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{testimonial.userName}</p>
                <p className="text-sm text-muted-foreground">{testimonial.subject} Teacher</p>
              </div>
              {testimonial.timeSaved && (
                <div className="flex items-center gap-1 text-sm text-accent-600 font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Saved {testimonial.timeSaved}h</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
