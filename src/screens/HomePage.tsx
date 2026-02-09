import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Users,
  BookOpen,
  Star,
  ShoppingCart,
  ExternalLink,
  Book,
  Loader2,
  Send,
} from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import { Link } from "react-router-dom";
import image1 from "../assets/The-Unique-Child.png";
import image2 from "../assets/The-Kings-Memoir.jpeg";
import image3 from "../assets/SPIRITUAL-GROWTH-handbook-For-Teenagers-scaled.jpg";
import image4 from "../assets/The-Unique-Teen.png";
import image5 from "../assets/PROSPERITY-DIGEST.pdf.jpg";
import image6 from "../assets/The-First-Class-Teen.png";
import { useEffect, useState } from "react";
import { useAddNewsletterMutation } from "@/redux/features/newsletter/newsletterApi";
import { toast } from "react-toastify";


export default function HomePage() {
  const ministryBooks = [
    {
      id: 1,
      title: "THE UNIQUE CHILD",
      price: "#3000",
      image: image1,
      category: "Parenting",
      link: "https://smhosstore.com/product/the-unique-child/",
      featured: true,
    },
    {
      id: 2,
      title: "The Kings Memoir",
      price: "#3000",
      image: image2,
      link: "https://smhosstore.com/product/the-kings-memoir/",
      category: "Children's Books",
      featured: false,
    },
    {
      id: 3,
      title: "SPIRITUAL GROWTH handbook For Teenagers",
      price: "#3000",
      image: image3,
      link: "https://smhosstore.com/product/spiritual-growth-handbook-for-teenagers/",
      category: "Activity Books",
      featured: false,
    },
    {
      id: 4,
      title: "The Unique Teen",
      price: "#3000",
      image: image4,
      link: "https://smhosstore.com/product/the-unique-teen/",
      category: "Prayer Books",
      featured: false,
    },
    {
      id: 5,
      title: "Prosperity Digests",
      price: "#3000",
      image: image5,
      link: "https://smhosstore.com/product/prosperity-digest/",
      category: "Ministry Resources",
      featured: false,
    },
    {
      id: 6,
      title: "The First Class Teen",
      price: "#3000",
      image: image6,
      link: "https://smhosstore.com/product/the-first-class-teen/",
      category: "Teaching Resources",
      featured: false,
    },
  ];

  const [email, setEmail] = useState("");
  const [addNewsletter, { isLoading }] = useAddNewsletterMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const result: any = await addNewsletter({ email }).unwrap();
      if (result?.success) {
        toast("Successfully subscribed to our newsletter.");
        setEmail("");
      }
    } catch (err: any) {
      toast(err.data?.message);
      setErrors({ form: err.data?.message });
    }
  };

  const backgroundImages = [
    "https://smhos.org/wp-content/uploads/2023/02/IMG_3746-scaled.jpg",
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentBgIndex(prevIndex => 
          (prevIndex + 1) % backgroundImages.length
        );
        setIsTransitioning(false);
      }, 1000); // Matches transition duration
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20 px-4 overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="relative w-full h-full">
            {backgroundImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                  index === currentBgIndex 
                    ? "opacity-100 z-10" 
                    : "opacity-0 z-0"
                } ${isTransitioning ? "transitioning" : ""}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/70 to-blue-900/70 z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/60 to-blue-900/80 z-20"></div>
          </div>
        </div>


        {/* Hero Content - Now on top with higher z-index */}
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="w-[full] md:w-[70%] gap-12 items-center"> 
            <AnimatedSection animation="fadeInLeft">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-text-shimmer drop-shadow-2xl">
                 Welcome to <br />
                  <span className="text-yellow-400 drop-shadow-lg">
                  Leading Lights
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed drop-shadow-lg font-medium">
                  Leading Lights is our dedicated ministry for children, aiming
                  to lay a strong spiritual foundation from an early age. We
                  believe in nurturing young hearts to shine brightly in their
                  world.​
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/mission">
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl">
                    Our Mission
                    </Button>
                  </Link>
                  {/* <Link to="/register">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl">
                      Become a member
                    </Button>
                  </Link> */}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Floating Elements for Extra Visual Interest */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-float opacity-60"></div>
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-red-500 rounded-full animate-float opacity-60"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-5 h-5 bg-blue-300 rounded-full animate-float opacity-60"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-3 h-3 bg-yellow-300 rounded-full animate-float opacity-60"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Why Choose Our Children's Ministry?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We provide a comprehensive approach to children's spiritual
                development
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="scaleIn" delay={100}>
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-red-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Loving Environment
                  </h3>
                  <p className="text-gray-600">
                    Every child is welcomed with open arms and unconditional
                    love in our caring community.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection animation="scaleIn" delay={200}>
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-red-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Bible-Based Learning
                  </h3>
                  <p className="text-gray-600">
                    Age-appropriate lessons that make Bible stories come alive
                    through interactive activities.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection animation="scaleIn" delay={300}>
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-red-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Strong Community
                  </h3>
                  <p className="text-gray-600">
                    Building lasting friendships and connections that extend
                    beyond Sunday mornings.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section> 

      {/* Bible Programme Registration CTA */}
      {/* <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <AnimatedSection animation="scaleIn">

            <div>
              <img className=" rounded-md" src={image}/>
            </div>
      
            <div className="flex flex-col gap-3 md:flex-row justify-center pt-8">
              <a href={cv} download="children_bible_school_form">
                <Button className="bg-blue-900 border border-yellow-500 hover:bg-blue-500 text-white px-12 py-6 text-xl font-bold transform hover:scale-105 transition-all duration-200 shadow-2xl">
                  Download Form
                </Button>
              </a>
              <Link to="/register-form">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-red-700 px-12 py-6 text-xl font-bold transform hover:scale-105 transition-all duration-200 shadow-2xl">
                  Register Now Online
                </Button>
              </Link>
            </div> 

            <p className="text-sm text-red-100 mt-4">
              Early registration recommended • Program fills up quickly
            </p>
          </AnimatedSection>
        </div>
      </section> */}

      {/* Ministry Books Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Book className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                  Ministry Books & Resources
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                Discover our collection of faith-building books written by our
                ministry team and presiding pastor
              </p>
              <a href="https://smhosstore.com/shop/?product_cat=childrens-books&orderby=date&last_item=childrens-books&last_stop=159">
                <div className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full inline-flex items-center font-semibold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Available at our Wisdom Bank
                </div>
              </a>
            </div>
          </AnimatedSection>

          {/* Book Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {ministryBooks.map((book, index) => (
              <AnimatedSection
                key={book.id}
                animation="scaleIn"
                delay={index * 100 + 200}
              >
                <a href={book.link} target="_blank">
                <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 group transform hover:scale-105 hover:shadow-xl h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="relative mb-4">
                      <img
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-yellow-400 text-blue-900 px-2 py-1 rounded text-xs font-semibold">
                        {book.category}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </a>
              </AnimatedSection>
            ))}
          </div>

          {/* Wisdom Bank CTA */}
          <AnimatedSection animation="fadeInUp" delay={600}>
            <div className="text-center">
              <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-0">
                <CardContent className="p-8">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      Visit Our{" "}
                      <span className="text-yellow-400">Wisdom Bank</span>
                    </h3>
                    <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                      Explore our complete collection of ministry books,
                      teaching resources, and faith-building materials. From
                      children's books to parent guides, find everything you
                      need to nurture spiritual growth in your family.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <a href="https://smhosstore.com/shop/?product_cat=childrens-books&orderby=date&last_item=childrens-books&last_stop=159">
                        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-200">
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Visit Wisdom Bank
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-blue-900">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Parents Are Saying
              </h2>
              <p className="text-lg text-blue-200">
                Hear from parents and children in our community
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection animation="fadeInUp" delay={100}>
              <Card className="bg-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl h-[250px]">
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
                    "The character-building materials are exactly what we’ve
                    been looking for. My son is now more thoughtful, prayerful,
                    and speaks differently. It’s working!"
                  </p>
                  <div className="font-semibold text-blue-900">
                    - Mrs. Bisi O. – Abuja
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={200}>
              <Card className="bg-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl h-[250px]">
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
                    "As a father, I’ve never seen my boys this interested in
                    spiritual content. The storybooks and activity materials
                    make learning fun, and they actually stick."
                  </p>
                  <div className="font-semibold text-blue-900">
                    - Mr. Daniel A. – Lagos
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={300}>
              <Card className="bg-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl h-[250px]">
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
                    "These materials are not just books — they’re discipleship
                    tools. Every Christian parent needs to expose their children
                    to this level of godly content."
                  </p>
                  <div className="font-semibold text-blue-900">
                    - Pastor John O. – Benin City
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-yellow-400">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedSection animation="scaleIn">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Stay Connected
            </h2>
            <p className="text-lg text-blue-800 mb-8 max-w-2xl mx-auto">
              Get weekly updates about upcoming events, activities, and
              resources.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border-blue-300 focus:border-blue-500 transform focus:scale-105 transition-all duration-200"
              />

              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 transform hover:scale-105 transition-all duration-200">
                {isLoading ? (
                  <Loader2 />
                ) : (
                  <div className="flex flex-row items-center gap-3">
                    {" "}
                    Subscribe
                    <Send className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 font-semibold">
                {errors.email}
              </p>
            )}
            <p className="text-sm text-blue-700 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
