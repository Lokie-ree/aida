import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, BarChart3, FileText, MessageCircle, Shield } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";
import { AuthModal } from "./AuthModal";
import { ModeToggle } from "./ModeToggle";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          {/* Left Side - A.I.D.A. Logo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`
              }}
            >
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">A.I.D.A.</h1>
          </div>

          {/* Right Side - Demo Button */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button 
            size="lg" 
            className="text-white shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
              padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`
            }}
            onClick={() => setIsAuthModalOpen(true)}
          >
            Try the Live Demo
          </Button>
          </div>
          
        </div>
      </header>

      <main id="main-content" className="flex-1" role="main">
        
        {/* Hero Section */}
        <section 
          className="py-20 px-6 bg-gradient-to-b from-background to-muted/20"
          style={{ paddingTop: designTokens.spacing[20], paddingBottom: designTokens.spacing[20] }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              className="font-bold text-foreground mb-6 leading-tight"
              style={{ 
                fontSize: designTokens.typography.fontSize["6xl"][0],
                lineHeight: designTokens.typography.fontSize["6xl"][1].lineHeight
              }}
            >
              The Voice of Your School District.{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
                  WebkitBackgroundClip: 'text'
                }}
              >
                Instantly.
              </span>
            </h1>
            
            <p 
              className="text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ 
                fontSize: designTokens.typography.fontSize.xl[0],
                lineHeight: designTokens.typography.fontSize.xl[1].lineHeight,
                marginBottom: designTokens.spacing[8]
              }}
            >
              A.I.D.A. provides trusted, instant answers from official district documents for parents, educators, and administrators. Ask a question, get the right answer.
            </p>

            <Button 
              size="lg" 
              className="text-white text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
                fontSize: designTokens.typography.fontSize.lg[0],
                padding: `${designTokens.spacing[6]} ${designTokens.spacing[8]}`
              }}
              onClick={() => setIsAuthModalOpen(true)}
            >
              Ask A.I.D.A. a Question
            </Button>

            {/* Dashboard Mockup Visual */}
            <div 
              className="mt-16 bg-white overflow-hidden shadow-2xl border"
              style={{ 
                marginTop: designTokens.spacing[16],
                borderRadius: designTokens.borderRadius["2xl"],
                borderColor: designTokens.colors.neutral[200]
              }}
            >
              <div 
                className="p-4"
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
                  padding: designTokens.spacing[4]
                }}
              >
                <div className="flex items-center gap-3 text-white">
                  <div 
                    className="rounded-lg flex items-center justify-center"
                    style={{
                      width: designTokens.spacing[6],
                      height: designTokens.spacing[6],
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <span className="text-white font-bold text-xs">AI</span>
                  </div>
                  <span className="font-semibold">A.I.D.A. Dashboard</span>
                </div>
              </div>
              <div 
                className="p-8"
                style={{
                  padding: designTokens.spacing[8],
                  background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}10, ${designTokens.colors.secondary.purple}10)`
                }}
              >
                <div 
                  className="flex items-center justify-center mb-6"
                  style={{ marginBottom: designTokens.spacing[6] }}
                >
                  <div 
                    className="rounded-full flex items-center justify-center shadow-lg animate-pulse"
                    style={{
                      width: designTokens.spacing[20],
                      height: designTokens.spacing[20],
                      background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`
                    }}
                  >
                    <span className="text-white text-2xl">🎤</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 
                    className="font-semibold mb-2"
                    style={{ 
                      fontSize: designTokens.typography.fontSize.lg[0],
                      color: designTokens.colors.neutral[800],
                      marginBottom: designTokens.spacing[2]
                    }}
                  >
                    Ready to Help
                  </h3>
                  <p 
                    className="mb-4"
                    style={{ 
                      color: designTokens.colors.neutral[600],
                      marginBottom: designTokens.spacing[4]
                    }}
                  >
                    Ask me anything about your district
                  </p>
                  <div 
                    className="grid grid-cols-3 gap-4"
                    style={{ gap: designTokens.spacing[4] }}
                  >
                    <div 
                      className="bg-white rounded-lg p-3 shadow-sm"
                      style={{
                        borderRadius: designTokens.borderRadius.lg,
                        padding: designTokens.spacing[3]
                      }}
                    >
                      <div 
                        className="rounded-full mx-auto mb-1"
                        style={{
                          width: designTokens.spacing[2],
                          height: designTokens.spacing[2],
                          backgroundColor: designTokens.colors.primary.blue
                        }}
                      ></div>
                      <div style={{ color: designTokens.colors.neutral[600], fontSize: designTokens.typography.fontSize.sm[0] }}>
                        "Bullying policy?"
                      </div>
                    </div>
                    <div 
                      className="bg-white rounded-lg p-3 shadow-sm"
                      style={{
                        borderRadius: designTokens.borderRadius.lg,
                        padding: designTokens.spacing[3]
                      }}
                    >
                      <div 
                        className="rounded-full mx-auto mb-1"
                        style={{
                          width: designTokens.spacing[2],
                          height: designTokens.spacing[2],
                          backgroundColor: designTokens.colors.primary.green
                        }}
                      ></div>
                      <div style={{ color: designTokens.colors.neutral[600], fontSize: designTokens.typography.fontSize.sm[0] }}>
                        "Bus schedule?"
                      </div>
                    </div>
                    <div 
                      className="bg-white rounded-lg p-3 shadow-sm"
                      style={{
                        borderRadius: designTokens.borderRadius.lg,
                        padding: designTokens.spacing[3]
                      }}
                    >
                      <div 
                        className="rounded-full mx-auto mb-1"
                        style={{
                          width: designTokens.spacing[2],
                          height: designTokens.spacing[2],
                          backgroundColor: designTokens.colors.secondary.purple
                        }}
                      ></div>
                      <div style={{ color: designTokens.colors.neutral[600], fontSize: designTokens.typography.fontSize.sm[0] }}>
                        "Wellness goals?"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section 
          className="py-20 px-6 bg-background"
          style={{ 
            paddingTop: designTokens.spacing[20], 
            paddingBottom: designTokens.spacing[20] 
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div 
              className="text-center mb-16"
              style={{ marginBottom: designTokens.spacing[16] }}
            >
              <h2 
                className="font-bold text-foreground mb-4"
                style={{ 
                  fontSize: designTokens.typography.fontSize["4xl"][0],
                  lineHeight: designTokens.typography.fontSize["4xl"][1].lineHeight,
                  marginBottom: designTokens.spacing[4]
                }}
              >
                For Everyone in Your School Community
              </h2>
              <p 
                className="text-muted-foreground max-w-3xl mx-auto"
                style={{ 
                  fontSize: designTokens.typography.fontSize.xl[0],
                  lineHeight: designTokens.typography.fontSize.xl[1].lineHeight
                }}
              >
                A single source of truth that serves parents, educators, and administrators with the information they need, when they need it.
              </p>
            </div>

            <div 
              className="grid md:grid-cols-3 gap-8"
              style={{ gap: designTokens.spacing[8] }}
            >
              {/* Parents Column */}
              <Card 
                className="border-2 transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: `${designTokens.colors.primary.blue}20`,
                  borderWidth: '2px'
                }}
              >
                <CardHeader className="text-center">
                  <div 
                    className="rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{
                      width: designTokens.spacing[12],
                      height: designTokens.spacing[12],
                      backgroundColor: `${designTokens.colors.primary.blue}10`
                    }}
                  >
                    <Users className="w-6 h-6 text-foreground" />
                  </div>
                  <CardTitle 
                    className="text-xl text-foreground"
                    style={{ 
                      fontSize: designTokens.typography.fontSize.xl[0]
                    }}
                  >
                    Clarity for Your Family
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    style={{ 
                      lineHeight: designTokens.typography.lineHeight.relaxed
                    }}
                  >
                    Stop searching through cluttered websites and old emails. Get instant, trusted answers to all your district questions about school policies, calendars, and enrollment.
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <blockquote 
                    className="text-sm italic pl-4 py-2 text-foreground"
                    style={{
                      fontSize: designTokens.typography.fontSize.sm[0],
                      backgroundColor: `${designTokens.colors.primary.blue}05`,
                      borderLeft: `4px solid ${designTokens.colors.primary.blue}`,
                      paddingLeft: designTokens.spacing[4],
                      paddingTop: designTokens.spacing[2],
                      paddingBottom: designTokens.spacing[2]
                    }}
                  >
                    "What's the attendance policy for middle school?"
                  </blockquote>
                </CardFooter>
              </Card>

              {/* Educators Column */}
              <Card 
                className="border-2 transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: `${designTokens.colors.primary.green}20`,
                  borderWidth: '2px'
                }}
              >
                <CardHeader className="text-center">
                  <div 
                    className="rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{
                      width: designTokens.spacing[12],
                      height: designTokens.spacing[12],
                      backgroundColor: `${designTokens.colors.primary.green}10`
                    }}
                  >
                    <Heart 
                      className="w-6 h-6" 
                      style={{ color: designTokens.colors.primary.green }}
                    />
                  </div>
                  <CardTitle 
                    className="text-xl"
                    style={{ 
                      fontSize: designTokens.typography.fontSize.xl[0],
                      color: designTokens.colors.primary.green
                    }}
                  >
                    Focus on Your Students
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    style={{ 
                      lineHeight: designTokens.typography.lineHeight.relaxed
                    }}
                  >
                    End the hunt for policy documents and curriculum guides. Ask A.I.D.A. anything about your district's policies and get instant, accurate answers—hands-free clarification on district procedures so you can spend more time teaching.
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <blockquote 
                    className="text-sm italic pl-4 py-2"
                    style={{
                      fontSize: designTokens.typography.fontSize.sm[0],
                      backgroundColor: `${designTokens.colors.primary.green}05`,
                      borderLeft: `4px solid ${designTokens.colors.primary.green}`,
                      color: designTokens.colors.primary.green,
                      paddingLeft: designTokens.spacing[4],
                      paddingTop: designTokens.spacing[2],
                      paddingBottom: designTokens.spacing[2]
                    }}
                  >
                    "What are the requirements for student-led projects?"
                  </blockquote>
                </CardFooter>
              </Card>

              {/* Administrators Column */}
              <Card 
                className="border-2 transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: `${designTokens.colors.secondary.purple}20`,
                  borderWidth: '2px'
                }}
              >
                <CardHeader className="text-center">
                  <div 
                    className="rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{
                      width: designTokens.spacing[12],
                      height: designTokens.spacing[12],
                      backgroundColor: `${designTokens.colors.secondary.purple}10`
                    }}
                  >
                    <BarChart3 
                      className="w-6 h-6" 
                      style={{ color: designTokens.colors.secondary.purple }}
                    />
                  </div>
                  <CardTitle 
                    className="text-xl"
                    style={{ 
                      fontSize: designTokens.typography.fontSize.xl[0],
                      color: designTokens.colors.secondary.purple
                    }}
                  >
                    Communication You Can Trust
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    style={{ 
                      lineHeight: designTokens.typography.lineHeight.relaxed
                    }}
                  >
                    Empower your entire community with a single source of truth. Ensure consistent, accurate information delivery to your entire community—reduce repetitive inquiries and ensure consistent, accurate messaging on everything from board policies to safety protocols.
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <blockquote 
                    className="text-sm italic pl-4 py-2"
                    style={{
                      fontSize: designTokens.typography.fontSize.sm[0],
                      backgroundColor: `${designTokens.colors.secondary.purple}05`,
                      borderLeft: `4px solid ${designTokens.colors.secondary.purple}`,
                      color: designTokens.colors.secondary.purple,
                      paddingLeft: designTokens.spacing[4],
                      paddingTop: designTokens.spacing[2],
                      paddingBottom: designTokens.spacing[2]
                    }}
                  >
                    "Summarize our district's goals for technology integration."
                  </blockquote>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section 
          id="demo-section" 
          className="py-20 px-6 bg-muted/20"
          style={{ 
            paddingTop: designTokens.spacing[20], 
            paddingBottom: designTokens.spacing[20] 
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div 
              className="text-center mb-16"
              style={{ marginBottom: designTokens.spacing[16] }}
            >
              <h2 
                className="font-bold text-foreground mb-4"
                style={{ 
                  fontSize: designTokens.typography.fontSize["4xl"][0],
                  lineHeight: designTokens.typography.fontSize["4xl"][1].lineHeight,
                  marginBottom: designTokens.spacing[4]
                }}
              >
                How It Works
              </h2>
              <p 
                className="text-muted-foreground"
                style={{ 
                  fontSize: designTokens.typography.fontSize.xl[0],
                  lineHeight: designTokens.typography.fontSize.xl[1].lineHeight
                }}
              >
                Three simple steps to transform how your district shares information
              </p>
            </div>

            <div 
              className="space-y-12"
              style={{ gap: designTokens.spacing[12] }}
            >
              {/* Step 1 */}
              <div 
                className="flex items-start gap-6"
                style={{ gap: designTokens.spacing[6] }}
              >
                <div 
                  className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  style={{
                    width: designTokens.spacing[12],
                    height: designTokens.spacing[12],
                    background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
                    fontSize: designTokens.typography.fontSize.lg[0]
                  }}
                >
                  1
                </div>
                <div className="flex-1">
                  <h3 
                    className="font-bold text-foreground mb-3 flex items-center gap-3"
                    style={{ 
                      fontSize: designTokens.typography.fontSize["2xl"][0],
                      lineHeight: designTokens.typography.fontSize["2xl"][1].lineHeight,
                      marginBottom: designTokens.spacing[3],
                      gap: designTokens.spacing[3]
                    }}
                  >
                    <FileText className="w-6 h-6 text-foreground" />
                    We Securely Index Your District's Documents
                  </h3>
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    style={{ 
                      fontSize: designTokens.typography.fontSize.lg[0],
                      lineHeight: designTokens.typography.lineHeight.relaxed
                    }}
                  >
                    We process the official handbooks, policies, and guides you provide to build a secure, private knowledge base.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                className="flex items-start gap-6"
                style={{ gap: designTokens.spacing[6] }}
              >
                <div 
                  className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  style={{
                    width: designTokens.spacing[12],
                    height: designTokens.spacing[12],
                    background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
                    fontSize: designTokens.typography.fontSize.lg[0]
                  }}
                >
                  2
                </div>
                <div className="flex-1">
                  <h3 
                    className="font-bold text-foreground mb-3 flex items-center gap-3"
                    style={{ 
                      fontSize: designTokens.typography.fontSize["2xl"][0],
                      lineHeight: designTokens.typography.fontSize["2xl"][1].lineHeight,
                      marginBottom: designTokens.spacing[3],
                      gap: designTokens.spacing[3]
                    }}
                  >
                    <MessageCircle 
                      className="w-6 h-6" 
                      style={{ color: designTokens.colors.primary.green }}
                    />
                    You Ask a Question in Plain Language
                  </h3>
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    style={{ 
                      fontSize: designTokens.typography.fontSize.lg[0],
                      lineHeight: designTokens.typography.lineHeight.relaxed
                    }}
                  >
                    Access district information hands-free through natural voice interactions—use our simple voice interface to ask what you need to know, just like talking to a helpful colleague.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                className="flex items-start gap-6"
                style={{ gap: designTokens.spacing[6] }}
              >
                <div 
                  className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  style={{
                    width: designTokens.spacing[12],
                    height: designTokens.spacing[12],
                    background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
                    fontSize: designTokens.typography.fontSize.lg[0]
                  }}
                >
                  3
                </div>
                <div className="flex-1">
                  <h3 
                    className="font-bold text-foreground mb-3 flex items-center gap-3"
                    style={{ 
                      fontSize: designTokens.typography.fontSize["2xl"][0],
                      lineHeight: designTokens.typography.fontSize["2xl"][1].lineHeight,
                      marginBottom: designTokens.spacing[3],
                      gap: designTokens.spacing[3]
                    }}
                  >
                    <Shield 
                      className="w-6 h-6" 
                      style={{ color: designTokens.colors.secondary.purple }}
                    />
                    Receive an Instant, Sourced Answer
                  </h3>
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    style={{ 
                      fontSize: designTokens.typography.fontSize.lg[0],
                      lineHeight: designTokens.typography.lineHeight.relaxed
                    }}
                  >
                    A.I.D.A. finds the precise information in seconds and tells you exactly which document it came from, ensuring complete trust and transparency. Save hours of searching through documents and focus on what matters most.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div 
              className="text-center mt-16"
              style={{ marginTop: designTokens.spacing[16] }}
            >
              <Button 
                size="lg" 
                className="text-white text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`,
                  fontSize: designTokens.typography.fontSize.lg[0],
                  padding: `${designTokens.spacing[6]} ${designTokens.spacing[8]}`
                }}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Start Your District's Voice Journey
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="py-12 px-6 bg-background border-t border-border"
          style={{ 
            paddingTop: designTokens.spacing[12], 
            paddingBottom: designTokens.spacing[12] 
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div 
              className="flex items-center justify-center gap-3 mb-4"
              style={{ 
                gap: designTokens.spacing[3], 
                marginBottom: designTokens.spacing[4] 
              }}
            >
              <div 
                className="rounded-lg flex items-center justify-center shadow-md"
                style={{
                  width: designTokens.spacing[8],
                  height: designTokens.spacing[8],
                  background: `linear-gradient(135deg, ${designTokens.colors.primary.blue}, ${designTokens.colors.secondary.purple})`
                }}
              >
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h3 
                className="font-bold text-foreground"
                style={{ 
                  fontSize: designTokens.typography.fontSize.xl[0],
                  lineHeight: designTokens.typography.fontSize.xl[1].lineHeight
                }}
              >
                A.I.D.A.
              </h3>
            </div>
            <p 
              className="text-muted-foreground mb-4"
              style={{ 
                marginBottom: designTokens.spacing[4]
              }}
            >
              The Voice of Your School District
            </p>
            <p 
              className="text-sm text-muted-foreground"
              style={{ 
                fontSize: designTokens.typography.fontSize.sm[0],
                lineHeight: designTokens.typography.fontSize.sm[1].lineHeight
              }}
            >
              Built with Convex, Vapi, OpenAI, and ShadCN • FERPA Compliant • Enterprise Ready
            </p>
          </div>
        </footer>
      </main>
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
