import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Gamepad2,
  Monitor,
  Calendar,
  Info,
  Check,
} from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import img from "../assets/imags.jpg";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedSection animation="fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
              Our <span className="text-yellow-400">Mission</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              To build a generation of Children who will transform the world
              through kingdom character and excellence; in accordance with the
              Vision of the commission “TO ESTABLISH THE KINGDOM OF HEAVEN HERE
              ON EARTH”
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fadeInLeft">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                  Building Tomorrow's Faith Leaders
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  The Children's Ministry of Salvation Ministries is the arm of
                  the church that nurtures children spiritually and mentally to
                  grow in Christ; to make them well grounded in the principles
                  of the Kingdom of God.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  The Children's Ministry is a replica of the adult church where
                  children between ages 2 and 11 worship God. This video offers
                  you basic information and relevant guide on the operations of
                  the children’s department.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeInRight" delay={200}>
              <div className="relative">
                <img
                  src={img}
                  alt="Children learning together"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {/* Teaching Methods */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Our Lessons/Teaching Methods
              </h2>
              <p className="text-lg text-gray-600">
                How we teach God's Word to children
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Interactive Activities */}
            <AnimatedSection animation="scaleIn" delay={100}>
              <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-full">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Interactive Activities
                  </h3>
                  <p className="text-gray-600">
                    We use crafts, games, object talks, puzzles, mazes, skits,
                    stories, and coloring pages to make biblical principles
                    tangible and memorable.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Visual Aids */}
            <AnimatedSection animation="scaleIn" delay={200}>
              <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-full">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Visual Learning
                  </h3>
                  <p className="text-gray-600">
                    PowerPoint slides with pictures and illustrations are
                    provided to ministers a day before each lesson to enhance
                    child participation and understanding.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Age-Appropriate Materials */}
            <AnimatedSection animation="scaleIn" delay={300}>
              <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-full">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Age-Appropriate Materials
                  </h3>
                  <p className="text-gray-600">
                    Lessons are simplified to match children's understanding
                    levels with specialized manuals: Ages 2-5 and Ages 6-11.
                    Each lesson is tailored to developmental stages.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Theme-Based Learning */}
            <AnimatedSection animation="scaleIn" delay={400}>
              <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-full">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Theme-Based Learning
                  </h3>
                  <p className="text-gray-600">
                    All lessons and activities revolve around a daily theme,
                    creating cohesive learning experiences that reinforce
                    biblical truths through multiple activities.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          {/* Additional Information */}
          <AnimatedSection animation="fadeInUp" delay={500}>
            <div className="mt-12 bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-700 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Our Teaching Approach
                  </h3>
                  <p className="text-gray-700">
                    We combine these methods to create engaging, memorable
                    learning experiences that help children:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Understand biblical truths at their cognitive level
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Apply lessons to their daily lives
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Develop a personal relationship with God
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Retain what they learn through multi-sensory experiences
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 bg-blue-900 text-white border-b-2 border-blue-200">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our <span className="text-yellow-400">Vision</span>
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed mb-8">
            To Mould kingdom leading lights.
          </p>
          <div className="bg-blue-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              "Let the little children come to me, and do not hinder them, for
              the kingdom of heaven belongs to such as these."
            </h3>
            <p className="text-blue-200">- Matthew 19:14</p>
          </div>
        </div>
      </section>
    </div>
  );
}
