'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { PieChart, Pie, Cell, LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';
import { Users, ShoppingBag, DollarSign, Star, Globe, Cube } from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Dynamically import react-globe.gl so it only loads client-side
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const pieData = [
  { name: 'Jewelry', value: 500 },
  { name: 'Art', value: 350 },
  { name: 'Decor', value: 150 },
];

const COLORS = ['#ff4d9d', '#8267ff', '#47caff'];

const lineData = [
  { month: 'Jan', value: 4200 },
  { month: 'Feb', value: 4800 },
  { month: 'Mar', value: 5000 },
  { month: 'Apr', value: 5300 },
  { month: 'May', value: 5900 },
  { month: 'Jun', value: 7200 },
];

export default function UltimateAdminDashboard() {
  const [shopOverview, setShopOverview] = useState('Solenne Mega Store');

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0015] via-[#15002b] to-[#21003f] text-white overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 120 },
            color: { value: ['#ff4d9d', '#8267ff', '#47caff'] },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: { enable: true, speed: 1.2 },
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="px-6 md:px-12 py-10 relative z-10 max-w-7xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 via-purple-400 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-xl">
          {shopOverview} — Galaxy Admin Command
        </h1>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-14">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-pink-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300">Total Sales</p>
                <h2 className="text-4xl font-bold text-pink-400">
                  <CountUp end={250000} prefix="Ksh " separator="," duration={2.5} />
                </h2>
              </div>
              <DollarSign size={42} className="text-pink-400" />
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-pink-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300">Orders</p>
                <h2 className="text-4xl font-bold text-pink-400">
                  <CountUp end={7400} duration={2.5} />
                </h2>
              </div>
              <ShoppingBag size={42} className="text-pink-400" />
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-pink-700">
            <div>
              <p className="text-purple-300">Active Customers</p>
              <h2 className="text-4xl font-bold text-pink-400">
                <CountUp end={3200} duration={2.5} />
              </h2>
            </div>
            <Users size={42} className="text-pink-400" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-pink-700">
            <div>
              <p className="text-purple-300">Shop Rating</p>
              <h2 className="text-4xl font-bold text-pink-400">
                <CountUp end={99} suffix="%" duration={2.5} />
              </h2>
            </div>
            <Star size={42} className="text-pink-400" />
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-pink-700">
            <h3 className="text-2xl font-bold mb-4 text-pink-300">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-pink-700">
            <h3 className="text-2xl font-bold mb-4 text-pink-300">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="value" stroke="#ff4d9d" strokeWidth={3} />
                <Tooltip contentStyle={{ backgroundColor: '#220033', borderColor: '#ff4d9d' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3D Shop Overview */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-pink-700 mb-14">
          <h3 className="text-2xl font-bold mb-6 text-pink-300 flex items-center gap-2">
            <Cube size={28} /> 3D Shop Overview
          </h3>
          <div className="w-full h-[400px] rounded-xl overflow-hidden">
            <Globe
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              backgroundColor="rgba(0,0,0,0)"
            />
          </div>
        </div>

        {/* Visitors Map */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-pink-700 mb-20">
          <h3 className="text-2xl font-bold mb-6 text-pink-300 flex items-center gap-2">
            <Globe size={28} /> Live Visitors Map
          </h3>
          <div className="w-full h-[400px] rounded-xl overflow-hidden">
            <Globe
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              backgroundColor="rgba(0,0,0,0)"
            />
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-fuchsia-700 via-pink-700 to-purple-700 rounded-2xl p-10 text-center shadow-2xl border border-pink-900"
        >
          <h2 className="text-4xl font-extrabold mb-4">Launch Galactic Promotions 🚀</h2>
          <p className="max-w-2xl mx-auto text-lg mb-6 text-purple-100">Dominate the universe with new campaigns, showcase your best collections, and engage globally in seconds!</p>
          <button className="px-8 py-3 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold text-lg transition">
            Start Campaign
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
