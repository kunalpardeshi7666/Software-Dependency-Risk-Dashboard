// src/components/developers/DeveloperForm.jsx
import { useEffect, useState } from "react";

const DeveloperForm = ({ onSubmit, initialData, readOnly }) => {
  const emptyForm = {
    developerName: "",
    email: "",
    role: "Developer",
    experience: 0,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        developerID: initialData.developerID,
        developerName: initialData.developerName || "",
        email: initialData.email || "",
        role: initialData.role || "Developer",
        experience: initialData.experience || 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submit = (e) => {
    e.preventDefault();

    // ✅ Create payload (NO developerID)
    if (!initialData) {
      const payload = {
        developerName: form.developerName,
        email: form.email,
        role: form.role,
        experience: Number(form.experience),
      };
      onSubmit(payload);
      return;
    }

    // ✅ Update payload (include developerID)
    const payload = {
      developerID: form.developerID,
      developerName: form.developerName,
      email: form.email,
      role: form.role,
      experience: Number(form.experience),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="card">
      <h3>{initialData ? "Edit Developer" : "Add Developer"}</h3>

      <input
        name="developerName"
        placeholder="Name"
        value={form.developerName}
        onChange={handleChange}
        disabled={readOnly}
        required
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        disabled={readOnly}
        required
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        disabled={readOnly}
      >
        <option value="Admin">Admin</option>
        <option value="Developer">Developer</option>
        <option value="ReadOnly">ReadOnly</option>
      </select>

      <input
        type="number"
        name="experience"
        placeholder="Experience"
        value={form.experience}
        onChange={handleChange}
        disabled={readOnly}
      />

      {!readOnly && (
        <button type="submit" className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
          Save
        </button>
      )}
    </form>
  );
};

export default DeveloperForm;
