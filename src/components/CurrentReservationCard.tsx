// src/components/CurrentReservationCard.tsx
import React from 'react';
import { ClockIcon, TagIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export interface CurrentReservation {
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

interface CurrentReservationCardProps {
  reservation: CurrentReservation;
}

// Helper function to parse a timestamp string (with a space) into a Date.
const parseTimestamp = (timestamp: string): Date => new Date(timestamp.replace(" ", "T"));

const CurrentReservationCard: React.FC<CurrentReservationCardProps> = ({ reservation }) => {
  const startDate = parseTimestamp(reservation.ora_inizio);
  const endDate = parseTimestamp(reservation.ora_fine);
  
  const formattedStartTime = startDate.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const formattedEndTime = endDate.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  return (
    <div className="max-w-xl bg-black/20 rounded-lg text-white overflow-hidden">
      {/* Card Header */}
      <div className="bg-black/40 py-4 px-6">
        <h2 className="text-xl font-bold">Prenotazione corrente</h2>
      </div>
      {/* Card Content */}
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <img
            src={reservation.userPic}
            alt={`${reservation.user_nome} ${reservation.user_cognome}`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="text-sm text-white/70">Prenotazione di</div>
            <div className="font-bold text-lg">
              {reservation.user_nome} {reservation.user_cognome}
            </div>
          </div>
        </div>
        {/* Divider */}
        <hr className="border-t border-white my-6" />
        {/* Reservation Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5" />
            <span>Dalle {formattedStartTime} alle {formattedEndTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TagIcon className="w-5 h-5" />
            <span>{reservation.tipologia}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-5 h-5" />
            <span>Partecipanti: {reservation.n_partecipanti}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentReservationCard;
