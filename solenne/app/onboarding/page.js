'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ app router redirect
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Sparkles,
  Paintbrush,
  Volume2,
  VolumeX,
  Star,
  Info,
  UserCircle2,
  LogOut,
  User,
  X,
  Menu,
  Repeat,
} from "lucide-react";
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();

  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [muted, setMuted] = useState(true);
  const [hoveredShop, setHoveredShop] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch shops from backend API on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/shops')
      .then(res => res.json())
      .then(data => {
        console.log('Shops fetched:', data);
        setShops(data);
      })
      .catch(console.error);
  }, []);
  
  useEffect(() => {
    // Subtle sparkling stars background
    const stars = document.createElement("div");
    stars.className =
      "pointer-events-none fixed inset-0 z-0 bg-[url('/sparkle.svg')] bg-cover opacity-10 animate-pulse";
    document.body.appendChild(stars);
    return () => document.body.removeChild(stars);
  }, []);

  useEffect(() => {
    // Trail effect script (optional)
    const script = document.createElement("script");
    script.src = "/trail.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Redirect to shop gallery page on button click
  function enterGallery() {
    if (selectedShop) {
      toast.success(`Entering ${selectedShop.name}'s gallery...`);
      router.push(`/shops/${selectedShop.id}`);
    } else {
      toast.error("Please select a shop to enter.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f001a] via-[#1a002b] to-[#2b0044] text-white overflow-hidden relative font-sans">
     {/* Sidebar */}
     <motion.aside
        initial={{ x: sidebarOpen ? 0 : -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-purple-900/90 to-fuchsia-900/80 backdrop-blur-lg border-r border-fuchsia-700 shadow-xl z-40 flex flex-col"
      >
        <div className="px-6 py-5 flex justify-between items-center border-b border-fuchsia-700">
          <h2 className="text-2xl font-bold text-fuchsia-300 tracking-wide select-none">
            Solenne Hub
          </h2>
          <button
            aria-label="Toggle Sidebar"
            onClick={() => setSidebarOpen(false)}
            className="text-fuchsia-400 hover:text-fuchsia-200 transition-colors"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 px-6 py-6 overflow-y-auto space-y-6">
          {/* Section 1 */}
          <div>
            <h3 className="uppercase text-xs font-semibold text-purple-400 mb-3 tracking-widest">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 cursor-pointer"
                >
                  <Sparkles size={20} className="text-fuchsia-400" />
                  <span>Jewelry Collections</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 cursor-pointer"
                >
                  <Paintbrush size={20} className="text-indigo-400" />
                  <span>Art Galleries</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 cursor-pointer"
                >
                  <Star size={20} className="text-yellow-400" />
                  <span>Featured Artists</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="uppercase text-xs font-semibold text-purple-400 mb-3 tracking-widest">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 cursor-pointer"
                >
                  <Info size={20} className="text-cyan-400" />
                  <span>How it Works</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 cursor-pointer"
                >
                  <User size={20} className="text-green-400" />
                  <span>Community</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 cursor-pointer"
                >
                  <Paintbrush size={20} className="text-pink-400" />
                  <span>Art Tutorials</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="uppercase text-xs font-semibold text-purple-400 mb-3 tracking-widest">
              Settings
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 w-full cursor-pointer"
                >
                  <UserCircle2 size={20} className="text-fuchsia-500" />
                  <span>View Profile</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Switch account clicked")}
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 w-full cursor-pointer"
                >
                  <Repeat size={20} className="text-indigo-400" />
                  <span>Switch Account</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Logout clicked")}
                  className="flex items-center gap-3 text-purple-200 hover:text-fuchsia-300 transition-colors rounded-md px-3 py-2 w-full cursor-pointer"
                >
                  <LogOut size={20} className="text-red-500" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="px-6 py-4 border-t border-fuchsia-700 flex items-center gap-3">
          <img
            src="/user-profile.jpg"
            alt="User profile"
            className="w-12 h-12 rounded-full ring-2 ring-fuchsia-500 shadow-md"
          />
          <div>
            <p className="text-white font-semibold">Jose Solenne</p>
            <p className="text-purple-300 text-xs">Art & Jewelry Enthusiast</p>
          </div>
        </div>
      </motion.aside>

      {/* Sidebar toggle for mobile/sm screens */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-3 rounded-full shadow-lg shadow-fuchsia-700/50 transition-all duration-300"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 ml-0 sm:ml-72 p-8 relative z-10 overflow-y-auto min-h-screen">
        {/* Music Control */}
        <div className="fixed top-6 right-6 z-40 bg-purple-800/60 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-purple-600 flex items-center gap-4 text-white select-none">
          <div className="flex items-center gap-3">
            <Star className="w-7 h-7 text-fuchsia-400 animate-pulse" />
            <p className="font-semibold tracking-wide">Jose's Music</p>
          </div>
          <button
            onClick={() => setMuted(!muted)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/50"
            aria-label="Toggle Mute"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span className="select-none">{muted ? "Unmute" : "Mute"}</span>
          </button>
          <audio autoPlay loop muted={muted} className="hidden">
            <source src="/ambient.mp3" type="audio/mpeg" />
          </audio>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-14"
        >
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-300 to-fuchsia-500 bg-clip-text text-transparent animate-text-glow">
            Welcome to <span className="text-fuchsia-300">Solenne</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl italic text-purple-200 max-w-2xl mx-auto drop-shadow-lg">
            Discover rare artisan jewelry and mystical artwork crafted by visionaries.
          </p>
          <p className="mt-3 text-purple-400 italic text-sm animate-pulse tracking-wide">
            Hover over a shop to learn more. Click to explore its gallery!
          </p>
        </motion.div>

        {/* Shop Cards Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-7xl mx-auto"
        >
          {shops.map((shop) => (
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.45}
              scale={1.03}
              key={shop.id}
              onEnter={() => setHoveredShop(shop)}
              onLeave={() => setHoveredShop(null)}
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative rounded-3xl border border-purple-600/40 p-5 bg-white/5 backdrop-blur-xl shadow-[0_12px_50px_rgba(255,0,255,0.2)] cursor-pointer transition-all duration-300 hover:shadow-fuchsia-500/60 ${
                  selectedShop?.id === shop.id ? "ring-4 ring-fuchsia-400 animate-pulse-slow" : ""
                }`}
                onClick={() => setSelectedShop(shop)}
                aria-label={`Select ${shop.name} shop`}
              >
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-fuchsia-500/50 to-purple-700/20 blur-2xl opacity-0 group-hover:opacity-80 transition-opacity pointer-events-none" />
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="rounded-2xl w-full h-36 object-cover mb-5 shadow-lg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex justify-center mb-3 z-10 relative">
                  {shop.type === "jewelry" ? (
                    <Sparkles className="w-10 h-10 text-fuchsia-400 drop-shadow-[0_0_6px_rgba(255,0,255,0.8)] animate-pulse" />
                  ) : (
                    <Paintbrush className="w-10 h-10 text-indigo-400 drop-shadow-[0_0_8px_rgba(75,0,130,0.9)] animate-pulse" />
                  )}
                </div>
                <h2 className="text-2xl font-extrabold text-white drop-shadow-lg relative tracking-wide">
                  {shop.name}
                </h2>
                <p className="capitalize text-purple-300 tracking-wide font-medium text-sm">
                  {shop.type}
                </p>
                {hoveredShop?.id === shop.id && (
                  <p className="text-xs text-purple-400 mt-2 font-semibold select-none">
                    Click to explore the {shop.type} collection.
                  </p>
                )}
              </motion.div>
            </Tilt>
          ))}
        </motion.div>

        {/* Selected Shop Bottom Bar */}
        <AnimatePresence>
          {selectedShop && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#170022cc] backdrop-blur-md p-6 border-t border-purple-700 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto"
            >
              <div>
                <p className="text-xl text-purple-100">
                  You selected:{" "}
                  <span className="font-bold text-fuchsia-400">{selectedShop.name}</span>
                </p>
                <p className="text-sm text-purple-300 tracking-wide capitalize">
                  Type: {selectedShop.type}
                </p>
              </div>
              <button
                onClick={enterGallery}
                className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:shadow-fuchsia-500/60 transition-all duration-300 animate-glow"
                aria-label={`Enter ${selectedShop.name} gallery`}
              >
                Enter the Gallery
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
{/* Profile Modal */}
<AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black bg-opacity-70 flex items-center justify-center p-5"
            aria-modal="true"
            role="dialog"
            aria-labelledby="profile-modal-title"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-gradient-to-tr from-purple-900 to-fuchsia-900 rounded-3xl shadow-xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute top-4 right-4 text-purple-300 hover:text-fuchsia-400 transition-colors"
                aria-label="Close Profile"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col items-center gap-4 text-center text-white">
                <img
                  src="/user-profile.jpg"
                  alt="User profile"
                  className="w-24 h-24 rounded-full ring-4 ring-fuchsia-500 shadow-lg"
                  loading="lazy"
                />
                <h3
                  id="profile-modal-title"
                  className="text-3xl font-extrabold tracking-wide"
                >
                  Jose Solenne
                </h3>
                <p className="text-purple-300 text-sm italic">
                  Art & Jewelry Enthusiast
                </p>
                <p className="mt-4 text-purple-200 max-w-sm leading-relaxed">
                  Welcome to your profile hub! Here you can update your preferences,
                  explore new collections, and stay connected to the Solenne community.
                </p>
                <button
                  onClick={() => alert("Edit Profile clicked")}
                  className="mt-6 px-8 py-3 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 font-semibold shadow-lg transition-all duration-300"
                >
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
     
    
  );
}
