import { useState } from "react";
import { toast } from "react-toastify";

const MODULE_STATUS = ["Pending", "InProgress", "Completed", "OnHold", "Blocked"];

export default function AddModuleModal({ project, onClose, onCreate }) {
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  const projectId = project?.projectID ?? project?.id ?? project?.ProjectID;
  const projectName =
    project?.projectName ?? project?.name ?? project?.ProjectName;

  const reset = () => {
    setModuleName("");
    setDescription("");
    setStatus("Pending");
  };

  const submit = () => {
    if (!moduleName.trim()) return toast.error("Module name required");

    onCreate({
      projectId: Number(projectId),
      moduleName: moduleName.trim(),
      description: description.trim(),
      status,
    });

    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
        <h3 className="text-lg font-bold">Add Module</h3>

        <p className="text-sm text-gray-600">
          Project: <b>{projectName}</b> (ID: {projectId})
        </p>

        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Module name"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
        />

        <textarea
          className="border rounded px-3 py-2 w-full"
          rows={3}
          placeholder="Module description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {MODULE_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={submit}
            className="bg-gray-900 text-white px-4 py-2 rounded"
          >
            Create Module
          </button>
        </div>
      </div>
    </div>
  );
}
