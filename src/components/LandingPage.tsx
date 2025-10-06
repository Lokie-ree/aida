import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Play, 
  ChevronDown,
  Mic,
  Brain,
  Database,
  Workflow,
  CheckCircle,
  Star,
  Quote
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import { ModeToggle } from "./ModeToggle";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const signupForBeta = useMutation(api.betaSignup.signupForBeta);

  const handleBetaSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await signupForBeta({ email });
      setIsSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Mic,
      title: "Voice Interface",
      description: "Natural conversation with AI using your voice",
      gradient: "from-primary to-secondary"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Get personalized recommendations and analysis",
      gradient: "from-success-500 to-success-600"
    },
    {
      icon: Database,
      title: "Knowledge Base",
      description: "Access curated Louisiana education resources",
      gradient: "from-accent to-warning-500"
    },
    {
      icon: Workflow,
      title: "Smart Workspaces",
      description: "Organize and manage your teaching materials",
      gradient: "from-secondary to-primary"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School English Teacher",
      content: "This AI tool has revolutionized how I create lesson plans. What used to take hours now takes minutes!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Elementary Math Teacher",
      content: "The voice interface is incredible. I can brainstorm ideas while walking to class.",
      rating: 5
    },
    {
      name: "Dr. Lisa Rodriguez",
      role: "Curriculum Director",
      content: "Finally, an AI tool designed specifically for Louisiana educators. It understands our needs.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          {/* Left Side - AI for LA Educators Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md bg-gradient-to-br from-primary to-secondary">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">AI for LA Educators</h1>
          </div>

          {/* Right Side - Beta Signup Button */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button 
              size="lg" 
              className="text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-accent px-6 py-3"
              onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join Beta Program
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 font-medium">Louisiana Educator Rubric Native</span>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Beta Program</Badge>
          </div>

          {/* Main Headline with Gradient Text */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            AI for Louisiana
          </h1>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Educators
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Stop spending more time on AI setup than actual teaching. 
            <span className="text-yellow-400 font-semibold"> Turn 5-minute prompts into game-changing classroom efficiency.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              className="text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-accent px-8 py-4"
              onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-lg font-medium">
                Start Free Trial - No Credit Card
              </span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 transition-all duration-300 px-8 py-4"
              onClick={() => setShowAuthModal(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">Watch Demo</span>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-white/60" />
          </div>
        </div>
      </section>

      {/* Beta Signup Section */}
      <section id="beta-signup" className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Join the Beta Program
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be among the first 50 Louisiana educators to access curated AI guidance frameworks, save time, and shape the future of AI in education.
            </p>
          </div>

          <Card className="border-accent/20 bg-accent/5">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl text-accent">Early Access Program</CardTitle>
              <CardDescription className="text-lg">
                Get exclusive access to AI tools designed specifically for Louisiana educators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleBetaSignup} className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 text-base py-3"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-primary to-accent px-6 py-3 text-base"
                    >
                      {isSubmitting ? "Joining..." : "Join Beta"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    No spam, ever. Unsubscribe at any time.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 bg-success-500/10 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-success-500 mb-2">
                    Welcome to the Beta Program!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check your email for next steps and exclusive updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful AI tools designed specifically for Louisiana educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent px-8 py-4"
              onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Educators Are Saying
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of Louisiana educators already using AI to transform their teaching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/60 mb-4" />
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the beta program and be part of the future of education in Louisiana
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg"
            onClick={() => document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Join Beta Program
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md bg-gradient-to-br from-primary to-accent">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">AI for LA Educators</h3>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 AI for LA Educators. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}