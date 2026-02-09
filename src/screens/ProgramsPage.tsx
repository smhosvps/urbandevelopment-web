import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
} from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import { Link } from "react-router-dom";

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedSection animation="fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
              Our <span className="text-yellow-400">Programs</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Engaging, age-appropriate programs designed to help children grow
              in faith.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-1 gap-8">
            {/* Sunday School */}

            <AnimatedSection animation="fadeInLeft" delay={100}>
              <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="w-8 h-8 text-red-600" />
                    <CardTitle className="text-2xl text-blue-900">Children/Teenagers Counseling Mentorship Program 2025</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* <p className="text-gray-600 mb-4">
                  A month-long intensive Bible study programme designed to strengthen faith and build character. Registration ends Sun.  10th Aug. 2025
                  </p> */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span>Monday - Friday</span>
                    </div>
                    {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span>Ages 11-15 Mon. 18th – Fri. 22nd Aug. 2025</span>
                    </div> */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span>Daily 8am to 3pm</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-yellow-600" />
                      <span>Ages 6-15</span>
                    </div>
                  </div>
                  <Link to="/register-form">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      Register
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedSection>

 
          </div>
        </div>
      </section>

      {/* Special Events */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Special Events
            </h2>
       
          </div>
          <div className="grid md:grid-cols-1 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                Children/Teenagers Counseling Mentorship Program 2025
                </h3>
                <p className="text-gray-600 mb-4">
                A month-long intensive  Children/Teenagers Counseling Mentorship proram designed to strengthen faith and build character. Registration ends Sun.  10th Aug. 2025
                </p>
                <p className="text-sm text-yellow-600 font-semibold">
                  August 11th - 22nd, 2025
                </p>
              </CardContent>
            </Card>
           
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-yellow-400">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-lg text-blue-800 mb-8">
            We'd love to welcome your family into our community of faith and
            fun!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
                Visit This Sunday
              </Button>
            </Link>
            <Link to="/resources">
              <Button
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8 py-3 text-lg bg-transparent"
              >
                View Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
