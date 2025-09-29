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
            Why Teachers Choose A.I.D.A. Over Everything Else
          </h2>
          <p className="max-w-sm sm:ml-auto">
            Stop wasting time searching through documents. A.I.D.A. gives you
            <strong className="text-foreground">
              {" "}
              district-specific answers in under 2 seconds
            </strong>
            through natural voice conversation. No more information overload.
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
              Ask "What's our district's policy on student-led projects?" and
              get
              <strong className="text-foreground">
                {" "}
                instant, accurate answers
              </strong>{" "}
              while you're teaching.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart
                className={`size-4 ${tailwindClasses.colors.secondaryPurple}`}
              />
              <h3 className="text-sm font-medium">District Context</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              I understand YOUR district's specific policies, curriculum, and
              requirements— not generic advice that doesn't apply to your
              situation.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3
                className={`size-4 ${tailwindClasses.colors.primaryGreen}`}
              />
              <h3 className="text-sm font-medium">Source Citations</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Every answer includes the specific document and page number it
              came from— so you always know you can trust the information.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain
                className={`size-4 ${tailwindClasses.colors.secondaryOrange}`}
              />
              <h3 className="text-sm font-medium">FERPA Compliant</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Built with education privacy in mind. Your district data stays
              secure and compliant with all educational privacy regulations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
