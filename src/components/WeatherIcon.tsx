"use client";

import React from 'react';
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from 'react-icons/wi';

interface WeatherIconProps {
  condition: string;         // e.g. "clear", "cloudy", "rain", "thunderstorm", "snow", "fog"
  className?: string;          // e.g. "w-10 h-10"
  viewBox?: string;            // optional custom viewBox
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = "w-10 h-10", viewBox }) => {
  const cond = condition.toLowerCase();
  let icon;
  switch (cond) {
    case "clear":
      icon = <WiDaySunny className={className} />;
      break;
    case "cloudy":
      icon = <WiCloud className={className} />;
      break;
    case "rain":
      icon = <WiRain className={className} />;
      break;
    case "thunderstorm":
      icon = <WiThunderstorm className={className} />;
      break;
    case "snow":
      icon = <WiSnow className={className} />;
      break;
    case "fog":
      icon = <WiFog className={className} />;
      break;
    default:
      icon = <WiCloud className={className} />;
      break;
  }
  
  // If a viewBox is provided, override the icon's viewBox.
  if (viewBox) {
    return React.cloneElement(icon, { viewBox });
  }
  
  return icon;
};

export default WeatherIcon;
