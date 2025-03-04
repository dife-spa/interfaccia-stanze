"use client";

import React from 'react';
import { ClockIcon, TagIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export interface FutureReservation {
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

interface FutureReservationsCardProps {
  reservations: FutureReservation[];
  currentReservation?: FutureReservation | null;
}

const formatTime = (timeStr: string) => {
  const date = new Date(timeStr.replace(" ", "T"));
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const FutureReservationsCard: React.FC<FutureReservationsCardProps> = ({ reservations, currentReservation }) => {
  // If there are no reservations at all and no current reservation, show a message.
  if (!currentReservation && reservations.length === 0) {
    return (
      <div className="h-full bg-black/20 rounded-lg text-white overflow-hidden p-4">
        <div className="text-center text-xs text-white/70">
          Non ci sono prenotazioni future
        </div>
      </div>
    );
  }
  
  // Group future reservations by date.
  const grouped = reservations.reduce((acc: { [date: string]: FutureReservation[] }, res) => {
    if (!acc[res.data]) {
      acc[res.data] = [];
    }
    acc[res.data].push(res);
    return acc;
  }, {} as { [date: string]: FutureReservation[] });
  
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="h-full bg-black/20 rounded-lg text-white overflow-hidden flex flex-col">
      {/* Featured Section: Display current reservation at the top (if available) */}
      {currentReservation && (
        <div className="border-b border-white/20">
          <div className="px-3 py-2 text-[1.2rem] font-medium text-white bg-black/30">
            <div className="text-white/7">Prenotazione corrente</div>
          </div>
          <div className="flex items-center space-x-8 px-2 py-6 pulse">
            {/* Left: Avatar and user info */}
            <div className="flex items-center space-x-2">
              <img
                src={currentReservation.userPic}
                alt={`${currentReservation.user_nome} ${currentReservation.user_cognome}`}
                className="w-8 h-8 rounded-full"
              />
              <div>
              <div className="font-bold text-sm flex flex-col">
                {currentReservation.user_nome} {currentReservation.user_cognome}
                <span className="text-[0.8rem] font-normal">e altri {currentReservation.n_partecipanti}</span>
              </div>

              </div>
            </div>
            {/* Right: Reservation details */}
            <div className="flex space-x-4">
              <div className="flex items-center space-x-8">
                <span className="text-[1rem]">{formatTime(currentReservation.ora_inizio)} - {formatTime(currentReservation.ora_fine)}</span>
                <span className="text-[1rem]">{currentReservation.tipologia}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Grouped Future Reservations */}
      {sortedDates.map((dateKey) => (
        <React.Fragment key={dateKey}>
          {/* Group Header */}
          <div className="px-2 py-1 text-[0.8rem] font-medium text-white bg-black/30">
            {dateKey === new Date().toISOString().split("T")[0]
              ? "Oggi"
              : (() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const tomorrowStr = tomorrow.toISOString().split("T")[0];
                  if (dateKey === tomorrowStr) return "Domani";
                  const d = new Date(dateKey);
                  const options: Intl.DateTimeFormatOptions = {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long'
                  };
                  return d.toLocaleDateString('it-IT', options);
                })()}
          </div>
          {/* Sub-header for columns */}
          {/*}<div className="flex bg-black/30">
            <div className="px-2 py-1 w-1/3 text-left text-[0.8rem] font-medium text-white uppercase tracking-wider">
              Utente
            </div>
            <div className="px-2 py-1 w-1/3 text-left text-[0.8rem] font-medium text-white uppercase tracking-wider">
              Orario
            </div>
            <div className="px-2 py-1 w-1/3 text-left text-[0.8rem] font-medium text-white uppercase tracking-wider">
              Tipologia
            </div>
          </div>{*/}
          {grouped[dateKey].map((res, index) => (
            <div key={index} className="flex items-center border-b border-white/20">
              <div className="px-2 py-1 w-1/3 text-[0.8rem] text-white">
                <div className="flex items-center space-x-2">
                  <img
                    src={res.userPic}
                    alt={`${res.user_nome} ${res.user_cognome}`}
                    className="w-4 h-4 rounded-full"
                  />
                  <div>
                    <span>{res.user_nome} {res.user_cognome}</span>
                    {res.n_partecipanti > 1 && (
                      <div className="text-[0.6rem] text-white/70">e altri {res.n_partecipanti}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-2 py-1 w-1/3 text-[0.8rem] text-white">
                <span>{formatTime(res.ora_inizio)} - {formatTime(res.ora_fine)}</span>
              </div>
              <div className="px-2 py-1 w-1/3 text-[0.8rem] text-white">
                {res.tipologia}
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FutureReservationsCard;
