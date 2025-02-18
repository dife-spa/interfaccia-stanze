// src/components/ReservationsTimeline.tsx
import React from 'react';

interface TimelineReservation {
  ora_inizio: string; // Reservation start time (e.g., "09:00")
  ora_fine: string;   // Reservation end time (e.g., "10:30")
  tipologia: string;
  user_nome: string;
  user_cognome: string;
  data: string;       // The reservation date in "YYYY-MM-DD" format
}

interface ReservationsTimelineProps {
  reservations: TimelineReservation[];
}

const ReservationsTimeline: React.FC<ReservationsTimelineProps> = ({ reservations }) => {
  // Timeline settings: start at 08:00, end at 18:00 (10 hours = 600 minutes)
  const timelineStart = 8;
  const timelineEnd = 18;
  const totalMinutes = (timelineEnd - timelineStart) * 60; // 600 minutes

  return (
    // Outer container fills the viewport
    <div className="relative h-screen w-64 border-l border-white text-white">
      {/* Inner container with top and bottom spacing */}
      <div className="absolute inset-x-0 top-16 bottom-16">
        {/* Hour Markers */}
        {Array.from({ length: timelineEnd - timelineStart + 1 }).map((_, index) => {
          const hour = timelineStart + index;
          // Compute vertical position relative to the inner container's height
          const topPercent = (index / (timelineEnd - timelineStart)) * 100;
          return (
            <div
              key={`hour-${hour}`}
              className="relative left-0 w-full"
              style={{ top: `${topPercent}%` }}
            >
              <span
                className="absolute -left-16 text-xs"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                {hour}:00
              </span>
              <div className="border-t border-white/50"></div>
            </div>
          );
        })}

        {/* Quarter-Hour Markers */}
        {Array.from({ length: ((timelineEnd - timelineStart) * 4) - 1 }).map((_, i) => {
          const quarterIndex = i + 1;
          if (quarterIndex % 4 === 0) return null;
          const minutesFromStart = quarterIndex * 15;
          const topPercent = (minutesFromStart / totalMinutes) * 100;
          return (
            <div
              key={`quarter-${i}`}
              className="absolute left-0 w-full"
              style={{ top: `${topPercent}%` }}
            >
              <div className="border-t border-white/20"></div>
            </div>
          );
        })}

        {/* Reservation Blocks */}
        {reservations.map((reservation, index) => {
          // Parse start and end times using both reservation.data and the time string.
          const startDate = new Date(`${reservation.data}T${reservation.ora_inizio}:00`);
          const endDate = new Date(`${reservation.data}T${reservation.ora_fine}:00`);
          // Convert times to minutes from midnight.
          const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
          const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
          // Compute top offset and height as percentages relative to the timeline (08:00 to 18:00)
          const blockTop = ((startMinutes - timelineStart * 60) / totalMinutes) * 100;
          const blockHeight = ((endMinutes - startMinutes) / totalMinutes) * 100;
          // Determine if this reservation is currently active.
          const now = new Date();
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          const isCurrent = nowMinutes >= startMinutes && nowMinutes < endMinutes;
          
          // If the block is very short, reduce the font size.
          const fontSizeClass = blockHeight < 5 ? "text-[0.5rem]" : "text-xs";

          return (
            <div
              key={index}
              className={`absolute left-2 right-2 rounded p-1 z-5 min-h-[1.5rem] ${isCurrent ? "bg-black/70" : "bg-black/40"}`}
              style={{ top: `${blockTop}%`, height: `${blockHeight}%` }}
            >
              <div className={`${fontSizeClass} overflow-visible`}>
                {reservation.user_nome} {reservation.user_cognome} – {reservation.tipologia}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReservationsTimeline;
