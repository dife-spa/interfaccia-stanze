// src/app/interface/page.tsx
"use client";

import { useRoomInfo } from '@/hooks/useRoomInfo';
import DigitalClock from '@/components/DigitalClock';
import RoomInfo from '@/components/RoomInfo';
import OtherRoomsInfo from '@/components/OtherRoomsInfo';
import RoomStatus from '@/components/RoomStatus';
import FutureReservationsCard from '@/components/FutureReservationsCard';
import { useReservations } from '@/hooks/useReservations';
import { useState, useEffect } from 'react';
import { ArrowsPointingOutIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const InterfacePage = () => {
  const router = useRouter();
  const roomId = 1;
  const { roomInfo, loading: roomLoading, error: roomError } = useRoomInfo(roomId);
  const { currentReservation, futureReservations } = useReservations(roomId);
  
  // Determine room status based on whether there's a current reservation.
  const [roomStatus, setRoomStatus] = useState<"In uso" | "Libera">("Libera");

  useEffect(() => {
    if (currentReservation) {
      setRoomStatus("In uso");
    } else {
      setRoomStatus("Libera");
    }
  }, [currentReservation]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        if (router && typeof router.push === 'function') {
          router.push('/');
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className={`${roomStatus === "In uso" ? "bg-roomInUse" : "bg-roomAvailable"} flex h-screen overflow-hidden relative`}>
      {/* Fixed Top-Left Icons */}
      <div className="absolute top-4 left-4 flex space-x-2 z-20">
        <ArrowsPointingOutIcon onClick={handleFullscreen} className="w-6 h-6 text-white cursor-pointer" />
        <ArrowRightOnRectangleIcon onClick={handleLogout} className="w-6 h-6 text-white cursor-pointer" />
      </div>
      <div className="flex w-full h-full">
        {/* Left Column (66% width) */}
        <div className="w-[60%] relative p-4 md:p-8 flex flex-col">
          {/* Top Row: DigitalClock (left) and WeeklyForecastBar (right) */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-1/2">
              <DigitalClock />
            </div>

          </div>
          {/* Middle: RoomStatus (vertically centered, aligned left) */}
          <div className="flex flex-grow items-center justify-start">
            <RoomStatus 
              status={roomStatus} 
              currentReservation={currentReservation}
              nextReservation={roomStatus === "Libera" && futureReservations.length > 0 ? futureReservations[0] : null}
            />
          </div>
          {/* Bottom: RoomInfo (fixed at bottom left) */}
          <div className="w-full">
            {roomLoading ? (
              <div className="text-white text-sm md:text-base">Caricamento stanza...</div>
            ) : roomError ? (
              <div className="text-white text-sm md:text-base">Errore: {roomError}</div>
            ) : roomInfo ? (
              <RoomInfo
                nome={roomInfo.nome}
                accessori={roomInfo.accessori}
                capienza={roomInfo.capienza}
                posizione={roomInfo.posizione}
              />
            ) : null}
          </div>
        </div>
        {/* Right Column (33% width) */}
        <div className="w-[40%] relative flex flex-col gap-y-4">
          {/* Top: FutureReservationsCard (full width, top half) */}
          <div className="w-full h-full">
            <FutureReservationsCard reservations={futureReservations} />
          </div>
          {/* Bottom: OtherRoomsInfo (full width, bottom half) */}
          <div className="w-full">
            <OtherRoomsInfo excludeRoomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfacePage;
