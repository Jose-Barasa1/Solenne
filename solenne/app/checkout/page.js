'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  CheckCircle, Truck, CreditCard, UserCircle2, ReceiptText, ArrowLeft, ArrowRight,
  Loader2, FileDown, LocateIcon, ShoppingCart, Plus, Minus, Trash2
} from 'lucide-react';

const steps = [
  { label: 'Cart', icon: ShoppingCart },
  { label: 'Shipping', icon: UserCircle2 },
  { label: 'Payment', icon: CreditCard },
  { label: 'Confirmation', icon: ReceiptText }
];

const paymentOptions = ['M-Pesa', 'Card', 'Bank Transfer', 'PayPal', 'Airtel Money', 'Crypto'];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({ name: '', email: '', phone: '', city: '', country: '', line: '', postal: '' });
  const [payment, setPayment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [trackingStage, setTrackingStage] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('solenne_cart')) || [];
    setCart(stored);
  }, []);

  useEffect(() => {
    if (showReceipt) {
      const interval = setInterval(() => {
        setTrackingStage((prev) => Math.min(prev + 1, 3));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showReceipt]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryStages = [
    { label: 'Order Received', icon: <ReceiptText className="text-fuchsia-400" size={20} /> },
    { label: 'Packing', icon: <CheckCircle className="text-purple-400" size={20} /> },
    { label: 'Out for Delivery', icon: <Truck className="text-blue-400" size={20} /> },
    { label: 'Delivered', icon: <LocateIcon className="text-green-400" size={20} /> }
  ];

  const updateCart = (index, type) => {
    const updated = [...cart];
    if (type === 'inc') updated[index].quantity++;
    if (type === 'dec') updated[index].quantity = Math.max(1, updated[index].quantity - 1);
    localStorage.setItem('solenne_cart', JSON.stringify(updated));
    setCart(updated);
  };

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    localStorage.setItem('solenne_cart', JSON.stringify(updated));
    setCart(updated);
  };

  const next = () => {
    if (step === 1) {
      const required = ['name', 'phone', 'city'];
      const missing = required.filter(f => !address[f]);
      if (missing.length) return toast.error(`Missing: ${missing.join(', ')}`);
    }
    if (step === 2 && !payment) return toast.error('Select a payment method');

    if (step === 2) {
      setProcessing(true);
      toast.loading('Processing your order...');
      setTimeout(() => {
        toast.dismiss();
        setProcessing(false);
        setShowReceipt(true);
        localStorage.removeItem('solenne_cart');
      }, 2500);
      return;
    }
    setStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => setStep(prev => Math.max(prev - 1, 0));

  const downloadInvoice = () => {
    const invoiceText = `Invoice\n----------\nOrder for: ${address.name}\nEmail: ${address.email}\nCity: ${address.city}\nTotal: Ksh ${total.toFixed(2)}\nPaid via: ${payment}\nShipping Estimate: 2-4 Business Days`;
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Solenne_Invoice_${Date.now()}.txt`;
    link.click();
  };

  if (showReceipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0015] via-[#220030] to-[#350040] flex flex-col items-center justify-center text-white px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 border border-fuchsia-500 rounded-2xl p-8 shadow-2xl text-center max-w-xl w-full"
        >
          <ReceiptText size={48} className="mx-auto text-fuchsia-400 mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold mb-2 text-fuchsia-200">Payment Confirmed</h2>
          <p className="text-purple-300">Thank you for shopping with Solenne. Your order has been placed successfully.</p>

          <div className="mt-4 text-left text-sm space-y-1 text-purple-300">
            <p><strong>Payment Method:</strong> {payment}</p>
            <p><strong>Shipping To:</strong> {address.name}, {address.city}, {address.country}</p>
            <p><strong>Delivery Estimate:</strong> <Truck className="inline mr-1" size={14} /> 2-4 Business Days</p>
            <p><strong>Total Paid:</strong> Ksh {total.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-fuchsia-300 mb-2">Delivery Status</h3>
            <div className="flex flex-col gap-2 text-left">
              {deliveryStages.map((stage, i) => (
                <div key={i} className={`flex items-center gap-3 ${i <= trackingStage ? 'opacity-100' : 'opacity-30'} transition-all`}>
                  {stage.icon} <span>{stage.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button onClick={downloadInvoice} className="flex items-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 rounded-xl font-semibold">
              <FileDown size={18} /> Download Invoice
            </button>
            <button onClick={() => router.push('/track/orderId')} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-fuchsia-700 hover:bg-fuchsia-800 font-semibold text-white">
              <LocateIcon size={18} /> Track Order
            </button>
            <button onClick={() => router.push('/')} className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-purple-200">
              Return Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0015] via-[#220030] to-[#350040] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-purple-300 mb-6">Solenne Checkout</h1>

        {/* Progress bar */}
        <div className="flex justify-between items-center text-sm font-medium text-purple-200 mb-4">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`w-10 h-10 mx-auto mb-1 rounded-full flex items-center justify-center ${i <= step ? 'bg-fuchsia-500' : 'bg-purple-700'} transition-all`}>
                <s.icon size={20} />
              </div>
              {s.label}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="cart" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="space-y-4">
              <h2 className="text-xl font-bold text-purple-200">Cart Summary</h2>
              <ul className="space-y-3">
                {cart.map((item, i) => (
                  <li key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-purple-300 flex items-center gap-2">
                        Qty: {item.quantity}
                        <button onClick={() => updateCart(i, 'dec')} className="hover:text-fuchsia-400"><Minus size={14} /></button>
                        <button onClick={() => updateCart(i, 'inc')} className="hover:text-fuchsia-400"><Plus size={14} /></button>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-fuchsia-300 font-bold">Ksh {item.price * item.quantity}</p>
                      <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-500 mt-1"><Trash2 size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold text-xl text-purple-100">Total: Ksh {total.toFixed(2)}</div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="shipping" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="space-y-4">
              <h2 className="text-xl font-bold text-purple-200">Shipping Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400" placeholder="Full Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
                <input className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400" placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                <input className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400" placeholder="Email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
                <input className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                <input className="bg-white/10 p-3 rounded-lg text-white placeholder-purple-400" placeholder="Postal Code" value={address.postal} onChange={(e) => setAddress({ ...address, postal: e.target.value })} />
              </div>
              <textarea rows="3" className="bg-white/10 w-full p-3 rounded-lg text-white placeholder-purple-400" placeholder="Address line" value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="payment" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="space-y-6">
              <h2 className="text-xl font-bold text-purple-200">Choose Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {paymentOptions.map((method) => (
                  <button
                    key={method}
                    onClick={() => setPayment(method)}
                    className={`p-4 rounded-xl font-semibold transition ${
                      payment === method
                        ? 'bg-fuchsia-600 text-white scale-105'
                        : 'bg-white/10 text-purple-200 hover:scale-105 hover:bg-fuchsia-700/60'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button onClick={prev} className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800">
              <ArrowLeft size={18} className="inline-block mr-2" /> Back
            </button>
          ) : <div />}

          <button onClick={next} disabled={processing} className="px-5 py-2 rounded-lg bg-fuchsia-700 hover:bg-fuchsia-800 flex items-center gap-2">
            {processing && <Loader2 className="animate-spin" size={18} />}
            {step < steps.length - 2 ? 'Continue' : 'Confirm Payment'}
            {!processing && <ArrowRight size={18} className="inline-block ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
