// src/components/WeeklyForecastBar.tsx
"use client";

import { useWeeklyForecast } from '@/hooks/useWeeklyForecast';
import {
  WiDaySunny,
  WiFog,
  WiSprinkle,
  WiRainMix,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiCloud,
} from 'react-icons/wi';

const getForecastIconComponent = (weathercode: number) => {
  if ([0, 1, 2, 3].includes(weathercode)) return WiDaySunny;
  else if ([45, 48].includes(weathercode)) return WiFog;
  else if ([51, 53, 55].includes(weathercode)) return WiSprinkle;
  else if ([56, 57].includes(weathercode)) return WiRainMix;
  else if ([61, 63, 65].includes(weathercode)) return WiRain;
  else if ([66, 67].includes(weathercode)) return WiRainMix;
  else if ([71, 73, 75, 77, 85, 86].includes(weathercode)) return WiSnow;
  else if ([95, 96, 99].includes(weathercode)) return WiThunderstorm;
  else return WiCloud;
};

const WeeklyForecastBar = () => {
  const { forecast, loading } = useWeeklyForecast();

  // Compute the next five working days starting from tomorrow (excluding Saturdays, Sundays, and today)
  const nextWorkingDays: Date[] = [];
  let currentDate = new Date();
  // Skip today's date:
  currentDate.setDate(currentDate.getDate() + 1);
  while (nextWorkingDays.length < 5) {
    const dayOfWeek = currentDate.getDay(); // Sunday = 0, Saturday = 6
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      nextWorkingDays.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Map each working day to a label and formatted date
  const daysArray = nextWorkingDays.map((dateObj) => {
    const weekdayAbbrev = dateObj
      .toLocaleDateString('it-IT', { weekday: 'short' })
      .replace('.', '');
    const capitalizedAbbrev =
      weekdayAbbrev.charAt(0).toUpperCase() + weekdayAbbrev.slice(1);
    const dayNumber = dateObj.getDate();
    const label = `${capitalizedAbbrev} ${dayNumber}`;
    const formattedDate = dateObj.toISOString().split('T')[0];
    return { label, date: formattedDate };
  });

  // Attach forecast weather code for each day, if available
  const daysWithForecast = daysArray.map((day) => {
    let weatherCode: number | null = null;
    if (!loading && forecast.length > 0) {
      const dayForecast = forecast.find((f) => f.date === day.date);
      if (dayForecast) {
        weatherCode = dayForecast.weathercode;
      }
    }
    return { ...day, weatherCode };
  });

  return (
    <div className="flex px-12 pt-3 gap-x-6 pb-4 justify-between border border-white rounded-full text-white">
      {daysWithForecast.map((dayObj, index) => {
        let IconComponent;
        if (!loading && dayObj.weatherCode !== null) {
          IconComponent = getForecastIconComponent(dayObj.weatherCode);
        } else {
          IconComponent = WiCloud;
        }
        return (
          <div key={index} className="flex flex-col items-center">
            <IconComponent className="w-8 h-8 text-white" />
            <div className="text-xs mt-1">{dayObj.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyForecastBar;
