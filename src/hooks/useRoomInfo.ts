// src/hooks/useRoomInfo.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useRoomInfo(roomId?: number) {
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roomId === undefined) {
      // If no room id, do nothing (or reset state).
      setLoading(true);
      return;
    }
    const fetchRoomInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('stanze')
          .select('*')
          .eq('id', roomId)
          .single();
        if (error) {
          setError(error.message);
        } else {
          setRoomInfo(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomInfo();
  }, [roomId]);

  return { roomInfo, loading, error };
}
