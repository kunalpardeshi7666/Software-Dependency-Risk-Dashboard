import { useState } from "react";
import { toast } from "react-toastify";

const todayDate = () => new Date().toISOString().slice(0, 10);

export default function CreateProjectModal({ onCreate }) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const reset = () => {
    setName("");
    setDesc("");
    setStartDate("");
    setEndDate("");
  };

  const submit = () => {
    const today = todayDate();

    if (!name.trim()) return toast.error("Project name required");

    if (startDate && startDate < today) {
      return toast.error("Start date cannot be in the past");
    }

    if (endDate && endDate < today) {
      return toast.error("End date cannot be in the past");
    }

    if (startDate && endDate && endDate < startDate) {
      return toast.error("End date cannot be before start date");
    }

    onCreate({
      projectName: name.trim(),
      description: desc.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      status: "Draft",
    });

    setOpen(false);
    reset();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-900 text-white px-4 py-2 rounded"
      >
        + Create Project
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
            <h3 className="text-lg font-bold">Create Project</h3>

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={3}
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                className="bg-gray-900 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
