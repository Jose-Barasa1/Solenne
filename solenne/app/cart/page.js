'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingCart, X } from 'lucide-react';


export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json(); // Parse the response
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error('Failed to fetch cart');
      }
    };
    loadCart();
  }, []);

  const removeFromCart = async (id) => {
    try {
      await Delete(`/api/cart/${id}`);
      setCart(prev => prev.filter(item => item.id !== id));
      toast.success('Removed from cart');
    } catch {
      toast.error('Error removing item');
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ShoppingCart /> Cart
      </h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
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
                onClick={() => removeFromCart(item.id)}
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
