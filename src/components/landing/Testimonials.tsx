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
      "A.I.D.A. gives me instant access to district policies and curriculum guidelines through simple voice commands. Instead of searching through multiple documents, I can ask a question and get an accurate answer immediately.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Elementary School Principal",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote:
      "The FERPA compliance and privacy guarantees give me confidence to use A.I.D.A. across our district. The voice interface works seamlessly with our existing workflow.",
  },
  {
    name: "Dr. Jennifer Walsh",
    role: "Curriculum Director",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    quote:
      "A.I.D.A.'s lesson plan feedback is incredibly helpful. It provides instant, actionable insights that help teachers improve their instructional methods and engagement strategies.",
  },
  {
    name: "Michael Thompson",
    role: "Special Education Teacher",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    quote:
      "The hands-free voice experience is perfect for my classroom where I'm constantly moving between students. I can get help without stopping to type or search through documents.",
  },
  {
    name: "Lisa Park",
    role: "Middle School Science Teacher",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    quote:
      "I was skeptical about AI in education, but A.I.D.A. feels different. It's not trying to replace me - it's making me more efficient by giving me instant access to the information I need.",
  },
  {
    name: "David Kim",
    role: "District Technology Coordinator",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote:
      "The integration with our existing systems was seamless. A.I.D.A. works with our document management and provides instant access to district policies and procedures.",
  },
  {
    name: "Amanda Foster",
    role: "High School English Teacher",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    quote:
      "A.I.D.A. has streamlined my lesson planning process. The AI feedback helps me create more engaging lessons, and the voice interface saves me time during busy periods.",
  },
  {
    name: "Robert Johnson",
    role: "Superintendent",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    quote:
      "The privacy-first approach and FERPA compliance make A.I.D.A. the only AI tool I trust with our district's sensitive educational data and policies.",
  },
  {
    name: "Maria Gonzalez",
    role: "Elementary Teacher",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    quote:
      "A.I.D.A. understands educational context better than any other AI tool I've used. It provides relevant, accurate answers to my curriculum and policy questions.",
  },
  {
    name: "James Wilson",
    role: "High School Principal",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    quote:
      "A.I.D.A. has become an essential tool for our teachers. The voice interface and document management system work together to provide instant access to district information.",
  },
  {
    name: "Dr. Rachel Green",
    role: "Educational Technology Specialist",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote:
      "A.I.D.A. represents the future of educational technology - intelligent, privacy-focused, and designed specifically for the unique needs of K-12 educators.",
  },
  {
    name: "Thomas Brown",
    role: "Middle School Teacher",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    quote:
      "I've tried many educational AI tools, but A.I.D.A. is the first one that truly understands the challenges of teaching and provides practical, actionable support.",
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

import { getAidaTailwindClasses } from "@/lib/design-utils";

export default function WallOfLoveSection() {
  const tailwindClasses = getAidaTailwindClasses();

  return (
    <section id="testimonials">
      <div className={tailwindClasses.spacing.sectionPadding}>
        <div
          className={`mx-auto max-w-6xl ${tailwindClasses.spacing.containerPadding}`}
        >
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
