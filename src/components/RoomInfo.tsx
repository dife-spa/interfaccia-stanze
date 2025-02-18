// src/components/RoomInfo.tsx
import React from 'react';

interface RoomInfoProps {
  nome: string;
  accessori: string | string[];
  capienza: number;
  posizione: number;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ nome, accessori, capienza, posizione }) => {
  const features =
    typeof accessori === 'string'
      ? accessori.split(',').map((feature) => feature.trim())
      : Array.isArray(accessori)
      ? accessori
      : [];

  return (
    <div className="text-white text-left">
      <div className="flex items-baseline gap-4">
        <h1 className="text-3xl font-bold">Sala {nome}</h1>
        <span className="text-sm">Serravalle {posizione}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <span key={index} className="uppercase px-2 py-1 border border-white rounded-lg text-sm">
            {feature}
          </span>
        ))}
        <span className="uppercase px-2 py-1 border border-white rounded-lg text-sm">
          Capienza: {capienza}
        </span>
      </div>
    </div>
  );
};

export default RoomInfo;
