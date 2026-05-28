import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  Sparkles,
  Copy,
  Loader2,
} from "lucide-react";

const AIComposer = () => {
  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  // Form State
  const [memberId, setMemberId] =
    useState("");

  const [situation, setSituation] =
    useState("welcome");

  const [customContext, setCustomContext] =
    useState("");

  // Generated Message
  const [message, setMessage] =
    useState("");

  // Loading
  const [isGenerating, setIsGenerating] =
    useState(false);

  // Fetch Members
  const {
    data: members = [],
    isLoading,
    isError,
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

  // Generate Message
  const generateAIMessage = async () => {
    if (!memberId || !situation) {
      alert(
        "Please select member and situation"
      );

      return;
    }

    try {
      setIsGenerating(true);

      const res = await fetch(
        `${API_URL}/api/ai/generate-message`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            memberId,
            situation,
            customContext,
          }),
        }
      );

      const data = await res.json();

      setMessage(data.message);
    } catch (err) {
      console.error(
        "Error generating message:",
        err
      );

      alert(
        "Failed to generate AI message"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Message
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        message
      );

      alert("Message copied!");
    } catch (err) {
      console.error(
        "Failed to copy:",
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
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">
              <Sparkles size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                AI Message Composer
              </h1>

              <p className="text-gray-500 mt-1">
                Generate smart member
                communication messages
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Member */}
          <div>
            <label className="block mb-2 font-medium">
              Select Member
            </label>

            <select
              value={memberId}
              onChange={(e) =>
                setMemberId(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">
                Select member
              </option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Situation */}
          <div>
            <label className="block mb-2 font-medium">
              Situation
            </label>

            <select
              value={situation}
              onChange={(e) =>
                setSituation(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="welcome">
                Welcome
              </option>

              <option value="inactive_member">
                Inactive Member
              </option>

              <option value="membership_expiring">
                Membership Expiring
              </option>

              <option value="custom">
                Custom
              </option>
            </select>
          </div>

          {/* Custom Context */}
          {situation === "custom" && (
            <div>
              <label className="block mb-2 font-medium">
                Custom Context
              </label>

              <textarea
                value={customContext}
                onChange={(e) =>
                  setCustomContext(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Enter custom instructions..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateAIMessage}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Message
              </>
            )}
          </button>
        </div>

        {/* Output */}
        {message && (
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Generated Message
            </h2>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              rows={8}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />

            {/* Actions */}
            <div className="flex justify-end mt-4">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-black transition"
              >
                <Copy size={18} />
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIComposer;