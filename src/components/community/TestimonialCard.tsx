import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Clock, MapPin, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: {
    _id: string;
    quote: string;
    userName: string;
    school: string;
    subject: string;
    timeSaved?: number;
    impact: string;
    featured?: boolean;
  };
  variant?: "default" | "featured" | "compact";
}

export function TestimonialCard({ 
  testimonial, 
  variant = "default" 
}: TestimonialCardProps) {
  const isFeatured = variant === "featured" || testimonial.featured;
  
  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-200 border-2",
      isFeatured 
        ? "border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5" 
        : "hover:border-primary/20"
    )}>
      <CardContent className="p-6">
        {/* Quote Icon */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            "p-2 rounded-full",
            isFeatured 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            <Quote className="h-5 w-5" />
          </div>
          
          {isFeatured && (
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        {/* Quote */}
        <blockquote className={cn(
          "text-lg leading-relaxed mb-4 italic",
          isFeatured && "text-primary/90"
        )}>
          "{testimonial.quote}"
        </blockquote>

        {/* Impact */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            <strong>Impact:</strong> {testimonial.impact}
          </p>
        </div>

        {/* Time Saved Badge */}
        {testimonial.timeSaved && (
          <div className="mb-4">
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Saves {testimonial.timeSaved} hours/week
            </Badge>
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {testimonial.userName}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{testimonial.school}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {testimonial.subject} Teacher
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}