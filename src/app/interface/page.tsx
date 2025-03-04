// src/app/interface/page.tsx
"use client";

import { useRoomId } from '@/hooks/useRoomId';
import { useRoomInfo } from '@/hooks/useRoomInfo';
import { useReservations } from '@/hooks/useReservations';
import DigitalClock from '@/components/DigitalClock';
import RoomInfo from '@/components/RoomInfo';
import OtherRoomsInfo from '@/components/OtherRoomsInfo';
import RoomStatus from '@/components/RoomStatus';
import FutureReservationsCard from '@/components/FutureReservationsCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowsPointingOutIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const InterfacePage = () => {
  const router = useRouter();
  const roomId = useRoomId();

  // Call hooks unconditionally with roomId (or undefined)
  const { roomInfo, loading: roomLoading, error: roomError } = useRoomInfo(roomId ?? undefined);
  const { currentReservation, futureReservations } = useReservations(roomId ?? undefined);

  const [roomStatus, setRoomStatus] = useState<"In uso" | "Libera">("Libera");
  useEffect(() => {
    setRoomStatus(currentReservation ? "In uso" : "Libera");
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
        router.push('/');
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // While the room id is not available, show a loading indicator.
  if (roomId === null) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className={`${roomStatus === "In uso" ? "bg-roomInUse" : "bg-roomAvailable"} flex h-screen overflow-hidden relative`}>
      {/* Fixed Top-Left Icons */}
      <div className="absolute top-2 left-2 flex space-x-2 z-20">
        <ArrowsPointingOutIcon onClick={handleFullscreen} className="w-6 h-6 text-white cursor-pointer" />
        <ArrowRightOnRectangleIcon onClick={handleLogout} className="w-6 h-6 text-white cursor-pointer" />
      </div>
      <div className="flex w-full h-full">
        {/* Left Column (≈60% width) */}
        <div className="w-[50%] relative p-4 md:p-8 flex flex-col">
          {/* Top Row: Only DigitalClock on left */}
          <div className="mb-4">
            <DigitalClock />
          </div>
          {/* Middle Row: RoomStatus (vertically centered, aligned left) */}
          <div className="flex flex-grow items-center justify-start">
            <RoomStatus 
              status={roomStatus} 
              currentReservation={currentReservation}
              nextReservation={roomStatus === "Libera" && futureReservations.length > 0 ? futureReservations[0] : null}
            />
          </div>
          {/* Bottom Row: RoomInfo fixed at bottom left */}
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
        {/* Right Column (≈40% width) */}
        <div className="w-[50%] relative flex flex-col gap-y-4 p-4 md:p-8">
          {/* Top: FutureReservationsCard */}
          <div className="w-full h-full">
            <FutureReservationsCard
              reservations={futureReservations}
              currentReservation={currentReservation}
            />
          </div>
          {/* Bottom: OtherRoomsInfo */}
          <div className="w-full">
            <OtherRoomsInfo excludeRoomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfacePage;
