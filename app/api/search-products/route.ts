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
  const results = products.filter(p => p.name.toLowerCase().includes(q));
  return NextResponse.json(results);
}
