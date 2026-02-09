import AnimatedSection from "@/components/animated-section";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-yellow-400">Our Ministry</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Learn about our history, our team, and our commitment to nurturing
            young hearts
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Leading
                lights is our dedicated ministry for children, aiming to lay a
                strong spiritual foundation from an early age. We began in 1997
                with a simple vision: To Mould kingdom leading lights. What
                started small has grown into a thriving children ministry of
                Salvation Ministries serving thousands of children and their
                families globally.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Over the years, we've remained committed to our core belief that
                children are not just the church of tomorrow—they are the church
                of today. Through innovative programs, dedicated volunteers, and
                a heart for service, we continue to light the way for young
                hearts to discover God's amazing love.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://naijabiography.com/wp-content/uploads/2022/08/unknown_298584667_3300834886858748_8172602651500649914_n.jpg"
                alt="Ministry history"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-yellow-400">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                What Families Are Saying
              </h2>
              <p className="text-lg text-blue-600">
                Hear from parents and children in our community
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection animation="fadeInUp" delay={100}>
              <Card className="bg-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl h-[270px]">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current animate-twinkle"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "These books are truly heaven-sent. My daughter now leads
                    family devotion confidently and quotes scriptures from what
                    she read. Thank you for creating such powerful tools!"
                  </p>
                  <div className="font-semibold text-blue-900">
                    - Mrs. Nkem I. – Port Harcourt
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={200}>
              <Card className="bg-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl h-[270px]">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current animate-twinkle"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "My daughter now writes memory verses on her own after
                    reading one of the Wisdom Bank books. It's like a quiet
                    revival in my home."
                  </p>
                  <div className="font-semibold text-blue-900">
                    - Chinenye E. – Owerri
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={300}>
              <Card className="bg-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl h-[270px]">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current animate-twinkle"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "I noticed a change in my son's attitude since he started
                    reading the book on character. He even apologized on his own
                    recently — that’s new!"
                  </p>
                  <div className="font-semibold text-blue-900">
                    - Mrs. Grace E. – Uyo
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-[#0079ff] text-white border-b-2 border-blue-200">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Ministry Family
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Whether you're looking for a place for your children to grow in
            faith or interested in volunteering, we'd love to welcome you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Visit This Sunday
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
