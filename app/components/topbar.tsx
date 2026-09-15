// components/TopBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

// Define API response interface for TypeScript
interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    state?: string;
  };
}

export default function TopBar() {
  const [location, setLocation] = useState<string>('Location Loading...');
  const [language, setLanguage] = useState<'KH' | 'ENG'>('KH');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data: NominatimResponse = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.state ||
              'ភ្នំពេញ';
            setLocation(city);
          } catch {
            setLocation('ភ្នំពេញ, កម្ពុជា');
          }
        },
        () => setLocation('Location cannot access')
      );
    } else {
      setLocation('មិនគាំទ្រ Geolocation');
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'KH' ? 'ENG' : 'KH'));
  };

  return (
    <header className="w-full bg-emerald-600 text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex justify-between items-center text-xs sm:text-sm">
        {/* Location on Left */}
        <div className="flex items-center space-x-2 font-medium">
          <span className="flex items-center gap-1 text-emerald-100">
            <MapPin size={14} className="text-amber-300" />
            <span>{location}</span>
          </span>
        </div>

        {/* Right: Language Selector */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleLanguage}
            className="border border-white/40 hover:border-white px-2.5 py-1 rounded-md transition-colors"
          >
            <span className="font-semibold text-emerald-100">{language}</span>
          </button>
        </div>
      </div>
    </header>
  );
}