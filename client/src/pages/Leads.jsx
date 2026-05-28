import React, { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

const Leads = () => {
  // Backend URL
  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  // Stages
  const stages = [
    "New",
    "Contacted",
    "Trial",
    "Converted",
  ];

  // Modal State
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    stage: "New",
  });

  // Stage Colors
  const stageColors = {
    New: "bg-blue-100 text-blue-700",

    Contacted:
      "bg-yellow-100 text-yellow-700",

    Trial:
      "bg-purple-100 text-purple-700",

    Converted:
      "bg-green-100 text-green-700",
  };

  // Fetch Leads
  const {
    data: leads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["leads"],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/leads`
      );

      return res.json();
    },
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Lead
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(
        `${API_URL}/api/leads`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      // Refetch Leads
      await refetch();

      // Reset Form
      setFormData({
        name: "",
        source: "",
        stage: "New",
      });

      // Close Modal
      setIsModalOpen(false);
    } catch (err) {
      console.error(
        "Error adding lead:",
        err
      );
    }
  };

  // Move Lead
  const moveLead = async (
    leadId,
    direction
  ) => {
    try {
      const lead = leads.find(
        (l) => l.id === leadId
      );

      if (!lead) return;

      const currentStageIndex =
        stages.indexOf(lead.stage);

      let newStageIndex =
        currentStageIndex;

      if (direction === "forward") {
        newStageIndex =
          currentStageIndex + 1;
      }

      if (direction === "back") {
        newStageIndex =
          currentStageIndex - 1;
      }

      // Prevent Invalid Stage
      if (
        newStageIndex < 0 ||
        newStageIndex >= stages.length
      ) {
        return;
      }

      const newStage =
        stages[newStageIndex];

      // API Call
      await fetch(
        `${API_URL}/api/leads/${leadId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            stage: newStage,
          }),
        }
      );

      // Refetch Leads
      await refetch();
    } catch (err) {
      console.error(
        "Error moving lead:",
        err
      );
    }
  };

  // Delete Lead
  const deleteLead = async (id) => {
    try {
      await fetch(
        `${API_URL}/api/leads/${id}`,
        {
          method: "DELETE",
        }
      );

      // Refetch Leads
      await refetch();
    } catch (err) {
      console.error(
        "Error deleting lead:",
        err
      );
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-6">
        Loading leads...
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading leads
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Leads Pipeline
          </h1>

          <p className="text-gray-500 mt-1">
            Track and manage leads
          </p>
        </div>

        {/* Add Lead Button */}
        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const stageLeads = leads.filter(
            (lead) => lead.stage === stage
          );

          return (
            <div
              key={stage}
              className="bg-white rounded-2xl shadow-sm border border-gray-200"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">
                    {stage}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {stageLeads.length} Leads
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${stageColors[stage]}`}
                >
                  {stage}
                </span>
              </div>

              {/* Cards */}
              <div className="p-4 space-y-4 min-h-[400px]">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    {/* Lead Info */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">
                        {lead.name}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {lead.source}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      {/* Move Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            moveLead(
                              lead.id,
                              "back"
                            )
                          }
                          disabled={
                            lead.stage === "New"
                          }
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft
                            size={18}
                          />
                        </button>

                        <button
                          onClick={() =>
                            moveLead(
                              lead.id,
                              "forward"
                            )
                          }
                          disabled={
                            lead.stage ===
                            "Converted"
                          }
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronRight
                            size={18}
                          />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          deleteLead(lead.id)
                        }
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {stageLeads.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400">
                    No leads here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Add Lead
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

              {/* Source */}
              <div>
                <label className="block mb-1 font-medium">
                  Source
                </label>

                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Stage */}
              <div>
                <label className="block mb-1 font-medium">
                  Stage
                </label>

                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {stages.map((stage) => (
                    <option
                      key={stage}
                      value={stage}
                    >
                      {stage}
                    </option>
                  ))}
                </select>
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
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;