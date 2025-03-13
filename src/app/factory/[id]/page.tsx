import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Factory,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Star,
  Truck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Scissors from "@/components/scissors";
import { t } from "@/lib/i18n/server";
import { createClient } from "../../../../supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function FactoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch factory data
  const { data: factory, error: factoryError } = await supabase
    .from("factories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (factoryError) {
    console.error("Error fetching factory:", factoryError);
    return notFound();
  }

  // Fetch products for this factory
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("factory_id", params.id)
    .eq("status", "active")
    .limit(3);

  if (productsError) {
    console.error("Error fetching factory products:", productsError);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={
            factory.cover_image ||
            "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=1200&q=80"
          }
          alt={factory.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Factory Header */}
        <div className="bg-white rounded-xl border p-6 -mt-20 relative z-10 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-24 w-24 rounded-xl overflow-hidden border-4 border-white">
              <Image
                src={
                  factory.image ||
                  "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80"
                }
                alt={factory.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{factory.name}</h1>
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{factory.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        className="fill-amber-500 text-amber-500"
                        size={16}
                      />
                      <span>
                        {factory.rating || 4.5} ({factory.review_count || 0}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>Contact</span>
                  </Button>
                  <Link href={`/factory/${params.id}/products`}>
                    <Button className="flex items-center gap-2">
                      <Package size={16} />
                      <span>View Products</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Factory Details */}
          <div className="flex-1">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    About {factory.name}
                  </h2>
                  <p className="text-gray-600 mb-6">{factory.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {(factory.specialties || []).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Certifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(factory.certifications || []).map((cert, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1"
                          >
                            <CheckCircle2 size={14} />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Production Details
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Package size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Minimum Order</h3>
                        <p className="text-gray-600">
                          {factory.min_order_quantity} units
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Lead Time</h3>
                        <p className="text-gray-600">{factory.lead_time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Factory size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Production Capacity</h3>
                        <p className="text-gray-600">{factory.capacity}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Services Offered
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <Scissors size={18} />,
                        service: "Pattern Making",
                      },
                      {
                        icon: <FileText size={18} />,
                        service: "Sample Development",
                      },
                      {
                        icon: <Users size={18} />,
                        service: "Small Batch Production",
                      },
                      {
                        icon: <Factory size={18} />,
                        service: "Mass Production",
                      },
                      { icon: <Package size={18} />, service: "Packaging" },
                      {
                        icon: <Truck size={18} />,
                        service: "Shipping & Logistics",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="text-blue-600">{item.icon}</div>
                        <span>{item.service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {products && products.length > 0 && (
                  <div className="bg-white rounded-xl border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Featured Products
                      </h2>
                      <Link
                        href={`/factory/${params.id}/products`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        View All Products
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="border rounded-lg overflow-hidden hover:shadow-md transition-all"
                        >
                          <div className="relative h-40 w-full">
                            <Image
                              src={
                                product.image ||
                                "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"
                              }
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              ${product.price}
                            </p>
                            <Link
                              href={`/factory/${params.id}/products`}
                              className="text-blue-600 hover:underline text-xs"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="gallery">
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Factory Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(
                      factory.gallery || [
                        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
                        "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=600&q=80",
                        "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=600&q=80",
                        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
                        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
                        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
                      ]
                    ).map((image, index) => (
                      <div
                        key={index}
                        className="relative h-48 rounded-lg overflow-hidden border"
                      >
                        <Image
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Customer Reviews</h2>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="fill-amber-500" size={18} />
                      <span className="font-medium">
                        {factory.rating || 4.5}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({factory.review_count || 0})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(
                      factory.reviews || [
                        {
                          id: 1,
                          author: "Sarah Johnson",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                          rating: 5,
                          date: "2023-10-15",
                          comment:
                            "Excellent quality and communication. Our order was delivered on time and exceeded our expectations. Will definitely work with them again.",
                        },
                        {
                          id: 2,
                          author: "Michael Chen",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
                          rating: 4,
                          date: "2023-09-22",
                          comment:
                            "Good experience overall. The products were well-made, though there was a slight delay in shipping. Communication was great throughout the process.",
                        },
                        {
                          id: 3,
                          author: "Emma Rodriguez",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
                          rating: 5,
                          date: "2023-08-30",
                          comment:
                            "Incredible attention to detail. Our custom designs were executed perfectly, and the factory was very accommodating with our revisions.",
                        },
                      ]
                    ).map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image
                              src={review.avatar}
                              alt={review.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{review.author}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        className={
                                          i < review.rating
                                            ? "fill-amber-500 text-amber-500"
                                            : "text-gray-300"
                                        }
                                      />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{review.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-gray-600">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="mt-4 w-full">
                    View All Reviews
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Request Sample Form */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Request a Sample</h2>
              <p className="text-gray-600 mb-6">
                Get a sample of your design before placing a bulk order
              </p>

              <Button className="w-full mb-4">Request Sample</Button>
              <Button variant="outline" className="w-full">
                Place Order
              </Button>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span>+212 522 123 456</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare size={16} />
                    <span>
                      info@{factory.name.toLowerCase().replace(/\s+/g, "")}.com
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{factory.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
