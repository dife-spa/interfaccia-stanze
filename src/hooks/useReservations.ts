// src/hooks/useReservations.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Reservation {
  id_stanza: number;
  ora_inizio: string;
  ora_fine: string;
  data: string;
  tipologia: string;
  n_partecipanti: number;
  user_nome: string;
  user_cognome: string;
  userPic: string;
}

export function useReservations(roomId?: number) {
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [futureReservations, setFutureReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roomId === undefined) {
      setLoading(true);
      return;
    }
    const fetchReservations = async () => {
      setLoading(true);
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const { data, error } = await supabase
        .from('prenotazioni')
        .select('*')
        .eq('id_stanza', roomId)
        .gte('data', todayStr)
        .order('data', { ascending: true });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data) {
        const sortedData = data.sort((a, b) => {
          if (a.data === b.data) {
            return a.ora_inizio.localeCompare(b.ora_inizio);
          }
          return a.data.localeCompare(b.data);
        });
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        let current: Reservation | null = null;
        const future: Reservation[] = [];
        sortedData.forEach((reservation: Reservation) => {
          if (reservation.data === todayStr) {
            const startDate = new Date(reservation.ora_inizio.replace(" ", "T"));
            const endDate = new Date(reservation.ora_fine.replace(" ", "T"));
            const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
            const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
            if (nowMinutes >= startMinutes && nowMinutes < endMinutes) {
              current = reservation;
            } else if (startMinutes > nowMinutes) {
              future.push(reservation);
            }
          } else {
            future.push(reservation);
          }
        });
        setCurrentReservation(current);
        setFutureReservations(future);
      }
      setLoading(false);
    };

    fetchReservations();
  }, [roomId]);

  return { currentReservation, futureReservations, loading, error };
}
