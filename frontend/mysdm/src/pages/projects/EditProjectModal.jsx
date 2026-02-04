import { useState } from "react";
import { toast } from "react-toastify";

const STATUS = ["Draft", "Active", "Completed", "OnHold"];

export default function EditProjectModal({ project, onSave }) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(project.projectName);
  const [desc, setDesc] = useState(project.description || "");
  const [startDate, setStartDate] = useState(
    project.startDate ? project.startDate.slice(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    project.endDate ? project.endDate.slice(0, 10) : ""
  );
  const [status, setStatus] = useState(project.status);

  const submit = () => {
    if (!name.trim()) return toast.error("Project name required");

    onSave({
      projectID: project.projectID,
      projectName: name.trim(),
      description: desc.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      status,
    });

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-900 hover:underline"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
            <h3 className="text-lg font-bold">Edit Project</h3>

            <input
              className="border rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
            />

            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
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

            <select
              className="border rounded px-3 py-2 w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                className="bg-gray-900 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
