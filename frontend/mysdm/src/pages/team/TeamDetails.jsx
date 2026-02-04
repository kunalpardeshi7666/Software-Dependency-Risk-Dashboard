import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { teamApi } from "../../api/teamApi";
import { useAuth } from "../../context/AuthContext";


export default function TeamDetails() {
  const { id } = useParams(); // ✅ userID
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "Admin";
  const readOnly = user?.role === "Tester";

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMember = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getById(id);
      setMember(res.data);
    } catch {
      toast.error("Failed to load member details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember();
  }, [id]);

  const deleteMember = async () => {
    if (!isAdmin) return toast.error("Only Admin can delete member");
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await teamApi.remove(id);
      toast.success("Member deleted");
      navigate("/team");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="bg-white p-4 rounded shadow">Loading...</div>;
  if (!member) return <div className="bg-white p-4 rounded shadow">Member not found</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Team Member Details</h2>
          <p className="text-sm text-gray-600">User ID: {member.userID}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/team")}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            Back
          </button>

          {!readOnly && (
            <EditProfileModal
              member={member}
              user={user}
              onUpdated={loadMember}
            />
          )}

          {isAdmin && (
            <ResetPasswordModal member={member} />
          )}

          {isAdmin && (
            <button
              onClick={deleteMember}
              className="border px-4 py-2 rounded text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded shadow p-4 space-y-2">
        <DetailRow label="Full Name" value={member.fullName || "-"} />
        <DetailRow label="Email" value={member.email || "-"} />
        <DetailRow label="Role" value={member.role || "-"} />
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded shadow p-4 space-y-2">
        <h3 className="font-bold text-lg">Profile</h3>

        <DetailRow label="Mobile" value={member.mobileNumber || "-"} />
        <DetailRow label="Age" value={member.age ?? "-"} />
        <DetailRow label="Experience (Years)" value={member.experienceYears ?? "-"} />
        <DetailRow label="Technical Skills" value={member.technicalSkills || "-"} />
        <DetailRow
          label="Join Date"
          value={member.joinDate ? member.joinDate.slice(0, 10) : "-"}
        />
        <DetailRow label="Self Introduction" value={member.selfIntroduction || "-"} />
      </div>
    </div>
  );
}

/* ===========================
   Edit Profile Modal
=========================== */
function EditProfileModal({ member, user, onUpdated }) {
  const isAdmin = user?.role === "Admin";

  // ✅ If you have logged in userId save it in auth context
  // const isSelf = user?.userID === member.userID;
  // const canEdit = isAdmin || isSelf;
  const canEdit = isAdmin || user?.role === "Developer";

  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState(member.fullName || "");
  const [mobileNumber, setMobileNumber] = useState(member.mobileNumber || "");
  const [age, setAge] = useState(member.age ?? "");
  const [experienceYears, setExperienceYears] = useState(member.experienceYears ?? "");
  const [technicalSkills, setTechnicalSkills] = useState(member.technicalSkills || "");
  const [selfIntroduction, setSelfIntroduction] = useState(member.selfIntroduction || "");
  
const [joinDate, setJoinDate] = useState(
  member.joinDate ? member.joinDate.slice(0, 10) : ""
);

  const submit = async () => {
    if (!canEdit) return toast.error("You cannot edit this profile");
    if (!fullName.trim()) return toast.error("Full name required");

    try {
      await teamApi.updateProfile(member.userID, {
  FullName: fullName.trim(),
  MobileNumber: mobileNumber.trim(),
  Age: age === "" ? null : Number(age),
  ExperienceYears: experienceYears === "" ? null : Number(experienceYears),
  TechnicalSkills: technicalSkills.trim(),
  SelfIntroduction: selfIntroduction.trim(),

  // ✅ joinDate must be ISO string or null
  JoinDate: joinDate ? new Date(joinDate).toISOString() : null
});


      toast.success("Profile updated");
      setOpen(false);
      onUpdated();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-900 text-white px-4 py-2 rounded"
      >
        Edit Profile
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-2xl p-4 space-y-3">
            <h3 className="text-lg font-bold">Edit Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="border rounded px-3 py-2 w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
              />

              <input
                className="border rounded px-3 py-2 w-full"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Mobile Number"
              />

              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
              />

              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="Experience Years"
              />

              <input
                type="date"
                className="border rounded px-3 py-2 w-full"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
              />

              <input
                className="border rounded px-3 py-2 w-full"
                value={technicalSkills}
                onChange={(e) => setTechnicalSkills(e.target.value)}
                placeholder="Skills (React, .NET, MongoDB)"
              />
            </div>

            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={4}
              value={selfIntroduction}
              onChange={(e) => setSelfIntroduction(e.target.value)}
              placeholder="Self Introduction"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={submit} className="bg-gray-900 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ===========================
   Reset Password Modal (Admin)
=========================== */
function ResetPasswordModal({ member }) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submit = async () => {
    if (!newPassword.trim()) return toast.error("Password required");
    if (newPassword.length < 6) return toast.error("Minimum 6 characters required");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    try {
      await teamApi.resetPassword(member.userID, { newPassword });
      toast.success("Password reset successful");
      setOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Reset password failed");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border px-4 py-2 rounded hover:bg-gray-50"
      >
        Reset Password
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
            <h3 className="text-lg font-bold">Reset Password</h3>

            <p className="text-sm text-gray-600">
              Reset password for: <b>{member.fullName}</b>
            </p>

            <input
              type="password"
              className="border rounded px-3 py-2 w-full"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              className="border rounded px-3 py-2 w-full"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={submit} className="bg-gray-900 text-white px-4 py-2 rounded">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ===========================
   UI Helper
=========================== */
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <p className="text-gray-600">{label}</p>
      <p className="font-semibold text-right">{value}</p>
    </div>
  );
}
