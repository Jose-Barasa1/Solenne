"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Info,
  Bot,
  Github,
  CircleUserRound,
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
});

// Sound & music URLs (royalty-free)
const typingSoundsUrl =
  "https://actions.google.com/sounds/v1/foley/typewriter_key_press.ogg";
const clickSoundUrl =
  "https://actions.google.com/sounds/v1/ui/click.ogg";
const backgroundMusicUrl =
  "https://cdn.pixabay.com/download/audio/2022/03/22/audio_3c94bc14bb.mp3?filename=chill-hip-hop-rap-11535.mp3";

export default function CombinedLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const audioRef = useRef(null);
  const typingAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const phrase = "Someone’s signing in...";
    let idx = 0;
    let intervalId;

    setTypingText("");
    setIsTyping(true);

    intervalId = setInterval(() => {
      setTypingText((prev) => prev + phrase[idx]);
      idx++;
      if (typingAudioRef.current && !isMuted) {
        typingAudioRef.current.currentTime = 0;
        typingAudioRef.current.play();
      }
      if (idx === phrase.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 120);

    return () => clearInterval(intervalId);
  }, [isMuted]);

  const onSubmit = async (values) => {
    if (clickAudioRef.current && !isMuted) {
      clickAudioRef.current.play();
    }
    alert(`Logged in as ${values.email}`);
  };

  const evaluateStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const particlesOptions = {
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
  };
  
  const particlesInit = async (main) => {
    await loadFull(main);
  };
  


  const handleTypingSound = () => {
    if (typingAudioRef.current && !isMuted) {
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current.play();
    }
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex">
      {/* Left side: Particles + Music Controls */}
      <div className="relative flex-1 flex flex-col justify-center items-center p-6 overflow-hidden">
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

        <div className="relative z-10 flex flex-col items-center gap-4 p-4 bg-black/40 rounded-2xl shadow-lg select-none">
          <p className="text-lg font-semibold">Jose's Music</p>
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-full shadow-md"
            aria-label={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <audio ref={audioRef} src={backgroundMusicUrl} preload="auto" />
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
            <h1 className="text-5xl font-extrabold mb-1">Welcome Back</h1>
            <p className="text-indigo-300 italic min-h-[1.5rem]">
              {typingText}
              <span className="blinking-cursor">|</span>
            </p>
            <p className="text-gray-400 mt-2">
              Sign in to access your dashboard, orders, and personalized content.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-1 text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="email"
                  {...form.register("email")}
                  placeholder="you@example.com"
                  onChange={(e) => {
                    form.setValue("email", e.target.value);
                    handleTypingSound();
                  }}
                  className="pl-10 bg-white/10 border border-gray-500 focus:border-indigo-500 text-white"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-400 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="••••••••"
                  onChange={(e) => {
                    form.setValue("password", e.target.value);
                    setPasswordStrength(evaluateStrength(e.target.value));
                    handleTypingSound();
                  }}
                  className="pl-10 pr-10 bg-white/10 border border-gray-500 focus:border-indigo-500 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2">
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${
                      passwordStrength === 0
                        ? "w-0"
                        : passwordStrength === 1
                        ? "w-1/4 bg-red-500"
                        : passwordStrength === 2
                        ? "w-1/2 bg-yellow-500"
                        : passwordStrength === 3
                        ? "w-3/4 bg-blue-500"
                        : "w-full bg-green-500"
                    }`}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-400">
                  {["", "Weak", "Fair", "Good", "Strong"][passwordStrength]}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 font-semibold py-2 rounded-xl"
              disabled={form.formState.isSubmitting}
              onClick={() => {
                if (clickAudioRef.current && !isMuted) {
                  clickAudioRef.current.play();
                }
              }}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="flex items-center justify-between mt-6 text-sm text-gray-400">
              <span>Don’t have an account?</span>
              <a href="/register" className="text-indigo-400 hover:underline">
                Sign up here
              </a>
            </div>

            {/* Social Login Options */}
            <div className="mt-8 space-y-3">
              <p className="text-center text-gray-500">Or login with</p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-gray-500 rounded-lg hover:bg-white/20"
                  onClick={() => clickAudioRef.current?.play()}
                >
                  <Github size={16} /> GitHub
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-gray-500 rounded-lg hover:bg-white/20"
                  onClick={() => clickAudioRef.current?.play()}
                >
                  <CircleUserRound size={16} /> Google
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-sm text-gray-400">
              <Info size={16} />
              <p>
                Passwords are encrypted. Never share your credentials. Chat with support
                using the purple icon bottom right.
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-purple-700 hover:bg-purple-800 p-4 rounded-full shadow-xl transition"
        title="Chat with support"
        aria-label="Chat with support"
      >
        <Bot size={22} />
      </button>

      {/* Sound Effects Audio */}
      <audio ref={typingAudioRef} src={typingSoundsUrl} preload="auto" />
      <audio ref={clickAudioRef} src={clickSoundUrl} preload="auto" />

      <style>{`
        .blinking-cursor {
          animation: blink 1s steps(2, start) infinite;
          color: #a78bfa;
        }
        @keyframes blink {
          0%, 50% { opacity: 1 }
          50.01%, 100% { opacity
: 0 }
}
`}</style>
</div>
);
}