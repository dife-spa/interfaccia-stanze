// src/components/DigitalClock.tsx
"use client";

import { useEffect, useState } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { WiCloud } from 'react-icons/wi'; // Use appropriate weather icons

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { weather, loading: weatherLoading } = useWeather();

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) return null;

  // Format time and date using local settings
  const timeString = currentTime.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  let dateString = currentTime.toLocaleDateString('it-IT', dateOptions);
  dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  return (
    <div className="inline-grid grid-cols-[max-content_max-content] gap-x-4 grid-rows-[auto_auto] text-white">
      {/* Weather Icon */}
      <div className="w-16 h-16 flex justify-center items-center">
        <WiCloud className="w-full h-full" />
      </div>
      {/* Clock */}
      <div className="flex justify-end items-start">
        {/* Responsive font sizes: smaller on mobile, larger on tablet/desktop */}
        <div className="text-5xl font-bold">{timeString}</div>
      </div>
      {/* Temperature */}
      <div className="flex justify-center items-end">
        {!weatherLoading && weather && (
          <div className="text-base md:text-xl">{weather.temperature}°C</div>
        )}
      </div>
      {/* Date */}
      <div className="flex justify-start items-end">
        <div className="text-base">{dateString}</div>
      </div>
    </div>
  );
};

export default DigitalClock;
