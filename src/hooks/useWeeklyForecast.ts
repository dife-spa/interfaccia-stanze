// src/hooks/useWeeklyForecast.ts
"use client";

import { useEffect, useState } from 'react';

export interface DailyForecast {
  date: string; // in "YYYY-MM-DD" format
  weathercode: number;
}

export function useWeeklyForecast(latitude: number = 43.883, longitude: number = 10.867) {
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      // Request daily weather code forecast; specify the timezone for Italy
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode&timezone=Europe%2FRome`
      );
      const data = await res.json();
      if (data && data.daily) {
        // Map the arrays into an array of objects
        const dailyForecast: DailyForecast[] = data.daily.time.map(
          (date: string, index: number) => ({
            date,
            weathercode: data.daily.weathercode[index],
          })
        );
        setForecast(dailyForecast);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchForecast();
  }, [latitude, longitude]);

  return { forecast, loading, error };
}
