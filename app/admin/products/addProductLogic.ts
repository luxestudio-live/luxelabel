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
  // Upload new images if provided
  if (form.mainImage instanceof File) {
    mainImage = await uploadImageToFirebaseStorage(form.mainImage, `products/${form.id}/main`);
  }
  if (form.ogImage instanceof File) {
    ogImage = await uploadImageToFirebaseStorage(form.ogImage, `products/${form.id}/og`);
  }
  if (Array.isArray(form.gallery)) {
    // Only upload new files
    const newGalleryFiles = form.gallery.filter((img: any) => img instanceof File);
    const newGalleryUrls = await uploadGalleryToFirebaseStorage(newGalleryFiles, `products/${form.id}/gallery`);
    gallery = [...gallery, ...newGalleryUrls];
  }
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
import { db, storage } from "@/lib/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Helper to upload a single image to Firebase Storage and return its URL
async function uploadImageToFirebaseStorage(file: File, folder: string = "products") {
  if (!file || !(file instanceof File) || !file.name || !file.size) {
    console.error("Invalid file for upload:", file);
    return "";
  }
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err) {
    console.error("Firebase Storage upload error:", err);
    return "";
  }
}

// Helper to upload gallery images to Firebase Storage
async function uploadGalleryToFirebaseStorage(files: File[], folder: string = "products/gallery") {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i]) {
      const url = await uploadImageToFirebaseStorage(files[i], folder);
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

  // 2. Upload images to Firebase Storage
  let mainImageUrl = "";
  let ogImageUrl = "";
  let galleryUrls = [];
  if (form.mainImage instanceof File) {
    mainImageUrl = await uploadImageToFirebaseStorage(form.mainImage, `products/${productId}/main`);
    if (!mainImageUrl) throw new Error("Main product image upload failed.");
  }
  if (form.ogImage instanceof File) {
    ogImageUrl = await uploadImageToFirebaseStorage(form.ogImage, `products/${productId}/og`);
    if (!ogImageUrl) throw new Error("OG image upload failed.");
  }
  if (Array.isArray(form.gallery) && form.gallery.length > 0) {
    galleryUrls = await uploadGalleryToFirebaseStorage(form.gallery, `products/${productId}/gallery`);
    if (galleryUrls.some(url => !url)) throw new Error("One or more gallery image uploads failed.");
  }

  // 3. Update product doc with image URLs
  await setDoc(productRef, {
    mainImage: mainImageUrl,
    ogImage: ogImageUrl,
    gallery: galleryUrls,
    updatedAt: serverTimestamp()
  }, { merge: true });
  // Fetch updated product doc to verify
  const { getDoc } = await import("firebase/firestore");
  const updatedDoc = await getDoc(productRef);
  return productId;
}

// Usage in your form:
// await handleAddProduct(form);
// Show success message or redirect
