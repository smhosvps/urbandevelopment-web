
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Users, Heart } from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useGetRegistrationByIdQuery } from "@/redux/features/formRegistration/formRegistrationApi";

export default function RegistrationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: registrationx, isLoading, isError } = useGetRegistrationByIdQuery(id!);

  const registration = registrationx?.data
  console.log(registration)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !registration) {
    return (
      <div className="container mx-auto py-12">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Registration Not Found</h2>
            <p className="text-lg text-red-600 mb-6">
              The requested registration could not be found.
            </p>
            <Button asChild>
              <Link to="/registrations">Back to Registrations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          {registration.firstName} {registration.surname}'s Registration
        </h1>
        <Badge variant="outline" className="bg-blue-50 text-blue-800 px-4 py-2">
          ID: {registration._id?.substring(0, 8).toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Information Card */}
        <div className="md:col-span-2">
          <AnimatedSection animation="fadeInUp">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-900 text-white">
                <CardTitle className="text-xl">Registration Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="text-lg font-semibold">
                        {registration.firstName} {registration.lastName} {registration.surname}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                      <p className="text-lg">
                        {format(new Date(registration?.dateOfBirth), "MMMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Age</h3>
                      <p className="text-lg">{registration?.age} years</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">School</h3>
                      <p className="text-lg">{registration?.schoolName}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Parent/Guardian</h3>
                      <p className="text-lg font-semibold">{registration?.parentName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Address</h3>
                      <p className="text-lg">{registration?.parentAddress}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-lg">{registration?.parentPhone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Languages Spoken</h3>
                      <p className="text-lg">{registration?.languagesSpoken.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Spiritual Information */}
          <AnimatedSection animation="fadeInUp" delay={100} className="mt-8">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-900 text-white">
                <CardTitle className="text-xl">Spiritual Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Born Again</h3>
                    <Badge 
                      variant={registration?.bornAgain === "yes" ? "default" : "secondary"} 
                      className="text-sm"
                    >
                      {registration.bornAgain.toUpperCase()}
                    </Badge>
                    {registration?.bornAgain === "yes" && registration?.bornAgainDate && (
                      <p className="text-sm">
                        {format(new Date(registration?.bornAgainDate), "MMM dd, yyyy")}/
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Baptized in Holy Spirit</h3>
                    <Badge 
                      variant={registration?.baptizedHolySpirit === "yes" ? "default" : "secondary"} 
                      className="text-sm"
                    >
                      {registration.baptizedHolySpirit.toUpperCase()}
                    </Badge>
                    {registration?.baptizedHolySpirit === "yes" && registration?.baptizedHolySpiritDate && (
                      <p className="text-sm">
                        {format(new Date(registration?.baptizedHolySpiritDate), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Baptized in Water</h3>
                    <Badge 
                      variant={registration?.baptizedWater === "yes" ? "default" : "secondary"} 
                      className="text-sm"
                    >
                      {registration?.baptizedWater?.toUpperCase()}
                    </Badge>
                    {registration?.baptizedWater === "yes" && registration?.baptizedWaterDate && (
                      <p className="text-sm">
                        {format(new Date(registration?.baptizedWaterDate), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* Sidebar */}
        <div>
          {/* Program Information */}
          <AnimatedSection animation="fadeInUp" delay={200}>
            <Card className="border-2 border-blue-200 mb-8">
              <CardHeader className="bg-blue-900 text-white">
                <CardTitle className="text-xl">Program Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Duration</h3>
                      <p className="text-sm text-gray-600">Full month of August 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Age Group</h3>
                      <p className="text-sm text-gray-600">Ages 6-17</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Focus</h3>
                      <p className="text-sm text-gray-600">Bible Study & Character Building</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Registration Date</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(registration?.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Agreements */}
          <AnimatedSection animation="fadeInUp" delay={300}>
            <Card className="border-2 border-green-200 mb-8">
              <CardHeader className="bg-green-900 text-white">
                <CardTitle className="text-xl">Agreements</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className={`h-5 w-5 rounded-full mr-3 ${registration.rulesAgreement ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <h3 className="font-medium">Rules Agreement</h3>
                      <p className="text-sm text-gray-600">
                        {registration?.rulesAgreement ? "Agreed" : "Not agreed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className={`h-5 w-5 rounded-full mr-3 ${registration.parentConsent ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <h3 className="font-medium">Parental Consent</h3>
                      <p className="text-sm text-gray-600">
                        {registration?.parentConsent ? "Consent given" : "No consent"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Signatures */}
          <AnimatedSection animation="fadeInUp" delay={400}>
            <Card className="border-2 border-amber-200">
              <CardHeader className="bg-amber-900 text-white">
                <CardTitle className="text-xl">Signatures</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm">Student Signature</h3>
                    <p className="font-semibold">{registration?.studentSignature}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(registration?.studentDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Parent/Guardian Signature</h3>
                    <p className="font-semibold">{registration?.parentSignature}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(registration?.parentConsentDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button asChild variant="outline">
          <Link to="/registrations">Back to Registrations</Link>
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => window.print()}>

              Print Registration
     
          </Button>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}