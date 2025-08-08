'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Delete, Heart, X } from 'lucide-react';


export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist');
        const data = await res.json(); // Fix here
        setWishlist(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error('Failed to fetch wishlist');
      }
    };
    loadWishlist();
  }, []);

  const removeFromWishlist = async (id) => {
    try {
      Delete(`/api/wishlist/${id}`);
      setWishlist(prev => prev.filter(item => item.id !== id));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Error removing item');
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Heart /> Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <div className="space-y-4">
          {wishlist.map(item => (
            <motion.div
              key={item.id}
              layout
              className="bg-purple-900 p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-purple-300">{item.price} KES</p>
              </div>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="text-red-400 hover:text-red-600"
              >
                <X />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
