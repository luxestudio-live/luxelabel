import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function fetchOrderById(orderId: string) {
  const ref = doc(db, "orders", orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Order not found");
  return { ...snap.data(), id: snap.id };
}
