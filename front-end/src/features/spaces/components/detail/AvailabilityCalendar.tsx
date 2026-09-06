"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AvailabilityCalendarProps {
  initialSelectedDate: number;
  bookedDates: number[];
}

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DATES = [
  { day: 26, muted: true },
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 31, muted: true },
  ...Array.from({ length: 31 }, (_, index) => ({
    day: index + 1,
    muted: false,
  })),
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
  { day: 5, muted: true },
];

export default function AvailabilityCalendar({
  initialSelectedDate,
  bookedDates,
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);

  return (
    <section className="border-t border-slate-100 pt-8">
      <h2 className="mb-4 text-lg font-bold text-slate-900">
        Jadwal Ketersediaan
      </h2>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-[#7c3aed]">Agustus 2026</h3>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Bulan sebelumnya"
              className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Bulan berikutnya"
              className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
            Dipilih
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            Dipesan
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full border border-slate-300" />
            Tersedia
          </span>
        </div>
        <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-medium">
          {DATES.map((date, index) => {
            const booked = !date.muted && bookedDates.includes(date.day);
            const selected = !date.muted && date.day === selectedDate;
            return (
              <button
                key={`${date.day}-${index}`}
                type="button"
                disabled={date.muted || booked}
                onClick={() => setSelectedDate(date.day)}
                className={`rounded-lg py-2.5 font-bold transition-colors ${date.muted ? "text-slate-300" : booked ? "bg-slate-50 text-slate-400" : selected ? "bg-[#8b5cf6] text-white shadow-sm" : "text-slate-800 hover:bg-violet-50 hover:text-[#7c3aed]"}`}
              >
                {date.day}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
