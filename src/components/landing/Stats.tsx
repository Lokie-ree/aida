import { getAidaTailwindClasses } from "@/lib/design-utils";

export default function StatsSection() {
  const tailwindClasses = getAidaTailwindClasses();

  return (
    <section id="stats" className={tailwindClasses.spacing.sectionPadding}>
      <div
        className={`mx-auto max-w-5xl ${tailwindClasses.spacing.contentSpacingSmall} ${tailwindClasses.spacing.containerPadding} md:${tailwindClasses.spacing.contentSpacing}`}
      >
        <div className="relative z-10 max-w-xl space-y-6">
          <h2
            className={`${tailwindClasses.typography.headingLarge} lg:${tailwindClasses.typography.headingXLarge}`}
          >
            Transforming Education Through Intelligent AI
          </h2>
          <p>
            A.I.D.A. is revolutionizing how educators interact with technology.{" "}
            <span className="font-medium">Our voice-powered platform</span>{" "}
            brings order to information chaos and empowers teachers to focus on
            what matters most.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div>
            <p>
              A.I.D.A. is designed to solve the real problems educators face
              every day: information overload, administrative burden, and the
              need for instant, reliable access to district-specific knowledge.
            </p>
            <div className="mb-12 mt-12 grid grid-cols-2 gap-2 md:mb-0">
              <div className="space-y-4">
                <div className="bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-zinc-800">
                  &lt;2s
                </div>
                <p>Voice Response Time</p>
              </div>
              <div className="space-y-4">
                <div className="bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-zinc-800">
                  100%
                </div>
                <p>FERPA Compliant</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <blockquote className="border-l-4 pl-4">
              <p>
                "A.I.D.A. gives me instant access to district policies and
                curriculum guidelines through simple voice commands. Instead of
                searching through multiple documents, I can ask a question and
                get an accurate answer immediately - it's like having a
                knowledgeable colleague always available."
              </p>

              <div className="mt-6 space-y-3">
                <cite className="block font-medium">
                  Sarah Chen, High School Math Teacher
                </cite>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Early Adopter
                  </span>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
