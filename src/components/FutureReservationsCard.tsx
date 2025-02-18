// src/components/FutureReservationsCard.tsx
import React from 'react';
import { ClockIcon, TagIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface FutureReservation {
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
}

const formatTime = (timeStr: string) => {
  const date = new Date(timeStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getGroupLabel = (groupDateStr: string): string => {
  // groupDateStr is in "YYYY-MM-DD"
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  if (groupDateStr === todayStr) return "Oggi";
  if (groupDateStr === tomorrowStr) return "Domani";
  
  // Otherwise, format as "Giovedì 01/12/2025"
  const d = new Date(groupDateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  let formatted = d.toLocaleDateString('it-IT', options).replace(/,/g, '');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const FutureReservationsCard: React.FC<FutureReservationsCardProps> = ({ reservations }) => {
  if (reservations.length === 0) {
    return (
      <div className="h-full bg-black/20 text-white overflow-hidden p-4">
        <div className="text-center text-xs text-white/70">
          Non ci sono prenotazioni future
        </div>
      </div>
    );
  }

  // Group reservations by the "data" field.
  const grouped = reservations.reduce((acc: { [key: string]: FutureReservation[] }, res) => {
    if (!acc[res.data]) {
      acc[res.data] = [];
    }
    acc[res.data].push(res);
    return acc;
  }, {});

  // Sort group keys (dates) in ascending order.
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="h-full bg-black/20 text-white overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="bg-black/40 py-2 px-4">
        <h2 className="text-base md:text-xl font-bold">Prenotazioni Future</h2>
      </div>
      {/* Grouped Table for Reservations */}
      <div className="flex-1 overflow-auto">
        <table className="w-full divide-y divide-white/20">
          <tbody>
            {sortedDates.map((dateKey) => (
              <React.Fragment key={dateKey}>
                {/* Group Header Row */}
                <tr>
                  <td colSpan={3} className="px-2 py-1 text-[0.8rem] font-medium text-white bg-black/30">
                    {getGroupLabel(dateKey)}
                  </td>
                </tr>
                {/* Sub-header Row for Columns */}
                <tr className="bg-black/30">
                  <th className="px-2 py-1 text-left text-[0.8rem] font-medium text-white uppercase tracking-wider">
                    Utente
                  </th>
                  <th className="px-2 py-1 text-left text-[0.8rem] font-medium text-white uppercase tracking-wider">
                    Orario
                  </th>
                  <th className="px-2 py-1 text-left text-[0.8rem] font-medium text-white uppercase tracking-wider">
                    Tipologia
                  </th>
                </tr>
                {grouped[dateKey].map((res, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1 whitespace-nowrap text-[0.8rem] text-white">
                      <div className="flex items-center space-x-2">
                        {res.userPic ? (
                          <img
                            src={res.userPic}
                            alt={`${res.user_nome} ${res.user_cognome}`}
                            className="w-4 h-4 rounded-full"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[0.6rem] font-bold">
                            {res.user_nome.charAt(0).toUpperCase()}{res.user_cognome.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span>{res.user_nome} {res.user_cognome}</span>
                          {res.n_partecipanti > 1 && (
                            <div className="text-[0.6rem] text-white/70">
                              e altri {res.n_partecipanti}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap text-[0.8rem] text-white">
                      <span>{formatTime(res.ora_inizio)} - {formatTime(res.ora_fine)}</span>
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap text-[0.8rem] text-white">
                      {res.tipologia}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FutureReservationsCard;
