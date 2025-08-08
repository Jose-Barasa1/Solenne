'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { getOrderLocation } from '@/lib/api';
import { Loader2, PhoneCall, Clock10 } from 'lucide-react';
import socketIO from 'socket.io-client';

export default function TrackMap3D({ orderId }) {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [eta, setEta] = useState(null);
  const [orderStatus, setOrderStatus] = useState('pending');

  const mapRef = useRef();
  const socket = useRef();

  const fetchInitial = async () => {
    try {
      const data = await getOrderLocation(orderId);
      setLocation(data.driver_location);
      setDestination(data.destination);
      setEta(data.eta);
      setOrderStatus(data.status);
    } catch (err) {
      console.error("Initial fetch failed", err);
    }
  };

  useEffect(() => {
    fetchInitial();

    socket.current = socketIO('http://localhost:5000');
    socket.current.on('location_update', (data) => {
      if (data.order_id === orderId) {
        setLocation({ lat: data.latitude, lng: data.longitude });
      }
    });

    return () => socket.current.disconnect();
  }, [orderId]);

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6 text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Loading 3D map...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-purple-600/30 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Map
        mapLib={maplibregl}
        ref={mapRef}
        initialViewState={{
          latitude: location.lat,
          longitude: location.lng,
          zoom: 14,
          pitch: 60,
          bearing: -30,
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        style={{ width: '100%', height: '600px' }}
      >
        <NavigationControl position="top-left" />

        {/* Driver marker */}
        <Marker latitude={location.lat} longitude={location.lng}>
          <img src="/driver-car.gif" alt="Driver" className="w-10 h-10 animate-pulse" />
        </Marker>

        {/* Destination marker */}
        {destination && (
          <Marker latitude={destination.lat} longitude={destination.lng}>
            <img src="/destination-pin.png" alt="Destination" className="w-8 h-8 drop-shadow-lg" />
          </Marker>
        )}
      </Map>

      {/* Floating control panel */}
      <div className="absolute top-4 left-4 backdrop-blur-md bg-black/60 rounded-xl p-4 text-white space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-sm">
          <Clock10 className="w-4 h-4" />
          ETA: <span className="text-purple-400 font-semibold">{eta ?? '?'} min</span>
        </div>
        <div className="text-sm">
          Status: <span className="font-semibold text-green-300">{orderStatus}</span>
        </div>
        <button className="mt-2 bg-purple-600 hover:bg-purple-700 text-sm px-3 py-2 rounded-xl flex items-center gap-2">
          <PhoneCall className="w-4 h-4" /> Call Driver
        </button>
      </div>

      {/* Progress animation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] text-xs text-white">
        <div className="flex justify-between mb-1">
          <span className={orderStatus !== 'pending' ? 'text-green-400' : ''}>Processing</span>
          <span className={orderStatus === 'en_route' ? 'text-yellow-400' : ''}>En Route</span>
          <span className={orderStatus === 'delivered' ? 'text-purple-400' : ''}>Delivered</span>
        </div>
        <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-2 ${
              orderStatus === 'delivered' ? 'bg-purple-500 w-full' :
              orderStatus === 'en_route' ? 'bg-yellow-400 w-2/3' :
              'bg-green-400 w-1/3'
            }`}
            layout
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
