'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import Tilt from "react-parallax-tilt";
import {
  Flame,
  Palette,
  Wand,
  Users,
  Gamepad2,
  Clock,
  ScrollText,
  Map,
  Star,
  Flower,
  Leaf,
  Gem
} from "lucide-react";

 export default function Homepage() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (


    
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#1a0020] via-[#350054] to-[#12001e] text-white font-sans">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 140, links: { opacity: 0.5 } } },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { enable: true, color: "#ffffff", distance: 150, opacity: 0.3 },
            move: { enable: true, speed: 1 },
            number: { value: 80 },
            size: { value: 2 },
          },
        }}
        className="absolute w-full h-full z-0"
      />


      {/* Navbar */}
      <nav className="w-full px-8 py-4 flex justify-between items-center backdrop-blur-md bg-white/5 shadow-lg z-50 fixed top-0">
        <div className="text-2xl font-bold text-purple-300 tracking-widest">Solenne</div>
        <div className="flex space-x-6 text-purple-100 text-sm">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/features">Features</Link>
          <Link href="/shop">Shops</Link>
          <Link href="/game">Game</Link>
          <Link href="/signup" className="bg-purple-500 px-4 py-2 rounded-md text-white hover:bg-purple-700 transition">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
        <motion.div
          className="w-full h-48 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={1200}
            className="w-full h-full absolute left-0 top-0"
            particleColor="#b967ff"
          />
          <h1 className="relative text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl">
            Welcome to Solenne: The Crystal Realm
          </h1>
        </motion.div>
        <motion.p
          className="mt-6 text-lg sm:text-xl text-purple-200 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Explore a magical world of glowing handcrafted jewelry, visionary art, and mystic adventure.
        </motion.p>
        <motion.button
          className="mt-10 px-10 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full shadow-2xl hover:scale-110 hover:shadow-pink-700 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter the Portal ✨
        </motion.button>
      </div>

      {/* Featured Products Carousel */}
      <section className="relative z-10 py-32 px-8 bg-gradient-to-b from-[#1a0020] via-[#220033] to-[#12001e]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">Featured Crystal Drops</h2>
          <p className="text-purple-300 mt-4">Unveil our most magical and rare creations</p>
        </div>
        <div className="flex overflow-x-auto gap-8 max-w-6xl mx-auto pb-4 scrollbar-thin scrollbar-thumb-purple-600/70 scrollbar-track-transparent">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="min-w-[300px] bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 flex-shrink-0 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="h-40 w-full bg-purple-900/30 rounded-lg mb-4 flex items-center justify-center">
                <Gem className="text-purple-300 w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Crystal Drop #{i + 1}</h3>
              <p className="text-purple-200 text-sm mt-2">Mystic energy infused piece, crafted for soul resonance.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* World Map Section */}
      <section className="z-10 relative py-32 bg-gradient-to-b from-transparent to-[#1a0020]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">Discover the Realms of Solenne</h2>
          <p className="text-purple-300 mt-4">Each realm reveals its own magic, art, and emotion.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 px-8 max-w-6xl mx-auto">
          {[{
            icon: <Palette className="text-pink-300 w-8 h-8" />, title: "Artistry Realm", desc: "Emotion-rich paintings, digital dreams, and more." },
            { icon: <Flame className="text-red-400 w-8 h-8" />, title: "Jewelry Forge", desc: "Rare gems, handmade pieces, and living crystals." },
            { icon: <Wand className="text-blue-300 w-8 h-8" />, title: "Mystic Shop", desc: "Interactive, enchanted, and immersive buying experiences." },
            { icon: <Gamepad2 className="text-purple-300 w-8 h-8" />, title: "Mini Game", desc: "Unlock Solenne's treasures by completing magical quests." },
            { icon: <Map className="text-green-400 w-8 h-8" />, title: "Hidden Map", desc: "Explore secret passageways and realm connections." },
            { icon: <Flower className="text-pink-400 w-8 h-8" />, title: "Nature’s Bloom", desc: "Discover realms blooming with mystic flora and fauna." },
            { icon: <Star className="text-yellow-300 w-8 h-8" />, title: "Celestial Zone", desc: "Connect with starlit visions and cosmic energy." },
            { icon: <Leaf className="text-lime-400 w-8 h-8" />, title: "Verdant Craft", desc: "Green design, recycled gems, and living designs." },
          ].map((realm, idx) => (
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareColor="#b967ff" key={idx}>
              <motion.div
                className="w-64 bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-xl hover:scale-105 hover:shadow-purple-500/40 transition duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * idx }}
              >
                <div className="mb-4">{realm.icon}</div>
                <h3 className="text-2xl font-bold text-white">{realm.title}</h3>
                <p className="text-purple-200 text-sm mt-2">{realm.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Creator Spotlight */}
      <section className="py-32 bg-[#12001e]">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white">Creators of the Realm</h2>
          <p className="text-purple-300">The visionaries forging Solenne’s essence</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-10 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-xl hover:shadow-purple-600/50 hover:scale-105 transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 * i }}
            >
              <div className="flex items-center gap-4">
                <Users className="text-pink-400" />
                <h4 className="text-xl font-semibold text-white">Mystic Creator #{i}</h4>
              </div>
              <p className="mt-4 text-purple-200 text-sm leading-relaxed">
                "My passion lies in merging energy with form—bringing love, art, and beauty into this realm."
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Signup Section */}
      <section className="py-32 bg-gradient-to-b from-[#12001e] to-[#1a0020] text-center">
        <motion.h2
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Join the Solenne Journey
        </motion.h2>
        <motion.p
          className="text-purple-200 max-w-xl mx-auto mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Select your role, enter the realm, and receive early access to our crystal drops and lore quests.
        </motion.p>
        <motion.button
          className="mt-10 px-10 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full shadow-2xl hover:scale-110 hover:shadow-pink-700 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Your Journey 🌌
        </motion.button>
      </section>

      {/* Footer Realm */}
      <footer className="relative z-10 bg-[#12001e] py-12 text-center text-purple-400">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={20} />
            <span>Realm Time: {currentTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <ScrollText size={20} />
            <span>© 2025 Solenne - All rights enchanted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
