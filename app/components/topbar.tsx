// components/TopBar.tsx
'use client';

import { useState, useEffect } from 'react';

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
    <header className="w-full bg-emerald-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-2">
          <span>📍 {location}</span>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={toggleLanguage}
            className="border border-white px-2.5 py-1 rounded-md"
          >
            <span className="font-medium text-emerald-100">{language}</span>
          </button>

          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="bg-white text-emerald-600 px-4 py-1.5 rounded-md font-medium"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </header>
  );
}