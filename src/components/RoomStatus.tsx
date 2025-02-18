// src/components/RoomStatus.tsx
import React from 'react';

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

interface RoomStatusProps {
  status: "In uso" | "Libera";
  currentReservation?: Reservation | null;
  nextReservation?: Reservation | null;
}

const RoomStatus: React.FC<RoomStatusProps> = ({ status, currentReservation, nextReservation }) => {
  let timeText = "";
  
  if (status === "In uso" && currentReservation) {
    // For a room in use, show the end time of the current reservation.
    timeText = new Date(currentReservation.ora_fine.replace(" ", "T")).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else if (status === "Libera" && nextReservation) {
    // For an available room, show the start time of the next reservation with additional info.
    const nextDate = new Date(nextReservation.ora_inizio.replace(" ", "T"));
    const nextTime = nextDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    
    const nextResDateStr = nextDate.toISOString().split("T")[0];
    
    if (nextResDateStr === todayStr) {
      timeText = `${nextTime}`;
    } else if (nextResDateStr === tomorrowStr) {
      timeText = `${nextTime} di domani`;
    } else {
      const formattedDate = nextDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
      const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      timeText = `${nextTime} di ${capitalizedDate}`;
    }
  }

  return (
    <div className="text-white">
      <h1 className={`text-[12rem] font-bold leading-none ${status === "In uso" ? "pulse" : ""}`}>
        {status}
      </h1>
      {timeText && (
        <div className="mt-4 text-lg">
          Fino alle {timeText}
        </div>
      )}
    </div>
  );
};

export default RoomStatus;
