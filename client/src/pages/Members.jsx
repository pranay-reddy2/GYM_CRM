import { useState } from "react";

import {
  Trash2,
  X,
  Pencil,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

const Members = () => {
  // Navigation
  const navigate = useNavigate();

  // Backend URL
  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  // Search State
  const [search, setSearch] =
    useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // Edit Mode
  const [isEditMode, setIsEditMode] =
    useState(false);

  const [selectedMember, setSelectedMember] =
    useState(null);

  // Form State
  const [formData, setFormData] =
    useState({
      name: "",
      plan: "Monthly",
      status: "Active",
      joined: "",

      phone: "",
      email: "",
      address: "",
      date_of_birth: "",
      gender: "",
      emergency_contact: "",
      goal: "",
    });

  //
  // FETCH MEMBERS
  //
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

      if (!res.ok) {
        throw new Error(
          "Failed to fetch members"
        );
      }

      return res.json();
    },
  });

  //
  // STATUS COLORS
  //
  const getStatusColor = (
    status
  ) => {
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

  //
  // SEARCH FILTER
  //
  const filteredMembers =
    members.filter((member) =>
      member.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  //
  // HANDLE INPUT CHANGE
  //
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  //
  // HANDLE EDIT
  //
  const handleEdit = (
    member
  ) => {
    setSelectedMember(member);

    setFormData({
      name: member.name,
      plan: member.plan,
      status: member.status,
      joined: member.joined,

      phone: member.phone || "",
      email: member.email || "",
      address:
        member.address || "",

      date_of_birth:
        member.date_of_birth || "",

      gender:
        member.gender || "",

      emergency_contact:
        member.emergency_contact ||
        "",

      goal: member.goal || "",
    });

    setIsEditMode(true);

    setIsModalOpen(true);
  };

  //
  // RESET MODAL
  //
  const resetModalState = () => {
    setFormData({
      name: "",
      plan: "Monthly",
      status: "Active",
      joined: "",

      phone: "",
      email: "",
      address: "",
      date_of_birth: "",
      gender: "",
      emergency_contact: "",
      goal: "",
    });

    setIsEditMode(false);

    setSelectedMember(null);

    setIsModalOpen(false);
  };

  //
  // HANDLE SUBMIT
  //
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      // EDIT MODE
      if (
        isEditMode &&
        selectedMember
      ) {
        await fetch(
          `${API_URL}/api/members/${selectedMember.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );
      }

      // ADD MODE
      else {
        await fetch(
          `${API_URL}/api/members`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );
      }

      // Refetch Members
      await refetch();

      // Reset Modal
      resetModalState();
    } catch (err) {
      console.error(
        "Error saving member:",
        err
      );
    }
  };

  //
  // DELETE MEMBER
  //
  const deleteMember = async (
    id
  ) => {
    try {
      await fetch(
        `${API_URL}/api/members/${id}`,
        {
          method: "DELETE",
        }
      );

      await refetch();
    } catch (err) {
      console.error(
        "Error deleting member:",
        err
      );
    }
  };

  //
  // LOADING
  //
  if (isLoading) {
    return (
      <div className="p-6">
        Loading members...
      </div>
    );
  }

  //
  // ERROR
  //
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
            Manage gym members and
            memberships
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          + Add Member
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
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
        {filteredMembers.length >
        0 ? (
          filteredMembers.map(
            (member) => (
              <div
                key={member.id}
                onClick={() =>
                  navigate(
                    `/members/${member.id}`
                  )
                }
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
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
                  ).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  {/* Edit */}
                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      handleEdit(
                        member
                      );
                    }}
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                  >
                    <Pencil
                      size={18}
                    />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      deleteMember(
                        member.id
                      );
                    }}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                  >
                    <Trash2
                      size={18}
                    />
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <div className="p-10 text-center text-gray-400">
            No members found
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {isEditMode
                  ? "Edit Member"
                  : "Add Member"}
              </h2>

              <button
                onClick={
                  resetModalState
                }
                className="text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block mb-1 font-medium">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-1 font-medium">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
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
                    value={
                      formData.plan
                    }
                    onChange={
                      handleChange
                    }
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
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
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

                {/* Joined */}
                <div>
                  <label className="block mb-1 font-medium">
                    Joined Date
                  </label>

                  <input
                    type="date"
                    name="joined"
                    value={
                      formData.joined
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block mb-1 font-medium">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={
                      formData.date_of_birth
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-1 font-medium">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      formData.gender
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Emergency */}
                <div>
                  <label className="block mb-1 font-medium">
                    Emergency Contact
                  </label>

                  <input
                    type="text"
                    name="emergency_contact"
                    value={
                      formData.emergency_contact
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Goal */}
                <div>
                  <label className="block mb-1 font-medium">
                    Fitness Goal
                  </label>

                  <select
                    name="goal"
                    value={
                      formData.goal
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">
                      Select Goal
                    </option>

                    <option value="Weight Loss">
                      Weight Loss
                    </option>

                    <option value="Muscle Gain">
                      Muscle Gain
                    </option>

                    <option value="General Fitness">
                      General Fitness
                    </option>

                    <option value="Flexibility">
                      Flexibility
                    </option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block mb-1 font-medium">
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={
                    resetModalState
                  }
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
                >
                  {isEditMode
                    ? "Update Member"
                    : "Add Member"}
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