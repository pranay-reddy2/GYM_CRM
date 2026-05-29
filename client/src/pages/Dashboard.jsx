import { useQuery } from "@tanstack/react-query";

import StatCard from "../components/StatCard";

import {
  Users,
  Activity,
  UserPlus,
  Plus,
  User,
  Target,
  Dumbbell,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const navigate =
    useNavigate();

  const {
    data: stats,
    isLoading,
  } = useQuery({
    queryKey: [
      "dashboard-stats",
    ],

    queryFn: () =>
      fetch(
        `${API_URL}/api/dashboard/stats`
      ).then((r) =>
        r.json()
      ),
  });

  const {
  data: atRiskMembers = [],
} = useQuery({
  queryKey: [
    "dashboard-at-risk",
  ],

  queryFn: () =>
    fetch(
      `${API_URL}/api/dashboard/at-risk`
    ).then((r) =>
      r.json()
    ),
});


  const {
    data: activity = [],
  } = useQuery({
    queryKey: [
      "dashboard-activity",
    ],

    queryFn: () =>
      fetch(
        `${API_URL}/api/dashboard/activity`
      ).then((r) =>
        r.json()
      ),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(
                "/members"
              )
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Member
          </button>

          <button
            onClick={() =>
              navigate(
                "/leads"
              )
            }
            className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Target size={18} />
            Lead
          </button>

          <button
            onClick={() =>
              navigate(
                "/trainers"
              )
            }
            className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Dumbbell
              size={18}
            />
            Trainer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Members"
          value={
            stats.totalMembers
          }
          icon={Users}
          color="border-blue-500"
        />

        <StatCard
          title="Active Members"
          value={
            stats.activeMembers
          }
          icon={Activity}
          color="border-green-500"
        />

        <StatCard
          title="New Leads"
          value={
            stats.totalLeads
          }
          icon={UserPlus}
          color="border-yellow-500"
        />

        <StatCard
          title="Active Check-ins"
          value={
            stats.activeCheckins
          }
          icon={Activity}
          color="border-red-500"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {activity.length >
            0 ? (
              activity.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="flex items-center gap-3 border-b pb-3"
                  >
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User
                        size={
                          16
                        }
                      />
                    </div>

                    <div>
                      <p className="font-medium">
                        {
                          item.member_name
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        Checked
                        in
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-500">
                No recent
                activity
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() =>
                navigate(
                  "/members"
                )
              }
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              Add Member
            </button>

            <button
              onClick={() =>
                navigate(
                  "/checkins"
                )
              }
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              Check-ins
            </button>

            <button
              onClick={() =>
                navigate(
                  "/leads"
                )
              }
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              Leads
            </button>

            <button
              onClick={() =>
                navigate(
                  "/trainers"
                )
              }
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              Trainers
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold">
      At-Risk Members
    </h2>

    <span className="text-sm text-gray-500">
      Top 5
    </span>
  </div>

  {atRiskMembers.length >
  0 ? (
    <div className="space-y-3">
      {atRiskMembers.map(
        (member) => (
          <div
            key={member.id}
            onClick={() =>
              navigate(
                `/members/${member.id}`
              )
            }
            className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:bg-gray-50"
          >
            <div>
              <h3 className="font-semibold">
                {member.name}
              </h3>

              <p className="text-sm text-gray-500">
                {member.days_inactive}{" "}
                days inactive
              </p>
            </div>

            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              At Risk
            </span>
          </div>
        )
      )}
    </div>
  ) : (
    <div className="text-center text-gray-500 py-8">
      No at-risk members 🎉
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default Dashboard;