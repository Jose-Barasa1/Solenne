'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell
} from "recharts";
import { motion } from "framer-motion";
import {
  Users, DollarSign, Activity, ShoppingCart, TrendingUp, PieChart as PieIcon, LayoutDashboard, Settings, LogOut
} from "lucide-react";
import CountUp from "react-countup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShopDashboard() {
  const router = useRouter();
  const { id } = router.query;
  const [shopData, setShopData] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/shops/${id}/dashboard`) // update if your Flask URL is different
        .then(res => res.json())
        .then(data => {
          setShopData(data);
          setAnimated(true);
        })
        .catch(err => console.error("Error loading dashboard:", err));
    }
  }, [id]);

  if (!shopData) return <div className="p-6">Loading shop dashboard...</div>;

  const metrics = [
    { title: "Revenue", icon: <DollarSign className="text-emerald-600" />, value: shopData.revenue, change: "+20%", fill: "#10b981", score: 85 },
    { title: "Users", icon: <Users className="text-sky-600" />, value: shopData.users, change: "+33%", fill: "#3b82f6", score: 76 },
    { title: "Sessions", icon: <Activity className="text-violet-600" />, value: shopData.sessions, change: "+8%", fill: "#8b5cf6", score: 67 },
    { title: "Orders", icon: <ShoppingCart className="text-rose-600" />, value: shopData.orders, change: "+12%", fill: "#ec4899", score: 72 },
    { title: "Conversions", icon: <TrendingUp className="text-amber-500" />, value: shopData.conversions, change: "+5.5%", fill: "#facc15", score: 90 }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-white text-gray-800 border-r border-gray-200 p-6 hidden lg:flex flex-col gap-6 shadow-md">
        <div className="text-3xl font-bold text-blue-600 mb-6">Solenne</div>
        <nav className="flex flex-col gap-4 text-base">
          <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
            <LayoutDashboard /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
            <Users /> Users
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
            <Settings /> Settings
          </a>
          <a href="#" className="flex items-center gap-3 text-red-600 hover:text-red-800 mt-auto">
            <LogOut /> Logout
          </a>
        </nav>
      </aside>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 bg-gray-50 text-gray-800 overflow-y-auto p-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {metrics.map((metric, idx) => (
          <Card key={idx} className="shadow-sm bg-white rounded-xl border p-4 flex items-center justify-between">
            <div>
              <CardHeader className="p-0 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  {metric.icon} {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold">
                  {animated && (
                    <CountUp
                      end={metric.value}
                      duration={1.5}
                      separator="," 
                      decimals={typeof metric.value === "number" && !Number.isInteger(metric.value) ? 2 : 0}
                      prefix={metric.title === "Revenue" ? "$" : ""}
                    />
                  )}
                </h2>
                <p className="text-sm text-gray-500">{metric.change} month over month</p>
              </CardContent>
            </div>
            <RadialBarChart
              width={80}
              height={80}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={10}
              data={[{ name: metric.title, value: metric.score, fill: metric.fill }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={50} />
            </RadialBarChart>
          </Card>
        ))}

        <Card className="col-span-full shadow-sm bg-white rounded-xl border">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={shopData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full shadow-sm bg-white rounded-xl border">
          <CardHeader>
            <CardTitle>Monthly Sessions</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shopData.sessionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="sessions" fill="#10b981" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full shadow-sm bg-white rounded-xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="text-sky-500" /> User Roles Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shopData.userTypes}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {shopData.userTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
}
