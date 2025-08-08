'use client';

import { useParams } from 'next/navigation';
import TrackMap3D from '@/components/TrackMap3D';

export default function TrackOrderPage() {
  const { orderId } = useParams();

  const parsedId = Number(orderId);
  const isValid = parsedId && !isNaN(parsedId);

  if (!isValid) {
    return (
      <div className="text-center text-red-500 p-10">
        Invalid or missing Order ID. Please check your tracking link.
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-black">
      <h1 className="text-2xl font-bold mb-6 text-purple-400">🚚 Track Your Order</h1>
      <TrackMap3D orderId={parsedId} />
    </div>
  );
}
