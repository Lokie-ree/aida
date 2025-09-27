import { Mic, Heart, BarChart3, Brain } from "lucide-react";
import { getAidaTailwindClasses } from "@/lib/design-utils";

export default function FeaturesSection() {
  const tailwindClasses = getAidaTailwindClasses();

  return (
    <section id="features" className={tailwindClasses.spacing.sectionPadding}>
      <div
        className={`mx-auto max-w-5xl ${tailwindClasses.spacing.contentSpacing} ${tailwindClasses.spacing.containerPadding}`}
      >
        <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
          <h2 className={tailwindClasses.typography.headingLarge}>
            A.I.D.A. Command Center: Your Educational AI Partner
          </h2>
          <p className="max-w-sm sm:ml-auto">
            Transform your teaching experience with intelligent voice
            interaction, emotional awareness, and actionable insights that make
            your life more about teaching and less about busy work.
          </p>
        </div>
        <div className="px-3 pt-3 md:-mx-8">
          <div className="aspect-88/36 mask-b-from-75% mask-b-to-95% relative">
            <img
              src="/mail-upper.png"
              className="absolute inset-0 z-10"
              alt="payments illustration dark"
              width={2797}
              height={1137}
            />
            <img
              src="/mail-back.png"
              className="hidden dark:block"
              alt="payments illustration dark"
              width={2797}
              height={1137}
            />
            <img
              src="/mail-back-light.png"
              className="dark:hidden"
              alt="payments illustration light"
              width={2797}
              height={1137}
            />
          </div>
        </div>
        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mic className={`size-4 ${tailwindClasses.colors.primaryBlue}`} />
              <h3 className="text-sm font-medium">Voice Interface</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Hands-free voice interaction with real-time speech-to-text and
              text-to-speech capabilities for busy educators.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart
                className={`size-4 ${tailwindClasses.colors.secondaryPurple}`}
              />
              <h3 className="text-sm font-medium">AI Feedback</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Intelligent lesson plan analysis with actionable suggestions for
              improving engagement and instructional rigor.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3
                className={`size-4 ${tailwindClasses.colors.primaryGreen}`}
              />
              <h3 className="text-sm font-medium">Knowledge Base</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Upload and manage documents, curriculum guides, and policy
              materials for instant AI-powered retrieval.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain
                className={`size-4 ${tailwindClasses.colors.secondaryOrange}`}
              />
              <h3 className="text-sm font-medium">Smart Workspaces</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Create shared workspaces for teams, with collaborative document
              management and context-aware AI assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
