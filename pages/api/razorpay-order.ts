
import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'node:buffer';
let fetchFn: typeof fetch;
if (typeof fetch === 'undefined') {
  fetchFn = require('node-fetch');
} else {
  fetchFn = fetch;
}


// Use REST API call instead of SDK for serverless compatibility
const RAZORPAY_KEY_ID = 'rzp_test_RjmxgXfQRU1nog';
const RAZORPAY_KEY_SECRET = 'Ck8w1h8dvV51kalk5ucXKfAA';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { amount, currency = 'INR', receipt = 'order_rcptid_11', ...orderData } = req.body;
  try {
    // Call Razorpay REST API directly
    const response = await fetchFn('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET).toString('base64'),
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects paise
        currency,
        receipt,
      }),
    });
    const order = await response.json();
    if (!response.ok) {
      throw new Error(order.error?.description || 'Failed to create order');
    }

    // Save order to Firestore with new fields
    const { getFirestore, collection, addDoc, Timestamp } = await import('firebase/firestore');
    const { firebaseApp } = await import('@/lib/firebaseClient');
    const db = getFirestore(firebaseApp);
    const orderToSave = {
      ...orderData,
      razorpayOrderId: order.id,
      order_status: 'Order Placed',
      courier_partner: '',
      tracking_number: '',
      created: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'orders'), orderToSave);
    res.status(200).json({ ...order, firestoreOrderId: docRef.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
