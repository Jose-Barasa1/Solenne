'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail');
      const res = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Verification email sent!');
        setResent(true);
      } else {
        toast.error(data.message || 'Could not resend email');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900 z-0" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex items-center justify-center min-h-screen p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <Card className="relative w-full bg-white/10 border border-purple-300/20 backdrop-blur-2xl shadow-[0_8px_80px_rgba(147,51,234,0.5)] rounded-3xl overflow-hidden px-8 py-10 animate-shimmer">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-br from-purple-500/10 to-transparent animate-pulse blur-2xl" />
            <CardHeader className="text-center text-white space-y-2">
              <img src="/s2.jpg" alt="Logo" className="mx-auto mb-2 w-20 h-20 rounded-full shadow-[0_0_25px_#9333ea]" />
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 text-transparent bg-clip-text">
                Verify Your Email
              </CardTitle>
              <p className="text-sm text-gray-300 tracking-wide px-6">
                We've sent a verification link to your email. Please check your inbox.
              </p>
            </CardHeader>
            <CardContent className="mt-8">
              <Button
                onClick={handleResend}
                disabled={loading || resent}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} /> Sending...
                  </span>
                ) : (
                  resent ? 'Email Sent' : 'Resend Verification Email'
                )}
              </Button>
              <p className="mt-4 text-center text-sm text-white/70">
                Didn’t receive an email? Be sure to check your spam folder.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
