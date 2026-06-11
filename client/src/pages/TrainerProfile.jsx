import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  UserPlus,
  Trash2,
} from "lucide-react";

const TrainerProfile = () => {
  const { id } = useParams();

  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] =
    useState("details");

  const queryClient =
    useQueryClient();

  const [
    isAssignModalOpen,
    setIsAssignModalOpen,
  ] = useState(false);

  const [
    selectedMemberId,
    setSelectedMemberId,
  ] = useState("");
  //
  // TRAINER
  //
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

  //
  // ASSIGNED MEMBERS
  //
  const {
    data: assignedMembers = [],
    isLoading:
    membersLoading,
  } = useQuery({
    queryKey: [
      "trainer-members",
      id,
    ],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/trainer-members/${id}`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch assigned members"
        );
      }

      return res.json();
    },
  });
  const {
    data: allMembers = [],
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

  const trainer =
    trainers.find(
      (t) =>
        t.id === Number(id)
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
  const availableMembers =
    allMembers.filter(
      (member) =>
        !assignedMembers.some(
          (assigned) =>
            assigned.id === member.id
        )
    );
  const assignMember =
    async () => {
      if (!selectedMemberId)
        return;

      try {
        const res =
          await fetch(
            `${API_URL}/api/trainer-members`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                trainer_id:
                  Number(id),

                member_id:
                  Number(
                    selectedMemberId
                  ),
              }),
            }
          );

        if (!res.ok) {
          throw new Error(
            "Failed to assign member"
          );
        }

        queryClient.invalidateQueries(
          {
            queryKey: [
              "trainer-members",
              id,
            ],
          }
        );

        setSelectedMemberId(
          ""
        );

        setIsAssignModalOpen(
          false
        );
      } catch (err) {
        console.error(err);
      }
    };
  const removeMember =
    async (memberId) => {
      try {
        const res =
          await fetch(
            `${API_URL}/api/trainer-members/${id}/${memberId}`,
            {
              method:
                "DELETE",
            }
          );

        if (!res.ok) {
          throw new Error(
            "Failed to remove member"
          );
        }

        queryClient.invalidateQueries(
          {
            queryKey: [
              "trainer-members",
              id,
            ],
          }
        );
      } catch (err) {
        console.error(err);
      }
    };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {trainer.name}
            </h1>

            <p className="text-gray-500 mt-2">
              {
                trainer.specialization
              }
            </p>
          </div>

          <div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${trainer.status ===
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() =>
            setActiveTab(
              "details"
            )
          }
          className={`px-4 py-2 rounded-xl ${activeTab ===
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
          className={`px-4 py-2 rounded-xl ${activeTab ===
              "members"
              ? "bg-blue-600 text-white"
              : "bg-white border"
            }`}
        >
          Assigned Members (
          {
            assignedMembers.length
          }
          )
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
                  className={`px-3 py-1 rounded-full text-sm ${trainer.status ===
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

              <div>
                <p className="text-gray-500 text-sm">
                  Start Time
                </p>

                <p className="font-medium">
                  {trainer.start_time ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  End Time
                </p>

                <p className="font-medium">
                  {trainer.end_time ||
                    "-"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500 text-sm">
                  Working Days
                </p>

                <p className="font-medium">
                  {trainer.working_days ||
                    "-"}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* MEMBERS TAB */}
      {/* MEMBERS TAB */}
{activeTab === "members" && (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">
        Assigned Members
      </h2>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">
          Total: {assignedMembers.length}
        </div>

        <button
          onClick={() =>
            setIsAssignModalOpen(true)
          }
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          <UserPlus size={18} />
          Assign Member
        </button>
      </div>
    </div>

    {membersLoading ? (
      <div>Loading members...</div>
    ) : assignedMembers.length > 0 ? (
      <div className="space-y-4">
        {assignedMembers.map(
          (member) => (
            <div
              key={member.id}
              className="border border-gray-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">
                  {member.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Plan: {member.plan}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    member.status ===
                    "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {member.status}
                </span>

                <button
                  onClick={() =>
                    removeMember(
                      member.id
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    ) : (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold mb-2">
          No Assigned Members
        </h3>

        <p className="text-gray-500">
          Assign members to this
          trainer to track their
          clients.
        </p>
      </div>
    )}
  </div>
)}

{/* ASSIGN MEMBER MODAL */}
{isAssignModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        Assign Member
      </h2>

      <select
        value={selectedMemberId}
        onChange={(e) =>
          setSelectedMemberId(
            e.target.value
          )
        }
        className="w-full border rounded-xl px-4 py-3 mb-4"
      >
        <option value="">
          Select Member
        </option>

        {availableMembers.map(
          (member) => (
            <option
              key={member.id}
              value={member.id}
            >
              {member.name}
            </option>
          )
        )}
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={() =>
            setIsAssignModalOpen(
              false
            )
          }
          className="px-4 py-2 border rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={assignMember}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TrainerProfile;