import React from "react";

import { useQuery } from "@tanstack/react-query";

import {
  AlertTriangle,
  Flame,
  Clock3,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Alerts = () => {
  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  // Fetch At-Risk Members
  const {
    data: alerts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["alerts"],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/alerts/at-risk`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch alerts"
        );
      }

      return res.json();
    },
  });

  // Risk Badge
  const getRiskLevel = (days) => {
    if (days >= 30) {
      return {
        label: "High Risk",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (days >= 20) {
      return {
        label: "Medium Risk",
        className:
          "bg-orange-100 text-orange-700",
      };
    }

    return {
      label: "Low Risk",
      className:
        "bg-yellow-100 text-yellow-700",
    };
  };

  // Navigate To AI Composer
  const handleGenerateMessage = (
    memberId
  ) => {
    navigate(
      `/ai-composer?memberId=${memberId}&situation=inactive_member`
    );
  };

  // Loading
  if (isLoading) {
    return (
      <div className="p-6">
        Loading alerts...
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading alerts
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 text-red-700 p-3 rounded-xl">
            <AlertTriangle size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Churn Risk Alerts
            </h1>

            <p className="text-gray-500 mt-1">
              Members at risk of
              becoming inactive
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {alerts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 text-green-700 p-4 rounded-full">
              <Flame size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold">
            No At-Risk Members
          </h2>

          <p className="text-gray-500 mt-2">
            Everyone is actively
            checking in 🎉
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {alerts.map((member) => {
            const risk =
              getRiskLevel(
                Number(
                  member.days_inactive
                )
              );

            return (
              <div
                key={member.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
              >
                {/* Top */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold">
                      {member.name}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {member.plan} Plan
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${risk.className}`}
                  >
                    {risk.label}
                  </span>
                </div>

                {/* Inactive */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Clock3 size={16} />

                    <span className="text-sm">
                      Days Inactive
                    </span>
                  </div>

                  <h3 className="text-5xl font-bold">
                    {member.days_inactive ||
                      "N/A"}
                  </h3>
                </div>

                {/* Last Checkin */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500">
                    Last Check-in
                  </p>

                  <p className="font-medium mt-1">
                    {member.last_checkin
                      ? new Date(
                          member.last_checkin
                        ).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() =>
                    handleGenerateMessage(
                      member.id
                    )
                  }
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition flex items-center justify-center gap-2 font-medium"
                >
                  <Sparkles size={18} />
                  Generate AI Message
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;