// src/hooks/useReservations.ts
"use client";

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

export interface TimelineReservation {
  ora_inizio: string;
  ora_fine: string;
  tipologia: string;
  user_nome: string;
  user_cognome: string;
  data: string;
}

interface UseReservationsResult {
  currentReservation: Reservation | null;
  futureReservations: Reservation[];
  timelineReservations: TimelineReservation[];
  loading: boolean;
  error: string | null;
}

export function useReservations(roomId: number): UseReservationsResult {
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [futureReservations, setFutureReservations] = useState<Reservation[]>([]);
  const [timelineReservations, setTimelineReservations] = useState<TimelineReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD" (UTC)

    // Fetch reservations for today and future dates for the given room.
    const { data, error } = await supabase
      .from("prenotazioni")
      .select("*")
      .eq("id_stanza", roomId)
      .gte("data", todayStr)
      .order("data", { ascending: true });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
    if (data) {
      // Sort data by date and, when on the same day, by ora_inizio.
      const sortedData = data.sort((a, b) => {
        if (a.data === b.data) {
          return a.ora_inizio.localeCompare(b.ora_inizio);
        }
        return a.data.localeCompare(b.data);
      });
      
      // Calculate current time in minutes (local time)
      const currentTime = today.getHours() * 60 + today.getMinutes();
      let current: Reservation | null = null;
      const future: Reservation[] = [];
      const timeline: TimelineReservation[] = [];
      
      sortedData.forEach((reservation) => {
        if (reservation.data === todayStr) {
          // For today's reservations, determine if it is the current reservation.
          // Since ora_inizio and ora_fine are timestamps (e.g. "2025-02-13 17:30:00"),
          // we need to parse them correctly. Assuming they are in a format that new Date() can parse:
          const startDate = new Date(reservation.ora_inizio.replace(" ", "T"));
          const endDate = new Date(reservation.ora_fine.replace(" ", "T"));
          const startTime = startDate.getHours() * 60 + startDate.getMinutes();
          const endTime = endDate.getHours() * 60 + endDate.getMinutes();
          
          if (currentTime >= startTime && currentTime < endTime) {
            current = reservation;
          } else if (startTime > currentTime) {
            future.push(reservation);
          }
        } else {
          // Reservations for future dates
          future.push(reservation);
        }
        timeline.push({
          ora_inizio: reservation.ora_inizio,
          ora_fine: reservation.ora_fine,
          tipologia: reservation.tipologia,
          user_nome: reservation.user_nome,
          user_cognome: reservation.user_cognome,
          data: reservation.data,
        });
      });
      
      setCurrentReservation(current);
      setFutureReservations(future);
      setTimelineReservations(timeline);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();

    const channel = supabase
      .channel("reservations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prenotazioni",
          filter: `id_stanza=eq.${roomId}`,
        },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  return { currentReservation, futureReservations, timelineReservations, loading, error };
}
