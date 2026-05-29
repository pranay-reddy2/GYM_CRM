import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Image,
  Database,
  ShieldAlert,
} from "lucide-react";

const Settings = () => {
  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] =
    useState({
      gym_name: "",
      phone: "",
      email: "",
      address: "",
      logo_url: "",
    });

  const {
    data: settings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["settings"],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/settings`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch settings"
        );
      }

      return res.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        gym_name:
          settings.gym_name || "",
        phone:
          settings.phone || "",
        email:
          settings.email || "",
        address:
          settings.address || "",
        logo_url:
          settings.logo_url || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_URL}/api/settings`,
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

      if (!res.ok) {
        throw new Error(
          "Failed to update settings"
        );
      }

      await refetch();

      alert(
        "Settings updated successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update settings"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading settings...
      </div>
    );
  }

  return (
  <div className="p-6 max-w-6xl mx-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        Settings
      </h1>

      <p className="text-gray-500 mt-1">
        Manage your gym CRM
        configuration
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
        {/* General */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 />
            <h2 className="text-xl font-bold">
              General
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2 font-medium">
                Gym Name
              </label>

              <input
                type="text"
                name="gym_name"
                value={
                  formData.gym_name
                }
                onChange={
                  handleChange
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Address
              </label>

              <textarea
                rows={4}
                name="address"
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Logo URL
              </label>

              <input
                type="text"
                name="logo_url"
                value={
                  formData.logo_url
                }
                onChange={
                  handleChange
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Future Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database />
            <h2 className="text-xl font-bold">
              System Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border rounded-xl p-4">
              <div>
                <h3 className="font-semibold">
                  Auto WhatsApp
                  Receipts
                </h3>

                <p className="text-sm text-gray-500">
                  Coming soon
                </p>
              </div>

              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                Planned
              </span>
            </div>

            <div className="flex justify-between items-center border rounded-xl p-4">
              <div>
                <h3 className="font-semibold">
                  Membership
                  Expiry Rules
                </h3>

                <p className="text-sm text-gray-500">
                  Coming soon
                </p>
              </div>

              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                Planned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">
        {/* Gym Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">
            Gym Overview
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Building2
                size={18}
              />
              <span>
                {formData.gym_name ||
                  "Not Set"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                size={18}
              />
              <span>
                {formData.phone ||
                  "Not Set"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail
                size={18}
              />
              <span>
                {formData.email ||
                  "Not Set"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin
                size={18}
              />
              <span>
                {formData.address ||
                  "Not Set"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Image
                size={18}
              />
              <span>
                {formData.logo_url
                  ? "Logo Added"
                  : "No Logo"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full border rounded-xl p-3 text-left hover:bg-gray-50">
              Export Members
            </button>

            <button className="w-full border rounded-xl p-3 text-left hover:bg-gray-50">
              Export Leads
            </button>

            <button className="w-full border rounded-xl p-3 text-left hover:bg-gray-50">
              Export Payments
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert
              className="text-red-600"
            />

            <h2 className="font-bold text-red-700">
              Danger Zone
            </h2>
          </div>

          <p className="text-sm text-red-600 mb-4">
            Destructive actions
            should be placed here.
          </p>

          <button
            disabled
            className="w-full bg-red-200 text-red-700 py-3 rounded-xl cursor-not-allowed"
          >
            Reset CRM
            (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Settings;