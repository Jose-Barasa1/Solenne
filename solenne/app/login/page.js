"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const typingSoundsUrl =
  "https://actions.google.com/sounds/v1/foley/typewriter_key_press.ogg";
const clickSoundUrl = "https://actions.google.com/sounds/v1/ui/click.ogg";
const backgroundMusicUrl =
  "https://cdn.pixabay.com/download/audio/2022/03/22/audio_3c94bc14bb.mp3?filename=chill-hip-hop-rap-11535.mp3";

export default function CombinedLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [message, setMessage] = useState(null); // { type: "success"|"error", text: string }

  const audioRef = useRef(null);
  const typingAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);
  

  useEffect(() => {
    if (!userName) return;
  
    const phrase = `${userName} is signing in...`;
    let idx = 0;
  
    setTypingText("");
    setIsTyping(true);
  
    const intervalId = setInterval(() => {
      if (idx < phrase.length) {
        setTypingText((prev) => prev + phrase[idx]);
        idx++;
        if (typingAudioRef.current && !isMuted) {
          typingAudioRef.current.currentTime = 0;
          typingAudioRef.current.play();
        }
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 120);
  
    return () => clearInterval(intervalId);
  }, [userName, isMuted]);
  


  const onSubmit = async (values) => {
    if (clickAudioRef.current && !isMuted) {
      clickAudioRef.current.play();
    }

    setMessage(null); // Clear previous message

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();

      // Save token/session here if needed
      // For example: localStorage.setItem("token", data.token);

      setMessage({ type: "success", text: `Welcome back, ${values.email}! Redirecting...` });

      // Redirect after a small delay so user sees the message
      setTimeout(() => {
        router.push("/onboarding");
      }, 1800);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>\-_=+]/.test(password)) strength += 1;

    return strength;
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMute = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMute;
        if (!newMute) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
      }
      return newMute;
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isMuted]);

  const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    return (
      <>
        <div>{time.toLocaleDateString()}</div>
        <div>{time.toLocaleTimeString()}</div>
      </>
    );
  };
  
  const getMotivationalQuote = () => {
    const quotes = [
      "Music is the soundtrack of your life.",
      "Keep pushing forward, greatness awaits!",
      "Let the beats move your soul.",
      "Creativity takes courage.",
      "Stay focused, stay inspired.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const handleTypingSound = () => {
    if (typingAudioRef.current && !isMuted) {
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current.play();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex">
      <div className="relative flex-1 flex flex-col justify-center items-center p-8 overflow-hidden bg-gradient-to-tr from-purple-900 via-indigo-900 to-black rounded-l-3xl shadow-2xl">
  <Particles
    id="tsparticles"
    init={particlesInit}
    options={{
      background: { color: "transparent" },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
      },
      particles: {
        color: { value: "#a78bfa" },
        links: {
          color: "#a78bfa",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        collisions: { enable: true },
        move: { enable: true, speed: 1.5, outModes: { default: "bounce" } },
        number: { density: { enable: true, area: 900 }, value: 70 },
        opacity: { value: 0.4 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 4 } },
      },
      detectRetina: true,
    }}
    className="absolute inset-0 z-0"
  />

  <div className="relative z-10 flex flex-col items-center gap-6 p-6 bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-purple-700 max-w-sm w-full select-none">
    {/* Music Player Info */}
    <div className="flex items-center gap-4 w-full">
      <img
        src="https://picsum.photos/seed/music/64/64"
        alt="Album Art"
        className="w-16 h-16 rounded-xl shadow-lg object-cover"
        draggable={false}
      />
      <div className="flex flex-col flex-1">
        <h3 className="text-white text-xl font-semibold truncate">Electric Dreams</h3>
        <p className="text-indigo-300 text-sm truncate">Synthwave Artist</p>
        <div className="mt-2 w-full h-2 rounded-full bg-indigo-700 overflow-hidden shadow-inner">
          <div className="h-full bg-purple-400 animate-[progress_10s_linear_infinite]" />
        </div>
      </div>
    </div>

    {/* Music Controls */}
    <button
      onClick={toggleMute}
      className="flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition select-none"
      aria-label={isMuted ? "Unmute music" : "Mute music"}
      type="button"
    >
      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      <span className="text-lg font-semibold">{isMuted ? "Unmute" : "Mute"}</span>
    </button>

    {/* Date & Time */}
    <div className="mt-6 p-3 rounded-lg bg-indigo-900/40 border border-indigo-700 shadow-inner font-mono text-center text-xl text-white w-full select-none">
      <LiveClock />
    </div>

    {/* Motivational Quote */}
    <blockquote className="mt-6 italic text-indigo-300 text-center px-3 select-text">
      {getMotivationalQuote()}
    </blockquote>

    {/* Stats Cards */}
    <div className="grid grid-cols-2 gap-4 w-full mt-6">
      {[
        { title: "Active Users", value: "1,254", icon: "👥" },
        { title: "Songs Played", value: "12,872", icon: "🎵" },
        { title: "Hours Listened", value: "534h", icon: "⏰" },
        { title: "Playlists Created", value: "318", icon: "📂" },
      ].map(({ title, value, icon }) => (
        <div
          key={title}
          className="bg-purple-800/70 rounded-xl p-4 flex items-center gap-3 shadow-md border border-purple-700 hover:scale-105 transition-transform cursor-default select-none"
        >
          <span className="text-3xl">{icon}</span>
          <div>
            <p className="text-sm text-indigo-300">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
        </div>
      ))}
    </div>

    <audio ref={audioRef} src={backgroundMusicUrl} preload="auto" loop />
  </div>
</div>


      {/* Right side: Form */}
      <div className="relative flex-1 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-black/30 border border-gray-700/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl space-y-8"
        >
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-1 tracking-wide">Welcome Back</h1>
            <p className="text-indigo-300 italic min-h-[1.5rem] select-none">
              {typingText}
              <span className="blinking-cursor">|</span>
            </p>
            <p className="text-gray-400 mt-2">
              Sign in to access your dashboard, orders, and personalized content.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-1 text-gray-300 font-semibold">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="email"
                  {...form.register("email")}
                  placeholder="you@example.com"
                  onChange={(e) => {
                    form.setValue("email", e.target.value);
                    handleTypingSound();
                  }}
                  className="pl-10 bg-white/10 border border-gray-500 focus:border-indigo-500 text-white transition"
                  autoComplete="email"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-400 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-gray-300 font-semibold">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password", {
                    onChange: (e) => {
                      form.setValue("password", e.target.value);
                      setPasswordStrength(evaluateStrength(e.target.value));
                      handleTypingSound();
                    },
                  })}
                  placeholder="Enter your password"
                  className="pl-10 bg-white/10 border border-gray-500 focus:border-indigo-500 text-white transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-400 mt-1">{form.formState.errors.password.message}</p>
              )}

              <div className="mt-2 h-2 w-full rounded-full bg-gray-700 overflow-hidden">
                <div
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  className={`h-full transition-all duration-300 ${
                    passwordStrength <= 1
                      ? "bg-red-500"
                      : passwordStrength === 2
                      ? "bg-yellow-400"
                      : passwordStrength === 3
                      ? "bg-indigo-400"
                      : "bg-green-400"
                  }`}
                />
              </div>
              <p className="text-sm mt-1 text-gray-300 select-none">
                Password strength:{" "}
                {["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][passwordStrength]}
              </p>
            </div>

           {/* Remember Me toggle */}
<div className="flex items-center space-x-3 select-none">
  <label htmlFor="rememberMe" className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id="rememberMe"
      {...form.register("rememberMe")}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-300 relative">
      <span
        className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5"
      />
    </div>
    <span className="ml-3 text-gray-300 font-medium hover:text-indigo-400">
      Remember me
    </span>
  </label>
</div>


            <Button
              type="submit"
              className="w-full py-3 font-semibold text-lg bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-gray-400 text-sm select-none">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-indigo-400 hover:underline">
              Sign up
            </a>
          </div>

          {/* Success/Error message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-6 text-center text-sm font-semibold ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                } select-none`}
                role="alert"
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <audio ref={typingAudioRef} src={typingSoundsUrl} preload="auto" />
          <audio ref={clickAudioRef} src={clickSoundUrl} preload="auto" />
        </motion.div>
      </div>
    </div>
  );
}
