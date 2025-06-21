'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingCart, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const steps = ['Address Info', 'Review Cart', 'Payment'];

const API = 'http://localhost:5000/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    address: '',
    postal_code: ''
  });

  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('solenne_cart')) || [];
    setCartItems(localCart);
    setLoading(false);
  }, []);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleNext = () => {
    if (step === 0 && (!address.name || !address.phone || !address.city)) {
      toast.error('Please fill in all required address fields.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePay = () => {
    toast.success('Payment successful!');
    setPaid(true);
    localStorage.removeItem('solenne_cart');

    setTimeout(() => {
      router.push('/thank-you');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100020] via-[#180030] to-[#1f0040] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-purple-300">Secure Checkout</h1>

        {/* Step Indicator */}
        <div className="flex justify-between items-center text-sm font-medium text-purple-200">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`rounded-full w-8 h-8 mx-auto mb-1 ${
                  i <= step ? 'bg-fuchsia-500' : 'bg-purple-700'
                } flex items-center justify-center`}
              >
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>

        {/* Animated Step Sections */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="address"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-purple-200">Shipping Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                />
                <input
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400"
                  placeholder="Phone"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
                <input
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400"
                  placeholder="Email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                />
                <input
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <input
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
                <input
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400"
                  placeholder="Postal Code"
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                />
              </div>
              <textarea
                rows="3"
                className="bg-white/10 w-full p-3 rounded-lg text-white placeholder-purple-400"
                placeholder="Address line"
                value={address.address}
                onChange={(e) => setAddress({ ...address, address: e.target.value })}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-purple-200">Cart Summary</h2>
              <ul className="space-y-3">
                {cartItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-purple-300">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-fuchsia-300 font-bold">
                      Ksh {item.price * item.quantity}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold text-xl text-purple-100">
                Total: Ksh {totalAmount.toFixed(2)}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-purple-200">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={handlePay}
                  className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-700 to-purple-800 text-white font-semibold hover:scale-105 transition"
                >
                  Pay with M-Pesa (Fake)
                </button>
                <button
                  onClick={handlePay}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-semibold hover:scale-105 transition"
                >
                  Pay with Card (Mock)
                </button>
              </div>
              <p className="text-sm text-purple-300 mt-2">All payments are simulated for demo.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={handlePrev}
              className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800"
            >
              <ArrowLeft size={18} className="inline-block mr-2" />
              Back
            </button>
          ) : (
            <div />
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg bg-fuchsia-700 hover:bg-fuchsia-800"
            >
              Continue
              <ArrowRight size={18} className="inline-block ml-2" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
