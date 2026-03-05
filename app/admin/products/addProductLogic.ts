import { auth, db, storage } from "@/lib/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function getImageUrl(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value?.url === "string") return value.url;
  return "";
}

async function waitForAuthenticatedUser(timeoutMs = 10000): Promise<User> {
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve, reject) => {
    let unsubscribe: (() => void) | undefined;
    const timeout = setTimeout(() => {
      if (unsubscribe) unsubscribe();
      reject(new Error("Admin Firebase session not found. Please log in again and retry."));
    }, timeoutMs);

    unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
      resolve(user);
    });
  });
}

async function ensureAuthenticatedAdmin() {
  const user = await waitForAuthenticatedUser();
  await user.getIdToken(true);

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists() || userSnap.data()?.isAdmin !== true) {
    throw new Error("You are not authorized to perform admin uploads.");
  }

  return user;
}
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
  await ensureAuthenticatedAdmin();

  const ref = doc(db, "products", form.id);

  const galleryItems = Array.isArray(form.gallery) ? form.gallery : [];
  const existingGalleryUrls = galleryItems
    .map((img: any) => getImageUrl(img))
    .filter((url: string) => !!url && !removeImages.includes(url));

  const newGalleryFiles = galleryItems.filter((img: any) => img instanceof File);

  let mainImage = removeImages.includes(getImageUrl(form.mainImage)) ? "" : getImageUrl(form.mainImage);
  let ogImage = removeImages.includes(getImageUrl(form.ogImage)) ? "" : getImageUrl(form.ogImage);

  if (form.mainImage instanceof File) {
    mainImage = await uploadImageToFirebaseStorage(form.mainImage, `products/${form.id}/main`);
    if (!mainImage) throw new Error("Main product image upload failed.");
  }

  if (form.ogImage instanceof File) {
    ogImage = await uploadImageToFirebaseStorage(form.ogImage, `products/${form.id}/og`);
    if (!ogImage) throw new Error("OG image upload failed.");
  }

  let gallery = [...existingGalleryUrls];
  if (newGalleryFiles.length > 0) {
    const newGalleryUrls = await uploadGalleryToFirebaseStorage(newGalleryFiles, `products/${form.id}/gallery`);
    if (newGalleryUrls.some((url) => !url)) throw new Error("One or more gallery image uploads failed.");
    gallery = [...existingGalleryUrls, ...newGalleryUrls];
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

// Helper to upload a single image to Firebase Storage and return its URL
async function uploadImageToFirebaseStorage(file: File, folder: string = "products") {
  if (!file || !(file instanceof File) || !file.name || !file.size) {
    console.error("Invalid file for upload:", file);
    throw new Error("Invalid file selected for upload.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const inferredContentType =
    file.type && file.type.startsWith("image/")
      ? file.type
      : extension === "png"
      ? "image/png"
      : extension === "jpg" || extension === "jpeg"
      ? "image/jpeg"
      : extension === "webp"
      ? "image/webp"
      : extension === "gif"
      ? "image/gif"
      : extension === "avif"
      ? "image/avif"
      : "application/octet-stream";

  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  try {
    await uploadBytes(storageRef, file, { contentType: inferredContentType });
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err: any) {
    console.error("Firebase Storage upload error:", err);
    throw new Error(err?.message || "Firebase Storage upload failed.");
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
  await ensureAuthenticatedAdmin();

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
