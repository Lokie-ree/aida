import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "High School Math Teacher",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote:
      "A.I.D.A. has transformed my classroom management. The voice commands let me focus on teaching while it handles administrative tasks. The empathy bar actually detected when I was stressed during parent conferences and simplified the interface - it's like having a supportive colleague.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Elementary School Principal",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote:
      "The FERPA compliance and privacy guarantees give me confidence to use A.I.D.A. across our district. The insights hub provides data I never had before about classroom dynamics and teacher-student interaction ratios.",
  },
  {
    name: "Dr. Jennifer Walsh",
    role: "Curriculum Director",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    quote:
      "A.I.D.A.'s lesson plan feedback widget is revolutionary. It provides instant, actionable insights that help teachers improve their instructional methods. The AI understands educational best practices better than most human reviewers.",
  },
  {
    name: "Michael Thompson",
    role: "Special Education Teacher",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    quote:
      "The hands-free experience is perfect for my classroom where I'm constantly moving between students. A.I.D.A. understands my voice even in a noisy environment and adapts its responses based on my emotional state.",
  },
  {
    name: "Lisa Park",
    role: "Middle School Science Teacher",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    quote:
      "I was skeptical about AI in education, but A.I.D.A. feels different. It's not trying to replace me - it's making me a better teacher. The classroom dynamics widget showed me I was talking too much and helped me increase student participation by 40%.",
  },
  {
    name: "David Kim",
    role: "District Technology Coordinator",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote:
      "The integration with our existing systems was seamless. A.I.D.A. works with our student information system and provides insights that help us make data-driven decisions about curriculum and teacher support.",
  },
  {
    name: "Amanda Foster",
    role: "High School English Teacher",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    quote:
      "A.I.D.A. has reduced my administrative workload by 60%. I can now focus on what I love - teaching and connecting with students. The voice orb is always ready when I need it, and the emotional intelligence is remarkable.",
  },
  {
    name: "Robert Johnson",
    role: "Superintendent",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    quote:
      "A.I.D.A. has given us unprecedented insights into teaching effectiveness across our district. The privacy-first approach and FERPA compliance make it the only AI tool I trust with our students' data.",
  },
  {
    name: "Maria Gonzalez",
    role: "Elementary Teacher",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    quote:
      "The empathy bar detected my frustration during a difficult parent meeting and automatically simplified the interface. A.I.D.A. responded with calming, supportive language instead of overwhelming me with information.",
  },
  {
    name: "James Wilson",
    role: "High School Principal",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    quote:
      "A.I.D.A.'s adaptive intelligence is remarkable. When teachers are stressed, it provides simplified, calming responses. When they're confident, it offers detailed insights. It's like having an AI that truly understands the human side of education.",
  },
  {
    name: "Dr. Rachel Green",
    role: "Educational Technology Specialist",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote:
      "A.I.D.A. represents the future of educational technology - intelligent, empathetic, and privacy-focused. The combination of voice interaction, emotional awareness, and actionable insights creates a truly supportive learning environment.",
  },
  {
    name: "Thomas Brown",
    role: "Middle School Teacher",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    quote:
      "I've tried many educational AI tools, but A.I.D.A. is the first one that feels like a true partner. It understands the challenges of teaching and provides support exactly when and how I need it.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3)
);

export default function WallOfLoveSection() {
  return (
    <section>
      <div className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">
              Trusted by Educators Nationwide
            </h2>
            <p className="mt-6">
              FERPA compliant • Privacy-first • Empowering teachers to focus on
              what matters most
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            {testimonialChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="space-y-3">
                {chunk.map(({ name, role, quote, image }, index) => (
                  <Card key={index}>
                    <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                      <Avatar className="size-9">
                        <AvatarImage
                          alt={name}
                          src={image}
                          loading="lazy"
                          width="120"
                          height="120"
                        />
                        <AvatarFallback>ST</AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium">{name}</h3>

                        <span className="text-muted-foreground block text-sm tracking-wide">
                          {role}
                        </span>

                        <blockquote className="mt-3">
                          <p className="text-gray-700 dark:text-gray-300">
                            {quote}
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
