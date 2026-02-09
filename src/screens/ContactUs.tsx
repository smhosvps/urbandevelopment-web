import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import AnimatedSection from "@/components/animated-section";

export default function ContactPage() {
  // Using a generic map embed since API key is missing
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.729585796502!2d6.999978814758608!3d4.824550196493744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069ce56d98d945d%3A0x26d0f0c5d4f43499!2sSalvation%20Ministries%20International%20Headquarters!5e0!3m2!1sen!2sng!4v1719160000000!5m2!1sen!2sng`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            We'd love to hear from you! Reach out with questions, visit us this
            Sunday, or learn about volunteering
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection animation="fadeInRight" delay={100}>
              <Card className="border-2 border-blue-100 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Visit Us
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900">
                          Salvation Ministries Leading Lights
                        </p>
                        <p className="text-gray-600">
                          Plot 17 Birabi Street,
                          <br />
                          GRA Phase 1, Port Harcourt,
                          <br />
                          Rivers, Nigeria.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900">
                          (234) 0906 922 2921; 0707 519 0467
                        </p>
                        <p className="text-gray-600">Main Office</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900">
                        leadinglights@smhos.org
                        </p>
                        <p className="text-gray-600">Children's Ministry</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <div className="space-y-8">
              <AnimatedSection animation="fadeInRight" delay={200}>
                <Card className="border-2 border-blue-100 transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                      Service Times
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-blue-900">
                            Thursday
                          </p>
                          <p className="text-gray-600">5:00pm (GMT +1)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-blue-900">Sundays</p>
                          <p className="text-gray-600">
                            6:30am, 8:00am, 9:30am & 11:00am (GMT +1)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* <AnimatedSection animation="fadeInRight" delay={300}>
                <Card className="bg-yellow-400 border-2 border-yellow-500 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">
                      First Time Visiting?
                    </h3>
                    <p className="text-blue-800">
                      We'd love to welcome you and your family! Let us know
                      you're coming so we can prepare a special welcome for your
                      children.
                    </p>
      
                  </CardContent>
                </Card>
              </AnimatedSection> */}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Find Us</h2>
            <p className="text-lg text-gray-600">
              We're conveniently located in the heart of downtown, with plenty
              of parking available
            </p>
          </div>
          <div className="bg-gray-300 rounded-lg h-96 overflow-hidden">
            <iframe
              title="Salvation Ministries Headquarters Map"
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}