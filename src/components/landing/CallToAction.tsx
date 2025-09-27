import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInForm } from "../../SignInForm";
import { getAidaTailwindClasses } from "@/lib/design-utils";

export default function CallToAction() {
  const [showSignIn, setShowSignIn] = useState(false);
  const tailwindClasses = getAidaTailwindClasses();

  if (showSignIn) {
    return (
      <section className={tailwindClasses.spacing.sectionPadding}>
        <div className="mx-auto max-w-md px-6">
          <div className="text-center mb-8">
            <h2
              className={`text-balance ${tailwindClasses.typography.headingLarge} lg:${tailwindClasses.typography.headingXLarge}`}
            >
              Get Started with A.I.D.A.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sign in or create an account to access your voice-powered
              educational assistant.
            </p>
          </div>

          <SignInForm />

          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => setShowSignIn(false)}
              className="text-muted-foreground"
            >
              ← Back to overview
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={tailwindClasses.spacing.sectionPadding}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2
            className={`text-balance ${tailwindClasses.typography.headingLarge} lg:${tailwindClasses.typography.headingXLarge}`}
          >
            Ready to Transform Your Teaching?
          </h2>
          <p className="mt-4">
            Experience the power of voice-enabled AI assistance designed
            specifically for K-12 educators. Get instant access to district
            policies, curriculum guidance, and intelligent lesson plan feedback.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 lg:mt-12">
            <Button
              size="lg"
              className="px-8 py-3"
              onClick={() => setShowSignIn(true)}
            >
              <span>Try A.I.D.A. Now</span>
            </Button>
            <p className="text-sm text-muted-foreground">
              Free to try • FERPA Compliant • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
