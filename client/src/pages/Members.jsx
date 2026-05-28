import React, { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Members = () => {
  // Backend URL
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Search State
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    plan: "Monthly",
    status: "Active",
    joined: "",
  });

  // Fetch Members
  const {
    data: members = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["members"],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/members`
      );

      return res.json();
    },
  });

  // Status Badge Colors
  const getStatusColor = (status) => {
    if (status === "Active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Inactive") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // Search Filter
  const filteredMembers = members.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Member
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(
        `${API_URL}/api/members`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      // Refetch Members
      await refetch();

      // Reset Form
      setFormData({
        name: "",
        plan: "Monthly",
        status: "Active",
        joined: "",
      });

      // Close Modal
      setIsModalOpen(false);
    } catch (err) {
      console.error(
        "Error adding member:",
        err
      );
    }
  };

  // Delete Member
  const deleteMember = async (id) => {
    try {
      await fetch(
        `${API_URL}/api/members/${id}`,
        {
          method: "DELETE",
        }
      );

      // Refetch Members
      await refetch();
    } catch (err) {
      console.error(
        "Error deleting member:",
        err
      );
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-6">
        Loading members...
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading members
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Members
          </h1>

          <p className="text-gray-500 mt-1">
            Manage gym members and plans
          </p>
        </div>

        {/* Add Member Button */}
        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          + Add Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-100 border-b text-sm font-semibold text-gray-600">
          <div>ID</div>
          <div>Name</div>
          <div>Plan</div>
          <div>Status</div>
          <div>Joined</div>
          <div className="text-right">
            Actions
          </div>
        </div>

        {/* Table Rows */}
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition"
            >
              {/* ID */}
              <div className="flex items-center">
                #{member.id}
              </div>

              {/* Name */}
              <div className="flex items-center font-medium">
                {member.name}
              </div>

              {/* Plan */}
              <div className="flex items-center">
                {member.plan}
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </div>

              {/* Joined */}
              <div className="flex items-center">
                {new Date(
                  member.joined
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() =>
                    deleteMember(member.id)
                  }
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-400">
            No members found
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Add Member
              </h2>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block mb-1 font-medium">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Plan */}
              <div>
                <label className="block mb-1 font-medium">
                  Plan
                </label>

                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Monthly">
                    Monthly
                  </option>

                  <option value="Quarterly">
                    Quarterly
                  </option>

                  <option value="Yearly">
                    Yearly
                  </option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                  <option value="Pending">
                    Pending
                  </option>
                </select>
              </div>

              {/* Joined Date */}
              <div>
                <label className="block mb-1 font-medium">
                  Joined Date
                </label>

                <input
                  type="date"
                  name="joined"
                  value={formData.joined}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;