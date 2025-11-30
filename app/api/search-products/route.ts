import { NextResponse } from 'next/server';

const products = [
  { id: 'LSK-001', name: 'Luxury Silk Dress', price: 4999 },
  { id: 'DH-003', name: 'Designer Handbag', price: 7999 },
  { id: 'SH-002', name: 'Silk Handkerchief', price: 999 },
  { id: 'JW-004', name: 'Jewelry Set', price: 12999 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }
    // Search by name, category, or collection
    const results = products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const collection = product.collection?.toLowerCase() || "";
      return (
        name.includes(q) ||
        category.includes(q) ||
        collection.includes(q)
      );
    });
  return NextResponse.json(results);
}
