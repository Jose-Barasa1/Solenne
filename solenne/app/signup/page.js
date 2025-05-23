'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Github, Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  // Inside your signup submit handler, after a successful signup
localStorage.setItem('userName', formData.name);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    if (formData.password !== formData.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/signup', {  // <-- full URL here
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created! Redirecting...');
        setTimeout(() => router.push('/login'), 1500); // redirect after success
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover z-0"
      >
        <source src="/R2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-center min-h-screen p-4"
      >
        <Card className="relative w-full max-w-xl bg-white/20 border border-white/30 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:shadow-[0_0_30px_#9333ea] before:opacity-30 before:pointer-events-none">
          <CardHeader className="text-center text-white">
            <img src="/s2.jpg" alt="Logo" className="mx-auto mb-4 w-16 h-16" />
            <CardTitle className="text-4xl font-extrabold tracking-tight">Solenne</CardTitle>
            <p className="text-sm text-gray-200 mt-2">Elegance. Simplicity. You.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div whileFocus={{ scale: 1.01 }} className="flex items-center gap-2 bg-white/10 rounded-md p-2 focus-within:ring-2 ring-indigo-400">
                <User className="text-white" />
                <Input placeholder="Name" name="name" onChange={handleChange} required className="bg-transparent text-white placeholder-white focus:outline-none" />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.01 }} className="flex items-center gap-2 bg-white/10 rounded-md p-2 focus-within:ring-2 ring-indigo-400">
                <Mail className="text-white" />
                <Input type="email" placeholder="Email" name="email" onChange={handleChange} required className="bg-transparent text-white placeholder-white focus:outline-none" />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.01 }} className="flex items-center gap-2 bg-white/10 rounded-md p-2 focus-within:ring-2 ring-indigo-400">
                <Lock className="text-white" />
                <Input type="password" placeholder="Password" name="password" onChange={handleChange} required className="bg-transparent text-white placeholder-white focus:outline-none" />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.01 }} className="flex items-center gap-2 bg-white/10 rounded-md p-2 focus-within:ring-2 ring-indigo-400">
                <Lock className="text-white" />
                <Input type="password" placeholder="Confirm Password" name="confirm" onChange={handleChange} required className="bg-transparent text-white placeholder-white focus:outline-none" />
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 rounded-xl shadow-lg"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </motion.div>
            </form>

            {/* ... social buttons and login link ... */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
