import React, { useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Plus,
  Clock,
  X,
  Search,
  Trash2,
  Users,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Loader2,
} from "lucide-react";

// ── Skeleton components ─────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

const SkeletonRow = () => (
  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b last:border-b-0">
    <div className="flex items-center gap-3">
      <Skeleton className="w-11 h-11 rounded-full" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <div className="flex items-center"><Skeleton className="h-6 w-20" /></div>
    <div className="flex items-center"><Skeleton className="h-6 w-16" /></div>
    <div className="flex items-center"><Skeleton className="h-5 w-14" /></div>
    <div className="flex items-center"><Skeleton className="h-5 w-14" /></div>
    <div className="flex items-center justify-end gap-2">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-9" />
    </div>
  </div>
);
// ───────────────────────────────────────────────────────────────

const Checkins = () => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState({ memberName: "", time: "" });

  // ── Queries ─────────────────────────────────────────────────────
  const {
    data: checkins = [],
    isLoading: isLoadingCheckins,
  } = useQuery({
    queryKey: ["checkins"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/checkins`);
      if (!res.ok) throw new Error("Failed to fetch check-ins");
      return res.json();
    },
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/members`);
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json();
    },
  });
  // ───────────────────────────────────────────────────────────────

  // ── Mutations ───────────────────────────────────────────────────
  const addCheckinMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/api/checkins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add check-in");
      return res.json();
    },
    onSuccess: (newCheckin) => {
      // Prepend the new check-in into the cached list immediately
      queryClient.setQueryData(["checkins"], (prev = []) => [newCheckin, ...prev]);
      setFormData({ memberName: "", time: "" });
      setIsModalOpen(false);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({ id, check_out }) => {
      const res = await fetch(`${API_URL}/api/checkins/${id}/checkout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ check_out }),
      });
      if (!res.ok) throw new Error("Failed to check out");
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["checkins"], (prev = []) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/api/checkins/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete check-in");
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["checkins"], (prev = []) =>
        prev.filter((c) => c.id !== id)
      );
    },
  });
  // ───────────────────────────────────────────────────────────────

  const openModal = () => {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setFormData({ memberName: "", time: currentTime });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alreadyCheckedIn = checkins.some(
      (c) => c.member_name === formData.memberName && !c.check_out
    );
    if (alreadyCheckedIn) {
      alert("This member is already checked in.");
      return;
    }

    const selectedMember = members.find((m) => m.name === formData.memberName);
    const hour = Number(formData.time.split(":")[0]);
    const status = hour >= 10 ? "Late" : "On Time";

    addCheckinMutation.mutate({
      member_name: formData.memberName,
      membership: selectedMember?.membership || "Standard",
      check_in: formData.time,
      status,
    });
  };

  const handleCheckout = (id) => {
    const check_out = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    checkoutMutation.mutate({ id, check_out });
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(`2026-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    if (status === "On Time") return "bg-green-100 text-green-700";
    if (status === "Late") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const filteredCheckins = useMemo(() => {
    return [...checkins]
      .filter((c) => {
        const matchesSearch = c.member_name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.check_in.localeCompare(a.check_in));
  }, [checkins, search, statusFilter]);

  const totalCheckins = checkins.length;
  const activeMembers = checkins.filter((c) => !c.check_out).length;
  const checkedOutMembers = checkins.filter((c) => c.check_out).length;
  const lateCount = checkins.filter((c) => c.status === "Late").length;

  const isSubmitting = addCheckinMutation.isPending;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Today's Check-ins</h1>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {totalCheckins} Total
            </span>
          </div>
          <p className="text-gray-500 mt-2">
            Track member attendance and gym activity
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Log Check-in
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Check-ins</p>
              <h2 className="text-3xl font-bold mt-1">{totalCheckins}</h2>
            </div>
            <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Inside</p>
              <h2 className="text-3xl font-bold mt-1">{activeMembers}</h2>
            </div>
            <div className="bg-green-100 text-green-700 p-3 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Checked Out</p>
              <h2 className="text-3xl font-bold mt-1">{checkedOutMembers}</h2>
            </div>
            <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">
              <LogOut size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Late Arrivals</p>
              <h2 className="text-3xl font-bold mt-1">{lateCount}</h2>
            </div>
            <div className="bg-red-100 text-red-700 p-3 rounded-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="All">All Statuses</option>
            <option value="On Time">On Time</option>
            <option value="Late">Late</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-100 border-b text-sm font-semibold text-gray-600">
          <div>Member</div>
          <div>Membership</div>
          <div>Status</div>
          <div>Check-in</div>
          <div>Check-out</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        {isLoadingCheckins ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filteredCheckins.length > 0 ? (
          filteredCheckins.map((checkin) => {
            const isCheckingOut =
              checkoutMutation.isPending &&
              checkoutMutation.variables?.id === checkin.id;
            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables === checkin.id;
            const isRowBusy = isCheckingOut || isDeleting;

            return (
              <div
                key={checkin.id}
                className={`grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b last:border-b-0 transition ${
                  isRowBusy
                    ? "opacity-60 pointer-events-none"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Member */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                    {checkin.member_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{checkin.member_name}</h3>
                    <p className="text-sm text-gray-500">Gym Member</p>
                  </div>
                </div>

                {/* Membership */}
                <div className="flex items-center">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                    {checkin.membership}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      checkin.status
                    )}`}
                  >
                    {checkin.status}
                  </span>
                </div>

                {/* Check-in */}
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="font-medium">{formatTime(checkin.check_in)}</span>
                </div>

                {/* Check-out */}
                <div className="flex items-center">
                  {checkin.check_out ? (
                    <span className="font-medium text-gray-700">
                      {formatTime(checkin.check_out)}
                    </span>
                  ) : (
                    <span className="text-orange-500 text-sm font-medium">
                      Still Active
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCheckout(checkin.id)}
                    disabled={!!checkin.check_out || isRowBusy}
                    className="px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium flex items-center gap-1.5 min-w-[96px] justify-center"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving…
                      </>
                    ) : checkin.check_out ? (
                      "Checked Out"
                    ) : (
                      "Check Out"
                    )}
                  </button>

                  <button
                    onClick={() => deleteMutation.mutate(checkin.id)}
                    disabled={isRowBusy}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-gray-400">
            No check-ins found
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Log Check-in</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-black disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Member</label>
                <select
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Check-in Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[130px] justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Check-in"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkins;