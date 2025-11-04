import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";

export default function CustomDateTimePicker({ newTask, setNewTask, due }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const handleSave = () => {
    const fullDate = new Date(selectedDate);
    fullDate.setHours(parseInt(selectedHour));
    fullDate.setMinutes(parseInt(selectedMinute));

    setNewTask({ ...newTask, [due]: fullDate.toISOString() });
    setIsOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => `${i}`.padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, "0"));

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border rounded-lg w-full bg-[var(--input-primary)] text-[var(--text-color)] border-[var(--text-color)]"
      >
        {newTask[due]
          ? format(new Date(newTask[due]), "eee dd.MM.yy - HH:mm")
          : "Datum wählen"}
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-70"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center ">
          <Dialog.Panel className="bg-[var(--background-main)] text-[var(--text-color)] p-6  max-w-sm w-full border rounded-md  border-(color:--shadow-color) shadow-md shadow-(color:--shadow-color)">
            <Dialog.Title className="text-lg font-bold mb-4">
              Datum & Uhrzeit wählen
            </Dialog.Title>

            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="mb-4 w-full px-4 py-2 border border-[var(--text-color)] bg-[var(--input-primary)] rounded-lg"
            />

            <div className="flex justify-between gap-4 mb-4">
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="flex-1 px-4 py-2 border border-[var(--text-color)] bg-[var(--input-primary)] rounded-lg"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h} Uhr
                  </option>
                ))}
              </select>

              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
                className="flex-1 px-4 py-2 border border-[var(--text-color)] bg-[var(--input-primary)] rounded-lg"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m} Min
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 w-[100%] justify-between mt-4 pt-8 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px] "
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="cursor-pointer px-6 py-2 rounded-md bg-[var(--accent-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px]"
              >
                Übernehmen
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
