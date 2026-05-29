import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const TrainerProfile = () => {
  const { id } = useParams();

  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] =
    useState("details");

  const {
    data: trainers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainers"],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/trainers`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch trainers"
        );
      }

      return res.json();
    },
  });

  const trainer = trainers.find(
    (t) => t.id === Number(id)
  );

  if (isLoading) {
    return (
      <div className="p-6">
        Loading trainer...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load trainer
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="p-6">
        Trainer not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-bold">
          {trainer.name}
        </h1>

        <p className="text-gray-500 mt-2">
          {
            trainer.specialization
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() =>
            setActiveTab(
              "details"
            )
          }
          className={`px-4 py-2 rounded-xl ${
            activeTab ===
            "details"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Details
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "members"
            )
          }
          className={`px-4 py-2 rounded-xl ${
            activeTab ===
            "members"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Assigned Members
        </button>
      </div>

      {/* DETAILS TAB */}
      {activeTab ===
        "details" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">
                Name
              </p>

              <p className="font-medium">
                {trainer.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Phone
              </p>

              <p className="font-medium">
                {trainer.phone ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Email
              </p>

              <p className="font-medium">
                {trainer.email ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Specialization
              </p>

              <p className="font-medium">
                {trainer.specialization ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Status
              </p>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  trainer.status ===
                  "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {
                  trainer.status
                }
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Joined
              </p>

              <p className="font-medium">
                {trainer.joined
                  ? new Date(
                      trainer.joined
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab ===
        "members" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              No Assigned
              Members
            </h3>

            <p className="text-gray-500">
              Trainer-member
              assignments will
              be added in a
              future update.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;