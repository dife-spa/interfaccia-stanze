// src/components/OtherRoomsInfo.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  TvIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  UserIcon,
  UserGroupIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export interface Room {
  id: number;
  nome: string;
  descrizione?: string;
  posizione: number;
  capienza: number;
  accessori: string | string[]; // either a comma-separated string or an array
}

export interface Reservation {
  id_stanza: number;
  ora_inizio: string;
  ora_fine: string;
  data: string; // expected in "YYYY-MM-DD" format
  tipologia: string;
  n_partecipanti: number;
  user_nome: string;
  user_cognome: string;
  userPic: string;
}

export interface OtherRoom extends Room {
  status: "In uso" | "Libera";
}

interface OtherRoomsInfoProps {
  excludeRoomId?: number;
}

const featureIconMap: { [key: string]: React.ReactElement } = {
  "tv": <TvIcon className="w-5 h-5 text-white" />,
  "video-camera": <VideoCameraIcon className="w-5 h-5 text-white" />,
  "webcam": <VideoCameraIcon className="w-5 h-5 text-white" />,
  "microphone": <MicrophoneIcon className="w-5 h-5 text-white" />,
  "microfono": <MicrophoneIcon className="w-5 h-5 text-white" />,
  "user": <UserIcon className="w-5 h-5 text-white" />,
};

const OtherRoomsInfo: React.FC<OtherRoomsInfoProps> = ({ excludeRoomId }) => {
  const [rooms, setRooms] = useState<OtherRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomsAndStatus = async () => {
      setLoading(true);
      // 1. Fetch all rooms from "stanze" table.
      const { data: roomsData, error: roomsError } = await supabase
        .from('stanze')
        .select('*');
      if (roomsError) {
        setError(roomsError.message);
        setLoading(false);
        return;
      }
      
      // 2. Get today's date string.
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // 3. Compute room IDs from roomsData.
      const roomIds = (roomsData || []).map((room: Room) => room.id);
      
      // 4. Fetch today's reservations only if roomIds is non-empty.
      let reservationsData: Reservation[] = [];
      if (roomIds.length > 0) {
        const { data, error: reservationsError } = await supabase
          .from('prenotazioni')
          .select('*')
          .in('id_stanza', roomIds)
          .eq('data', todayStr);
        if (reservationsError) {
          setError(reservationsError.message);
          setLoading(false);
          return;
        }
        reservationsData = data || [];
      }
      
      // 5. For each room, determine its status based on active reservations.
      const updatedRooms: OtherRoom[] = (roomsData || [])
        .filter((room: Room) => (excludeRoomId ? room.id !== excludeRoomId : true))
        .map((room: Room) => {
          let status: "In uso" | "Libera" = "Libera";
          if (reservationsData.length > 0) {
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const roomReservations = (reservationsData as Reservation[]).filter(
              (res) => res.id_stanza === room.id
            );
            const activeReservation = roomReservations.some((res) => {
              const startDate = new Date(res.ora_inizio.replace(" ", "T"));
              const endDate = new Date(res.ora_fine.replace(" ", "T"));
              const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
              const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
              return nowMinutes >= startMinutes && nowMinutes < endMinutes;
            });
            if (activeReservation) status = "In uso";
          }
          return { ...room, status };
        });
      
      setRooms(updatedRooms);
      setLoading(false);
    };

    fetchRoomsAndStatus();
  }, [excludeRoomId]);

  if (loading) return <div className="text-white">Caricamento altre stanze...</div>;
  if (error) return <div className="text-white">Errore: {error}</div>;

  return (
    <div className="flex flex-wrap gap-4">
      {rooms.map((room) => {
        // Process accessori: if string, split by comma; if array, use directly.
        const features: string[] =
          typeof room.accessori === 'string'
            ? room.accessori.split(',').map(f => f.trim().toLowerCase())
            : Array.isArray(room.accessori)
              ? room.accessori.map(f => f.toLowerCase())
              : [];
        return (
          <div key={room.id} className="bg-black/20 p-4 flex flex-col space-y-2 w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Sala {room.nome}</h3>
              <div className="text-xl font-bold text-white">{room.status}</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  {featureIconMap[feature] || (
                    <span className="text-xs text-white">{feature}</span>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-1">
                <UserGroupIcon className="w-5 h-5 text-white" />
                <span className="text-xs text-white">{room.capienza}</span>
              </div>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-5 h-5 text-white" />
                <span className="text-xs text-white">Serravalle {room.posizione}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OtherRoomsInfo;
