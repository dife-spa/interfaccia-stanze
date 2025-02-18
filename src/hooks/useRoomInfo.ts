// src/hooks/useRoomInfo.ts
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface RoomInfoData {
  id: number;
  nome: string;
  descrizione: string;
  posizione: number;
  capienza: number;
  accessori: string;
}

export function useRoomInfo(roomId: number) {
  const [roomInfo, setRoomInfo] = useState<RoomInfoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomInfo = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stanze')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRoomInfo(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoomInfo();
  }, [roomId]);

  return { roomInfo, loading, error };
}
