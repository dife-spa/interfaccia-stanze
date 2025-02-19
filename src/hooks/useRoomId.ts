// src/hooks/useRoomId.ts
import { useEffect, useState } from 'react';

export function useRoomId() {
  const [roomId, setRoomId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRoomId() {
      try {
        const res = await fetch('/api/room');
        if (res.ok) {
          const data = await res.json();
          if (data.idStanza) {
            setRoomId(Number(data.idStanza));
          }
        }
      } catch (error) {
        console.error('Failed to fetch room id:', error);
      }
    }
    fetchRoomId();
  }, []);

  return roomId;
}
