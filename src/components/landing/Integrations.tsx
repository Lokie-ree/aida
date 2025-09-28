import {
  Gemini,
  MagicUI,
  GooglePaLM,
  Vapi,
  Convex,
  Firecrawl,
} from "@/components/logos";
import { LogoIcon } from "@/components/logo";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/infinite-slider";

import { getAidaTailwindClasses } from "@/lib/design-utils";

export default function IntegrationsSection() {
  const tailwindClasses = getAidaTailwindClasses();

  return (
    <section id="technology">
      <div
        className={`bg-muted dark:bg-background ${tailwindClasses.spacing.sectionPadding}`}
      >
        <div
          className={`mx-auto max-w-5xl ${tailwindClasses.spacing.containerPadding}`}
        >
          <div className="bg-muted/25 group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
            <div
              role="presentation"
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"
            ></div>
            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                <IntegrationCard>
                  <Vapi />
                </IntegrationCard>
                <IntegrationCard>
                  <Convex />
                </IntegrationCard>
                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
                <IntegrationCard>
                  <Firecrawl />
                </IntegrationCard>
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
              </InfiniteSlider>
            </div>

            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10} reverse>
                <IntegrationCard>
                  <Convex />
                </IntegrationCard>
                <IntegrationCard>
                  <Vapi />
                </IntegrationCard>
                <IntegrationCard>
                  <Firecrawl />
                </IntegrationCard>
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
              </InfiniteSlider>
            </div>
            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                <IntegrationCard>
                  <Vapi />
                </IntegrationCard>
                <IntegrationCard>
                  <Convex />
                </IntegrationCard>
                <IntegrationCard>
                  <Firecrawl />
                </IntegrationCard>
                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
              </InfiniteSlider>
            </div>
            <div className="absolute inset-0 m-auto flex size-fit justify-center gap-2">
              <IntegrationCard
                className="shadow-black-950/10 size-16 bg-white/25 shadow-xl backdrop-blur-md backdrop-grayscale dark:border-white/10 dark:shadow-white/15"
                isCenter={true}
              >
                <LogoIcon />
              </IntegrationCard>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-muted-foreground">
              Built on a robust tech stack that ensures reliability, security,
              and seamless voice interaction for educational environments.
            </p>
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-left">
              <h3 className="font-semibold text-green-800 mb-2">FERPA Compliant & Privacy-First</h3>
              <p className="text-sm text-green-700">
                A.I.D.A. is designed with education privacy laws in mind. All voice data is processed 
                securely within our Convex deployment with complete audit trails. Student information 
                is never shared with third parties, and all AI processing happens on-device or within 
                our FERPA-compliant infrastructure. Your district's data stays in your control.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Vapi Voice AI</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Convex Backend</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>OpenAI GPT-4</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span>Firecrawl</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  position?:
    | "left-top"
    | "left-middle"
    | "left-bottom"
    | "right-top"
    | "right-middle"
    | "right-bottom";
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-background relative z-20 flex size-12 rounded-full border",
        className
      )}
    >
      <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
        {children}
      </div>
    </div>
  );
};
