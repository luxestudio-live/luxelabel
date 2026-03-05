"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getImageUrl } from "@/lib/utils";
import { useCart } from "@/app/cart/CartContext";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";

// --- Types ---
type Variant = {
  type: string;
  sizeName?: string;
  colorName?: string;
};

type Product = {
  id: string;
  name: string;
  mainImage?: string;
  gallery?: string[];
  salePrice?: number;
  regularPrice?: number;
  shortDesc?: string;
  fullDesc?: string;
  details?: string[];
  variants?: Variant[];
  referenceImage?: string;
  [key: string]: any;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
};

export default function ProductPage() {
  const params = useParams();
  const id = params && typeof params === "object" && "id" in params ? (params.id as string) : undefined;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState<{ name: string; rating: number; comment: string }>({ name: "", rating: 5, comment: "" });
  const [recommended, setRecommended] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const ref = doc(db, "products", String(id));
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Product;
          setProduct(data);
          // Extract sizes and colors from variants
          let sizes: string[] = [];
          let colors: string[] = [];
          if (Array.isArray(data.variants)) {
            sizes = data.variants.filter((v: Variant) => v.type === 'size' && v.sizeName).map((v: Variant) => v.sizeName!)
            colors = data.variants.filter((v: Variant) => v.type === 'color' && v.colorName).map((v: Variant) => v.colorName!)
          }
          setSizeOptions(sizes.length > 0 ? sizes : ["One Size"]);
          setColorOptions(colors.length > 0 ? colors : ["Default"]);
          setSelectedSize(sizes.length > 0 ? sizes[0] : "One Size");
          setSelectedColor(colors.length > 0 ? colors[0] : "Default");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching product");
      }
    }
    async function fetchReviews() {
      if (!id) return;
      try {
        const snap = await getDocs(collection(db, "products", String(id), "reviews"));
        setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      } catch (err: any) {
        setError(err.message || "Error fetching reviews");
      }
    }
    async function fetchRecommended() {
      try {
        const snap = await getDocs(collection(db, "products"));
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)).filter(p => p.id !== id);
        // Shuffle and pick 3
        const shuffled = [...all];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setRecommended(shuffled.slice(0, 3));
      } catch (err: any) {
        setError(err.message || "Error fetching recommended products");
      }
    }
    fetchProduct();
    fetchReviews();
    fetchRecommended();
  }, [id]);

  async function handleReviewSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;
    try {
      await addDoc(collection(db, "products", String(id), "reviews"), reviewForm);
      setReviewForm({ name: "", rating: 5, comment: "" });
      // Refresh reviews
      const snap = await getDocs(collection(db, "products", String(id), "reviews"));
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    } catch (err: any) {
      setError(err.message || "Error submitting review");
    }
  }

  if (error) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-20 text-center text-lg text-red-500">{error}</div><Footer /></div>;
  if (!product) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-20 text-center text-lg">Loading...</div><Footer /></div>;

  // Show all images: main image first, then gallery images (no duplicates)
  let images: string[] = [];
  if (product) {
    const gallery = Array.isArray(product.gallery) ? product.gallery : [];
    let main = "";
    if (typeof product.mainImage === "string" && product.mainImage.trim() !== "") {
      main = product.mainImage;
    } else if (gallery.length > 0) {
      main = gallery[0];
    }
    images = [main, ...gallery.filter((img: string) => img && img !== main)].filter(Boolean);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/10 shadow-lg w-full">
              <Image
                src={getImageUrl(images[selectedImage])}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex gap-3 justify-start mt-2">
              {images.map((image: string, index: number) => (
                <button
                  key={image + index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-14 h-14 overflow-hidden rounded-md border-2 transition-colors ${selectedImage === index ? "border-black" : "border-gray-200"}`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`Product Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h1 className="text-4xl font-semibold mb-4 text-gray-900">{product.name}</h1>
              <div className="mb-4 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  {product.salePrice && product.regularPrice && product.salePrice < product.regularPrice ? (
                    <span className="text-xl text-gray-400 line-through">Rs. {product.regularPrice}</span>
                  ) : null}
                  <span className="text-2xl font-bold text-black">Rs. {product.salePrice || product.regularPrice}</span>
                </div>
              </div>
              {/* Variant: Size */}
              <div className="mb-4">
                <div className="text-base font-semibold mb-2">Size</div>
                <div className="flex gap-2 flex-wrap">
                  {sizeOptions.length === 0 && (
                    <span className="text-red-500">No sizes found in variants!</span>
                  )}
                  {sizeOptions.map((size, idx) => (
                    <button
                      key={size + idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-full border text-base font-semibold transition-colors ${selectedSize === size ? "bg-black text-white border-black" : "bg-white text-black border-gray-300"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              {/* Variant: Color */}
              <div className="mb-4">
                <div className="text-base font-semibold mb-2">Color</div>
                <div className="flex gap-3 items-center flex-wrap">
                  {colorOptions.map((color, idx) => (
                    <button
                      key={color + idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${selectedColor === color ? "border-black ring-2 ring-black" : "border-gray-300"}`}
                      style={{ background: color === "Default" ? undefined : color }}
                      aria-label={color}
                    >
                      {color === "Default" ? <span className="text-xs text-gray-500">D</span> : null}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">{selectedColor}</span>
                </div>
              </div>
              {/* Short Description */}
              {product.shortDesc && (
                <p className="text-lg text-gray-700 leading-relaxed mb-6">{product.shortDesc}</p>
              )}
              {/* Product Details (features, etc.) */}
              {product.details && (
                <div className="mb-4">
                  <div className="text-base font-semibold mb-2">Details</div>
                  <ul className="list-disc pl-5 text-gray-700">
                    {product.details.map((d: string) => <li key={d}>{d}</li>)}
                  </ul>
                </div>
              )}
              {/* Quantity */}
              <div className="mb-6">
                <label htmlFor="quantity" className="text-base font-semibold mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400 transition-colors bg-white" aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </button>
                  <input id="quantity" type="number" min={1} value={quantity} readOnly className="w-12 text-center border-none bg-transparent text-lg font-semibold" />
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400 transition-colors bg-white" aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Add to Bag & Buy Now - stacked vertically */}
              <div className="flex flex-col gap-4 mb-8">
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-95"
                  onClick={() => {
                    if (!product) return;
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.salePrice ?? product.regularPrice ?? 0,
                      image: product.mainImage ?? "",
                      variant: `${selectedColor}${selectedSize ? ", " + selectedSize : ""}`,
                      quantity,
                    });
                  }}
                >
                  Add to Bag
                </Button>
                <Button
                  className="w-full bg-white text-black border border-black hover:bg-gray-100 h-12 text-base font-semibold rounded-xl shadow-lg"
                  onClick={() => {
                    if (!product) return;
                    const buyNowItem = {
                      id: product.id,
                      name: product.name,
                      price: product.salePrice ?? product.regularPrice ?? 0,
                      image: product.mainImage ?? "",
                      variant: `${selectedColor}${selectedSize ? ', ' + selectedSize : ''}`,
                      quantity,
                    };
                    localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
                    localStorage.setItem("buyNowActive", "true");
                    globalThis.location.href = "/checkout";
                  }}
                >
                  Buy Now
                </Button>
                {/* Luxe options below Buy Now */}
                <div className="mt-2 flex flex-col gap-2 text-gray-700 text-base">
                  <div className="flex items-center gap-2">
                    <span className="inline-block">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9V7a2 2 0 0 1 2-2h2m0 0h10a2 2 0 0 1 2 2v2m-14 0v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9m-14 0h14"/></svg>
                    </span><span>Free shipping on orders over Rs. 5,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 0v4m0 0h4m-4 0H8"/></svg>
                    </span><span>Authentic luxury guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/></svg>
                    </span><span>For returns, contact support</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/></svg>
                    </span><span>Shipping Time: <span className="font-semibold ml-1">1 Month</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Full Description (Rich Text) - below main section, with reference image on right, text on left, responsive */}
        {product.fullDesc && (
          <div className="mt-16 flex flex-col md:flex-row md:flex-wrap items-stretch gap-8 bg-yellow-50 rounded-xl p-8 shadow-lg">
            {(() => {
              // Calculate description length
              const descLength = typeof product.fullDesc === 'string' ? product.fullDesc.replaceAll(/<[^>]+>/g, '').length : 0;
              // Set image size based on description length
              let imgWidth = 350, imgHeight = 250;
              if (descLength > 800) { imgWidth = 500; imgHeight = 350; }
              if (descLength > 1600) { imgWidth = 650; imgHeight = 450; }
              // Set minHeight for text to match image
              const minHeight = imgHeight;
              return <>
                <div className="prose prose-lg max-w-none text-gray-800 min-w-62.5 w-full md:w-1/2 flex-1 wrap-break-word" style={{wordBreak:'break-word', minHeight}} dangerouslySetInnerHTML={{ __html: product.fullDesc }} />
                {/* Reference image: use product.referenceImage, else pick any image from gallery except main */}
                {(() => {
                  let refImg = product.referenceImage;
                  if (!refImg && Array.isArray(product.gallery) && product.gallery.length > 1) {
                    // Pick any image except the main one
                    refImg = product.gallery.find((img: string) => img !== product.mainImage) || product.gallery[1];
                  }
                  return refImg ? (
                    <div className="w-full md:w-1/2 shrink-0 flex items-center justify-center min-w-62.5">
                      <Image src={getImageUrl(refImg)} alt="Description Reference" width={imgWidth} height={imgHeight} className="rounded-xl object-cover w-full h-auto" />
                    </div>
                  ) : null;
                })()}
              </>;
            })()}
          </div>
        )}
        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Customer Reviews</h2>
          <form className="mb-12 bg-white rounded-2xl shadow-xl p-8 max-w-xl mx-auto border border-gray-100" onSubmit={handleReviewSubmit}>
            <div className="flex gap-4 mb-4 items-center">
              <input type="text" className="border border-gray-300 p-3 rounded-lg w-1/2 text-lg" placeholder="Your Name" value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))} required />
              <div className="flex gap-1 items-center">
                {[1,2,3,4,5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star className={`h-6 w-6 ${reviewForm.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-none"}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea className="border border-gray-300 p-3 rounded-lg w-full mb-4 text-lg" placeholder="Your Review" value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required />
            <Button type="submit" className="bg-black text-white w-full h-12 text-lg font-semibold rounded-xl shadow-lg">Submit Review</Button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.length === 0 && <div className="text-muted-foreground text-center col-span-3">No reviews yet.</div>}
            {reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`h-5 w-5 ${r.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-none"}`} />
                  ))}
                </div>
                <div className="italic text-gray-700 mb-2">{r.comment}</div>
                <div className="font-bold text-gray-900">{r.name}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Recommended Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Other Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommended.map(p => (
              <Link key={p.id} href={`/product/${p.id}`} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-lg">
                  <Image
                    src={getImageUrl(
                      p.mainImage
                      || p.image
                      || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "")
                    )}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium mb-2 group-hover:text-muted-foreground transition-colors text-lg">{p.name}</h3>
                <p className="font-light">Rs. {p.salePrice || p.regularPrice}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">View Details</Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
