// src/components/DigitalClock.tsx
"use client";

import { useEffect, useState } from 'react';
import { useWeather } from '@/hooks/useWeather';
import WeatherIcon from '@/components/WeatherIcon';

const mapWeatherCodeToCondition = (weathercode: number): string => {
  if (weathercode === 0) return "clear";
  if ([1, 2, 3].includes(weathercode)) return "cloudy";
  if ([45, 48].includes(weathercode)) return "fog";
  if ([51, 53, 55].includes(weathercode)) return "rain";
  if ([56, 57].includes(weathercode)) return "rain"; // or "freezing rain"
  if ([61, 63, 65].includes(weathercode)) return "rain";
  if ([66, 67].includes(weathercode)) return "rain"; // or "freezing rain"
  if ([71, 73, 75, 77, 85, 86].includes(weathercode)) return "snow";
  if ([80, 81, 82].includes(weathercode)) return "rain";
  if ([95, 96, 99].includes(weathercode)) return "thunderstorm";
  return "cloudy";
};

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { weather, loading: weatherLoading } = useWeather();

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) return null;

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

  const condition = weather && !weatherLoading
    ? mapWeatherCodeToCondition(weather.weathercode)
    : "cloudy";

  return (
    <div className="inline-grid grid-cols-[max-content_max-content] gap-x-6 grid-rows-[auto_auto] text-white">
      {/* Weather Icon */}
      <div className="w-[3rem] h-[3rem] flex justify-end items-end mb-1">
        <WeatherIcon condition={condition} className="w-full h-full" viewBox="2 2 24 24" />
      </div>
      {/* Clock */}
      <div className="flex justify-start items-end">
        <div className="text-5xl font-bold">{timeString}</div>
      </div>
      {/* Temperature */}
      <div className="flex justify-center items-end">
        {!weatherLoading && weather && (
          <div className="text-base">{weather.temperature}°C</div>
        )}
      </div>
      {/* Date */}
      <div className="flex justify-end items-end">
        <div className="text-base">{dateString}</div>
      </div>
    </div>
  );
};

export default DigitalClock;
