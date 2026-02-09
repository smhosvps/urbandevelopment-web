import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, BookOpen, Video } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { Link } from "react-router-dom"
import cv from "../assets/Sunday-Manual.pdf";
// import cv3 from "../assets/Sunday-Manual.pdf";

export default function ResourcesPage() { 
  // Leading Light YouTube video IDs
  const leadingLightVideos = [
    { id: "cXXupSh2wkY", title: "Motivational Talk from Smhos Leading lights" },
    { id: "i4TkCnUSLjw", title: "Children's Sunday - The Winning Child | Sunday, 26th May 2024" },
    { id: "ZK18LNhS5e0", title: "Motivational Talk from Leading lights" },
    { id: "MUiN_6-zEzI", title: "Amazing Kids - Leading Lights (Is your name in the Book of Life)" },
    { id: "RozQqu51azc", title: "Amazing Smhos Leading lights performance" },
    { id: "Ugq0nffUoW4", title: "LEADING LIGHTS- EXCERPT FROM FATHERS DAY CELEBRATION" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Children's <span className="text-yellow-400">Resources</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Free materials to help families continue their faith journey at home
          </p>
        </div>
      </section>

      {/* Resource Categories */} 
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-1 gap-8">
            {/* Bible Study Materials */}
            <AnimatedSection animation="fadeInLeft" delay={100}>
              <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-8 h-8 text-red-600" />
                    <CardTitle className="text-2xl text-blue-900">Materials</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-blue-900 font-medium">Weekly Manual (PDF)</span>
                      <a href={cv} download="children_manual">
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-2" /> 
                        Download
                      </Button>
                      </a>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </AnimatedSection>

          </div>
          
          {/* Leading Light Videos Section */}
          <AnimatedSection animation="fadeInUp" delay={500}>
            <Card className="border-2 border-blue-100 mt-12 hover:border-red-300 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Video className="w-8 h-8 text-red-600" />
                  <CardTitle className="text-2xl text-blue-900">Leading Light Videos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Watch performances from our children's ministry - The Leading Lights
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leadingLightVideos.map((video, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-48 rounded-t-lg"
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">{video.title}</h3>
                        <Button 
                          asChild
                          className="w-full bg-red-600 hover:bg-red-700 text-white mt-2"
                        >
                          <a 
                            href={`https://www.youtube.com/watch?v=${video.id}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Watch on YouTube
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

   

      {/* Call to Action */}
      <section className="py-16 px-4 bg-blue-900 text-white border-b-2 border-blue-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Something Specific?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Can't find what you're looking for? We're here to help!
          </p>
          <Link to="/contact">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">Contact Us</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}