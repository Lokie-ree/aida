import { Mic, Heart, BarChart3, Brain } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-semibold">
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
              <Mic className="size-4 text-blue-500" />
              <h3 className="text-sm font-medium">Voice Orb</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Hands-free voice commands with stateful design that glows blue
              when idle, pulses purple when listening, and turns green on
              completion.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="size-4 text-purple-500" />
              <h3 className="text-sm font-medium">Empathy Bar</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Real-time emotional analysis that adapts the interface when
              detecting frustration or stress, offering calming, focused
              experiences.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-green-500" />
              <h3 className="text-sm font-medium">Insights Hub</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Modular widgets providing lesson plan feedback, classroom dynamics
              analysis, and interaction history for actionable insights.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-orange-500" />
              <h3 className="text-sm font-medium">Adaptive Intelligence</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              AI that responds with simplified, calming answers when you're
              frustrated, showing intelligence beyond simple retrieval.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
