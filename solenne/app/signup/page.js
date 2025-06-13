'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Github, Facebook, Mail, Lock, User, LoaderCircle, Info } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

function getPasswordStrength(password) {
  let score = 0;
  if (password.length > 6) score++;
  if (password.match(/[A-Z]/)) score++;
  if (password.match(/[0-9]/)) score++;
  if (password.match(/[^a-zA-Z0-9]/)) score++;
  if (password.length > 10) score++;
  return score;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [step, setStep] = useState(0);
  const steps = ['Details', 'Secure', 'Finish'];
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetch('http://localhost:5000/api/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
        }),
      }).finally(() => router.push('/login'));
    }
  }, [session]);

  useEffect(() => {
    setPasswordScore(getPasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
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
        localStorage.setItem('userName', formData.name);
        toast.success('Account created! Redirecting...');
        setStep(2);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (score) => {
    const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-500'];
    return colors[score - 1] || 'bg-gray-500';
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      <video autoPlay loop muted className="absolute w-full h-full object-cover z-0">
        <source src="/R2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70 z-10 backdrop-blur-[2px]" />

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
          className="w-full max-w-[1100px]"
        >
          <Card className="relative w-full bg-white/10 border border-purple-300/20 backdrop-blur-2xl shadow-[0_8px_80px_rgba(147,51,234,0.5)] rounded-3xl overflow-hidden px-10 py-8 animate-shimmer">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-br from-purple-500/10 to-transparent animate-pulse blur-2xl" />

            <CardHeader className="text-center text-white space-y-2">
              <img src="/s2.jpg" alt="Logo" className="mx-auto mb-2 w-20 h-20 rounded-full shadow-[0_0_25px_#9333ea]" />
              <CardTitle className="text-5xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 text-transparent bg-clip-text">
                Solenne
              </CardTitle>
              <p className="text-sm text-gray-200 tracking-wide">Elegance. Simplicity. You.</p>
            </CardHeader>

            <div className="relative w-full mt-4 mb-6">
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/30 via-pink-500/10 to-transparent animate-pulse blur-xl" />
              </div>

              <div className="relative z-10 w-full h-4 bg-white/10 rounded-full overflow-hidden shadow-inner shadow-purple-500/30 border border-purple-400/20">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-[0_0_20px_#d946ef] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-full w-2 bg-white/40 blur-md opacity-80 rounded-full"
                  animate={{
                    x: `${((step + 1) / steps.length) * 100}%`,
                    transition: { duration: 0.7, ease: 'easeInOut' },
                  }}
                />
              </div>

              <div className="relative z-20 flex justify-between mt-3 px-1 text-xs font-semibold tracking-wider text-white">
                {steps.map((label, index) => (
                  <div key={index} className="relative flex flex-col items-center w-1/3">
                    <div
                      className={`w-5 h-5 mb-1 rounded-full border-2 ${
                        index <= step ? 'bg-purple-500 border-purple-300 shadow-[0_0_10px_#9333ea]' : 'bg-white/20 border-white/30'
                      }`}
                    />
                    <span className={`${index === step ? 'text-purple-300' : 'text-white/60'} transition-all duration-300`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-white/40" size={16} />
                    <Input
                      name="name"
                      placeholder="Name"
                      onChange={handleChange}
                      required
                      className="pl-10 bg-white/10 text-white placeholder-white rounded-md border border-white/20"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-white/40" size={16} />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      onChange={handleChange}
                      required
                      className="pl-10 bg-white/10 text-white placeholder-white rounded-md border border-white/20"
                    />
                  </div>

                  <div className="relative col-span-1">
                    <Lock className="absolute left-3 top-3 text-white/40" size={16} />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      onChange={handleChange}
                      required
                      className="pl-10 bg-white/10 text-white placeholder-white rounded-md border border-white/20"
                    />
                    <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(passwordScore)}`}
                        style={{ width: `${(passwordScore / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/60 mt-1 flex items-center gap-1">
                      <Info size={14} className="inline" /> Use uppercase, numbers & symbols for stronger passwords.
                    </p>
                  </div>

                  <div className="relative col-span-1">
                    <Lock className="absolute left-3 top-3 text-white/40" size={16} />
                    <Input
                      name="confirm"
                      type="password"
                      placeholder="Confirm Password"
                      onChange={handleChange}
                      required
                      className="pl-10 bg-white/10 text-white placeholder-white rounded-md border border-white/20"
                    />
                  </div>
                </div>

                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 rounded-xl shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoaderCircle className="animate-spin" size={18} />
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 flex flex-col items-center gap-4">
                <p className="text-sm text-gray-300">or sign up with</p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => signIn('google')}
                    className="flex items-center gap-2 w-full sm:w-auto text-white hover:bg-white/10"
                  >
                    <FcGoogle size={20} /> Google
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => signIn('facebook')}
                    className="flex items-center gap-2 w-full sm:w-auto text-white hover:bg-white/10"
                  >
                    <Facebook size={20} /> Facebook
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => signIn('github')}
                    className="flex items-center gap-2 w-full sm:w-auto text-white hover:bg-white/10"
                  >
                    <Github size={20} /> GitHub
                  </Button>
                </div>

                <p className="text-sm text-gray-300">
                  Already have an account?{' '}
                  <a href="/login" className="underline text-purple-300 hover:text-purple-400">
                    Log in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
