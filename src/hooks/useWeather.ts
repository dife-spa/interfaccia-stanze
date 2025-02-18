// src/hooks/useWeather.ts
"use client";

import { useEffect, useState } from 'react';

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export function useWeather(latitude: number = 43.883, longitude: number = 10.867) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await res.json();
      if (data && data.current_weather) {
        setWeather(data.current_weather);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // refresh every 10 minutes
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return { weather, loading, error };
}
