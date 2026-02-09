import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  ArrowRight,
  Heart,
  BookOpen,
  Users,
  Loader2,
  Send,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import { useState } from "react";
import { useAddNewsletterMutation } from "@/redux/features/newsletter/newsletterApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useGetPostsQuery } from "@/redux/features/blogApi/blogApi";
import Helmet from "react-helmet";

// Map icon strings to actual components
const iconMap = {
  BookOpen,
  Heart,
  Users
};

// Predefined categories with their icons
const CATEGORIES = [
  { id: "family-devotions", name: "Family Devotions", icon: BookOpen },
  { id: "character-building", name: "Character Building", icon: Heart },
  { id: "social-development", name: "Social Development", icon: Users },
  { id: "parenting-tips", name: "Parenting Tips", icon: Heart },
];

export default function BlogPage() {
  const { data: blogPosts, isLoading, isError, refetch } = useGetPostsQuery({});
  const [email, setEmail] = useState("");
  const [addNewsletter, { isLoading: isSubmitting }] = useAddNewsletterMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Generate structured data for SEO
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "headline": "Children's Ministry Blog - Salvation Ministries",
      "description": "Insights, tips, and inspiration for nurturing children's faith and family life",
      "image": "https://www.salvationministries.org/blog-default.jpg",
      "publisher": {
        "@type": "Organization",
        "name": "Salvation Ministries",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.salvationministries.org/logo.png"
        }
      },
      "blogPost": blogPosts?.map((post: any) => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "author": {
          "@type": "Person",
          "name": post.author || "Salvation Ministries Team"
        },
        "image": post.image?.url || ""
      }))
    };
  };

  // Get counts for each category
  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      counts[cat.name] = blogPosts?.filter((post:any) => post.category === cat.name).length || 0;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const featuredPost = blogPosts?.find((post:any) => post.featured) || blogPosts?.[0];
  const structuredData = generateStructuredData();

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const result = await addNewsletter({ email }).unwrap();
      if (result?.success) {
        toast.success("🎉 Successfully subscribed to our newsletter!");
        setEmail("");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Subscription failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          We couldn't load the blog posts. Please check your connection and try again.
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={refetch}
          aria-label="Retry loading blog posts"
        >
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Metadata */}
      <Helmet>
        <title>Children's Ministry Blog | Salvation Ministries</title>
        <meta name="description" content="Insights, tips, and inspiration for nurturing children's faith and family life at Salvation Ministries" />
        <meta name="keywords" content="children ministry, christian parenting, family devotions, character building, salvation ministries" />
        <meta property="og:title" content="Children's Ministry Blog | Salvation Ministries" />
        <meta property="og:description" content="Practical wisdom for parents and children's ministry leaders" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={featuredPost?.image?.url || "https://www.salvationministries.org/blog-default.jpg"} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ministry <span className="text-yellow-400">Blog</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Insights, tips, and inspiration for nurturing children's faith and
            family life
          </p>
        </div>
      </header>

      {/* Featured Post */}
      {featuredPost && (
        <section aria-labelledby="featured-post-heading">
          <div className="container mx-auto max-w-6xl py-16 px-4">
            <div className="mb-12">
              <h2 id="featured-post-heading" className="text-3xl font-bold text-blue-900 mb-8 text-center">
                Featured Article
              </h2>
              <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-yellow-50">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="p-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                      <span className="text-yellow-600 font-medium">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-blue-900 mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" aria-hidden="true" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <time dateTime={featuredPost.date}>{featuredPost.date}</time>
                      </div>
                    </div>
                    <Link to={`/post/${featuredPost._id}`} aria-label={`Read full article: ${featuredPost.title}`}>
                      <Button className="bg-red-600 hover:bg-red-700 text-white group">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                  <div className="p-8 flex items-center justify-center">
                    {featuredPost.image ? (
                      <img
                        src={featuredPost.image.url}
                        alt={featuredPost.title}
                        className="rounded-lg shadow-lg w-full max-w-md object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto" aria-hidden="true" />
                          <p>No image available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <main>
        <section className="py-16 px-4 bg-gray-50" aria-labelledby="recent-articles-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 id="recent-articles-heading" className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Recent Articles
              </h2>
              <p className="text-lg text-gray-600">
                Practical wisdom for parents, teachers, and children's ministry
                leaders
              </p>
            </div>
            
            {blogPosts?.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Articles Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We haven't published any articles yet. Check back soon for inspiring content!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts?.map((post: any, index: any) => {
                  const IconComponent = iconMap[post.icon as keyof typeof iconMap] || BookOpen;
                  
                  return (
                    <AnimatedSection
                      key={post._id}
                      animation="scaleIn"
                      delay={index * 100}
                    >
                      <article>
                        <Card className="border-2 border-blue-100 hover:border-red-300 transition-all duration-300 group transform hover:scale-[1.02] hover:shadow-lg">
                          <CardHeader className="p-0">
                            {post.image ? (
                              <img
                                src={post.image.url}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            ) : (
                              <div className="bg-gray-200 w-full h-48 flex items-center justify-center rounded-t-lg">
                                <IconComponent className="w-12 h-12 text-gray-400" aria-hidden="true" />
                              </div>
                            )}
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-2 mb-3">
                              <IconComponent className="w-4 h-4 text-red-600" aria-hidden="true" />
                              <span className="text-yellow-600 font-medium text-sm">
                                {post.category}
                              </span>
                            </div>
                            <h3 className="text-xl text-blue-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" aria-hidden="true" />
                                <span className="line-clamp-1 max-w-[120px]">{post.author}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" aria-hidden="true" />
                                <time dateTime={post.date}>{post.date}</time>
                              </div>
                            </div>
                            <Link to={`/post/${post._id}`} aria-label={`Read more: ${post.title}`}>
                              <Button
                                variant="outline"
                                className="w-full border-blue-300 text-blue-900 hover:bg-blue-900 hover:text-white bg-transparent group-hover:border-blue-900"
                              >
                                Read More
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </article>
                    </AnimatedSection>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4" aria-labelledby="categories-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-lg text-gray-600">
                Find articles that match your specific interests and needs
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((category) => (
                <Link 
                  to={`/blog?category=${category.name}`} 
                  key={category.id}
                  aria-label={`Browse ${category.name} articles`}
                >
                  <Card className="text-center border-2 border-blue-100 hover:border-yellow-400 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6 flex flex-col items-center">
                      <category.icon className="w-12 h-12 text-red-600 mb-4" aria-hidden="true" />
                      <h3 className="text-lg font-bold text-blue-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {categoryCounts[category.name] || 0} article
                        {categoryCounts[category.name] !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                    Never Miss an Article
                  </h2>
                  <p className="text-lg text-blue-800 mb-6">
                    Subscribe to our newsletter and get the latest parenting tips and
                    ministry insights delivered straight to your inbox.
                  </p>
                  <div className="flex items-center text-blue-800">
                    <div className="flex -space-x-2 mr-4">
                      <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white overflow-hidden" >
                        <img 
                          className="h-10 w-10 object-cover" 
                          src="https://media.istockphoto.com/id/1394347360/photo/confident-young-black-businesswoman-standing-at-a-window-in-an-office-alone.jpg?s=612x612&w=0&k=20&c=tOFptpFTIaBZ8LjQ1NiPrjKXku9AtERuWHOElfBMBvY=" 
                          alt="Subscriber 1" 
                        />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white overflow-hidden" >
                        <img 
                          className="h-10 w-10 object-cover" 
                          src="https://media.istockphoto.com/id/2204226953/photo/close-up-happy-young-woman-with-curly-hair.jpg?s=612x612&w=0&k=20&c=2H8bwSNVGROyU6UKHLGYsCs-2KZLIBeTyTBemhHpU9o=" 
                          alt="Subscriber 2" 
                        />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white overflow-hidden" >
                        <img 
                          className="h-10 w-10 object-cover" 
                          src="https://images.unsplash.com/photo-1530785602389-07594beb8b73?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFwcHklMjBhZnJpY2FuJTIwd29tYW58ZW58MHx8MHx8fDA%3D" 
                          alt="Subscriber 3" 
                        />
                      </div>
                    </div>
                    <p className="text-sm font-medium">
                      Join <span className="text-red-600">500+</span> families
                    </p>
                  </div>
                </div>
                
                <div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="sr-only">Email address</label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.email ? 'border-red-500' : 'border-blue-300'
                          } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors`}
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-red-600 text-sm">{errors.email}</p>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-6 text-lg font-medium transition-all transform hover:scale-[1.02]"
                      disabled={isSubmitting}
                      aria-label="Subscribe to newsletter"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      ) : (
                        <>
                          Subscribe Now
                          <Send className="w-5 h-5 ml-3" aria-hidden="true" />
                        </>
                      )}
                    </Button>
                    
                    <p className="text-sm text-gray-500 text-center mt-4">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}