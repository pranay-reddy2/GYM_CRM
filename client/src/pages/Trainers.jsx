import { useState } from "react";

import {
  Trash2,
  X,
  Pencil,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

const Trainers = () => {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] =
    useState("");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [selectedTrainer, setSelectedTrainer] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      email: "",
      specialization: "",
      status: "Active",
    });

  const {
    data: trainers = [],
    isLoading,
    isError,
    refetch,
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

  const getStatusColor = (
    status
  ) => {
    if (status === "Active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-red-100 text-red-700";
  };

  const filteredTrainers =
    trainers.filter((trainer) =>
      trainer.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleEdit = (
    trainer
  ) => {
    setSelectedTrainer(trainer);

    setFormData({
      name: trainer.name,
      phone:
        trainer.phone || "",
      email:
        trainer.email || "",
      specialization:
        trainer.specialization ||
        "",
      status:
        trainer.status ||
        "Active",
    });

    setIsEditMode(true);

    setIsModalOpen(true);
  };

  const resetModalState = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      specialization: "",
      status: "Active",
    });

    setSelectedTrainer(null);

    setIsEditMode(false);

    setIsModalOpen(false);
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      if (
        isEditMode &&
        selectedTrainer
      ) {
        await fetch(
          `${API_URL}/api/trainers/${selectedTrainer.id}`,
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
      } else {
        await fetch(
          `${API_URL}/api/trainers`,
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

      await refetch();

      resetModalState();
    } catch (err) {
      console.error(
        "Error saving trainer:",
        err
      );
    }
  };

  const deleteTrainer =
    async (id) => {
      try {
        await fetch(
          `${API_URL}/api/trainers/${id}`,
          {
            method: "DELETE",
          }
        );

        await refetch();
      } catch (err) {
        console.error(
          "Error deleting trainer:",
          err
        );
      }
    };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading trainers...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading trainers
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Trainers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage gym trainers
          </p>
        </div>

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
        >
          + Add Trainer
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search trainers..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-100 border-b text-sm font-semibold text-gray-600">
          <div>Name</div>
          <div>
            Specialization
          </div>
          <div>Phone</div>
          <div>Status</div>
          <div className="text-right">
            Actions
          </div>
        </div>

        {filteredTrainers.length >
        0 ? (
          filteredTrainers.map(
            (trainer) => (
              <div
                key={trainer.id}
                onClick={() =>
                  navigate(
                    `/trainers/${trainer.id}`
                  )
                }
                className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="font-medium">
                  {trainer.name}
                </div>

                <div>
                  {
                    trainer.specialization
                  }
                </div>

                <div>
                  {trainer.phone}
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      trainer.status
                    )}`}
                  >
                    {trainer.status}
                  </span>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      handleEdit(
                        trainer
                      );
                    }}
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                  >
                    <Pencil
                      size={18}
                    />
                  </button>

                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      deleteTrainer(
                        trainer.id
                      );
                    }}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600"
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
            No trainers found
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {isEditMode
                  ? "Edit Trainer"
                  : "Add Trainer"}
              </h2>

              <button
                onClick={
                  resetModalState
                }
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={
                    formData.specialization
                  }
                  onChange={
                    handleChange
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={
                    resetModalState
                  }
                  className="px-4 py-2 border border-gray-300 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl"
                >
                  {isEditMode
                    ? "Update Trainer"
                    : "Add Trainer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainers;