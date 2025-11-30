import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
// Fetch a product by SKU (or id)
export async function fetchProductById(sku: string) {
  // Query Firestore by SKU field instead of document ID
  console.log("[fetchProductById] db:", db);
  console.log("[fetchProductById] collection: products");
  console.log("[fetchProductById] sku:", sku, typeof sku);
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("sku", "==", sku));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.error("[fetchProductById] Product not found for SKU:", sku);
    throw new Error("Product not found");
  }
  // Return the first matching product
  const docSnap = querySnapshot.docs[0];
  return { ...docSnap.data(), id: docSnap.id };
}

// Update product
export async function handleUpdateProduct(form: any, removeImages: string[] = []) {
  const ref = doc(db, "products", form.id);
  // Remove selected images from gallery/main/og
  let gallery = Array.isArray(form.gallery) ? form.gallery.filter((img: any) => !removeImages.includes(img.url || img)) : [];
  let mainImage = removeImages.includes(form.mainImage?.url || form.mainImage) ? "" : form.mainImage;
  let ogImage = removeImages.includes(form.ogImage?.url || form.ogImage) ? "" : form.ogImage;
  // If new files are uploaded, handle upload logic (not shown here)
  // Remove undefined fields (especially variants)
  const updateData: any = {
    ...form,
    gallery,
    mainImage,
    ogImage,
    updatedAt: serverTimestamp()
  };
  if (updateData.variants === undefined) {
    delete updateData.variants;
  }
  await updateDoc(ref, updateData);
}

// Delete product
export async function handleDeleteProduct(sku: string) {
  const ref = doc(db, "products", sku);
  await deleteDoc(ref);
}
import { db } from "@/lib/firebaseClient";

// Helper to upload a single image to Cloudinary and return its URL
async function uploadImageToCloudinary(file: File) {
  if (!file || !(file instanceof File) || !file.name || !file.size) {
    console.error("Invalid file for upload:", file);
    return "";
  }
  const formData = new FormData();
  formData.append("file", file);
  console.log("Uploading file to Cloudinary:", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  let data;
  try {
    // Always read the response body only once
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      if (contentType.includes('application/json')) {
        data = await res.json();
        console.error("Upload failed (JSON):", data);
        throw new Error(data.error || "Upload failed");
      } else {
        const text = await res.text();
        console.error("Upload failed (text):", text);
        throw new Error(text);
      }
    } else {
      if (contentType.includes('application/json')) {
        data = await res.json();
        return data.url || "";
      } else {
        // Unexpected response type
        const text = await res.text();
        throw new Error(text);
      }
    }
  } catch (err) {
    console.error("Image upload error:", err);
    return "";
  }
}

// Helper to upload gallery images
async function uploadGalleryToCloudinary(files: File[]) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i]) {
      const url = await uploadImageToCloudinary(files[i]);
      urls.push(url);
    }
  }
  return urls;
}

// Main submit handler for Add Product
export async function handleAddProduct(form: any) {
  // 1. Create a new product doc to get the ID
  // Remove undefined fields (especially variants)
  const addData: any = {
    ...form,
    mainImage: "",
    ogImage: "",
    gallery: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  if (addData.variants === undefined) {
    delete addData.variants;
  }
  const productRef = await addDoc(collection(db, "products"), addData);
  const productId = productRef.id;

  // 2. Upload images to Cloudinary
  // Upload images and log results
  let mainImageUrl = "";
  let ogImageUrl = "";
  let galleryUrls = [];
  if (form.mainImage instanceof File) {
    mainImageUrl = await uploadImageToCloudinary(form.mainImage);
    console.log("Main image upload result:", mainImageUrl);
    if (!mainImageUrl) throw new Error("Main product image upload failed.");
  }
  if (form.ogImage instanceof File) {
    ogImageUrl = await uploadImageToCloudinary(form.ogImage);
    console.log("OG image upload result:", ogImageUrl);
    if (!ogImageUrl) throw new Error("OG image upload failed.");
  }
  if (Array.isArray(form.gallery) && form.gallery.length > 0) {
    galleryUrls = await uploadGalleryToCloudinary(form.gallery);
    console.log("Gallery upload result:", galleryUrls);
    if (galleryUrls.some(url => !url)) throw new Error("One or more gallery image uploads failed.");
  }

  // 3. Update product doc with image URLs
  await setDoc(productRef, {
    mainImage: mainImageUrl,
    ogImage: ogImageUrl,
    gallery: galleryUrls,
    updatedAt: serverTimestamp()
  }, { merge: true });
  console.log("Firestore product updated with image URLs");
  // Fetch updated product doc to verify
  const { getDoc } = await import("firebase/firestore");
  const updatedDoc = await getDoc(productRef);
  console.log("Updated product doc:", updatedDoc.data());
  return productId;
}

// Usage in your form:
// await handleAddProduct(form);
// Show success message or redirect
