export default function StatsSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="relative z-10 max-w-xl space-y-6">
          <h2 className="text-4xl font-medium lg:text-5xl">
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
              Join thousands of educators who have transformed their teaching
              experience with A.I.D.A.'s intelligent voice interaction,
              emotional awareness, and actionable insights.
            </p>
            <div className="mb-12 mt-12 grid grid-cols-2 gap-2 md:mb-0">
              <div className="space-y-4">
                <div className="bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-zinc-800">
                  60%
                </div>
                <p>Reduction in Administrative Workload</p>
              </div>
              <div className="space-y-4">
                <div className="bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-zinc-800">
                  40%
                </div>
                <p>Increase in Student Participation</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <blockquote className="border-l-4 pl-4">
              <p>
                A.I.D.A. has transformed my classroom management. The voice
                commands let me focus on teaching while it handles
                administrative tasks. The empathy bar actually detected when I
                was stressed during parent conferences and simplified the
                interface - it's like having a supportive colleague.
              </p>

              <div className="mt-6 space-y-3">
                <cite className="block font-medium">
                  Sarah Chen, High School Math Teacher
                </cite>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">
                    FERPA Compliant
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
