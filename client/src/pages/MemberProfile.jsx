import {
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  User,
  Clock3,
  CreditCard,
  Plus,
  X,
  MessageCircle,
} from "lucide-react";

const MemberProfile = () => {
  const API_URL =
    import.meta.env.VITE_BACKEND_URL;

  const GYM_NAME =
    "Elite Fitness Gym";

  const { id } = useParams();

  const queryClient =
    useQueryClient();

  // Tabs
  const [activeTab, setActiveTab] =
    useState("details");

  // Payment Modal
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // Payment Form
  const [paymentForm, setPaymentForm] =
    useState({
      amount: "",
      method: "Cash",
      date: new Date()
        .toISOString()
        .split("T")[0],
      note: "",
    });

  //
  // FETCH MEMBER
  //
  const {
    data: member,
    isLoading,
  } = useQuery({
    queryKey: ["member", id],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/members`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch member"
        );
      }

      const data =
        await res.json();

      return data.find(
        (m) =>
          m.id === Number(id)
      );
    },
  });

  //
  // FETCH PAYMENTS
  //
  const {
    data: payments = [],
  } = useQuery({
    queryKey: [
      "payments",
      id,
    ],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/payments/${id}`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch payments"
        );
      }

      return res.json();
    },
  });

  //
  // FETCH CHECKINS
  //
  const {
    data: checkins = [],
  } = useQuery({
    queryKey: [
      "checkins",
      id,
    ],

    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/checkins`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch check-ins"
        );
      }

      const data =
        await res.json();

      return data.filter(
        (c) =>
          c.member_name ===
          member?.name
      );
    },

    enabled: !!member,
  });

  //
  // ADD PAYMENT MUTATION
  //
  const addPaymentMutation =
    useMutation({
      mutationFn: async (
        payload
      ) => {
        const res = await fetch(
          `${API_URL}/api/payments`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to add payment"
          );
        }

        return res.json();
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "payments",
            id,
          ],
        });

        setIsModalOpen(false);

        setPaymentForm({
          amount: "",
          method: "Cash",
          date: new Date()
            .toISOString()
            .split("T")[0],
          note: "",
        });
      },
    });

  //
  // HANDLE PAYMENT SUBMIT
  //
  const handlePaymentSubmit = (
    e
  ) => {
    e.preventDefault();

    addPaymentMutation.mutate({
      member_id: member.id,

      member_name:
        member.name,

      amount:
        paymentForm.amount,

      method:
        paymentForm.method,

      date:
        paymentForm.date,

      note:
        paymentForm.note,
    });
  };

  //
  // SEND WHATSAPP BILL
  //
  const sendWhatsAppBill = (
    payment
  ) => {
    const date = new Date(
      payment.date
    );

    const period =
      date.toLocaleString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      );

    const message = `
🏋️ *${GYM_NAME.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
📄 *PAYMENT RECEIPT*
━━━━━━━━━━━━━━━━━━━━

*MEMBER DETAILS*
👤 Name: ${member.name}
📋 Plan: ${member.plan}

*PAYMENT DETAILS*
🧾 Receipt No: #PAY-${payment.id}
💰 Amount: ₹${payment.amount}
💳 Method: ${payment.method}
📅 Date: ${date.toLocaleDateString()}
🗓️ Period: ${period}
${
  payment.note
    ? `📝 Note: ${payment.note}`
    : ""
}

━━━━━━━━━━━━━━━━━━━━
✅ *TOTAL PAID: ₹${payment.amount}*
━━━━━━━━━━━━━━━━━━━━

Thank you for your payment! 🙏
Keep crushing your fitness goals! 💪

${GYM_NAME}
    `.trim();

    const phone =
      member.phone
        ? `91${member.phone}`
        : "";

    if (!phone) {
      alert(
        "Member phone number not available"
      );

      return;
    }

    const encoded =
      encodeURIComponent(
        message
      );

    window.open(
      `https://wa.me/${phone}?text=${encoded}`,
      "_blank"
    );
  };

  //
  // LOADING
  //
  if (isLoading || !member) {
    return (
      <div className="p-6">
        Loading member profile...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h1 className="text-3xl font-bold">
          {member.name}
        </h1>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {member.plan}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              member.status ===
              "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {member.status}
          </span>

          {member.goal && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              {member.goal}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() =>
            setActiveTab(
              "details"
            )
          }
          className={`px-5 py-3 rounded-xl font-medium transition ${
            activeTab ===
            "details"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <User size={18} />
            Details
          </div>
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "checkins"
            )
          }
          className={`px-5 py-3 rounded-xl font-medium transition ${
            activeTab ===
            "checkins"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock3 size={18} />
            Check-ins
          </div>
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "payments"
            )
          }
          className={`px-5 py-3 rounded-xl font-medium transition ${
            activeTab ===
            "payments"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CreditCard size={18} />
            Payments
          </div>
        </button>
      </div>

      {/* DETAILS TAB */}
      {activeTab ===
        "details" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">
                Member Name
              </p>

              <h2 className="text-xl font-semibold mt-1">
                {member.name}
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Membership Plan
              </p>

              <h2 className="text-xl font-semibold mt-1">
                {member.plan}
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              {member.phone ? (
                <a
                  href={`https://wa.me/91${member.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-semibold mt-1 block hover:underline"
                >
                  {member.phone}
                </a>
              ) : (
                <h2 className="text-lg font-semibold mt-1">
                  N/A
                </h2>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <h2 className="text-lg font-semibold mt-1">
                {member.email ||
                  "N/A"}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* CHECKINS TAB */}
      {activeTab ===
        "checkins" && (
        <div className="space-y-4">
          {checkins.map(
            (checkin) => (
              <div
                key={checkin.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      Gym Visit
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {
                        checkin.date
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      In:{" "}
                      {
                        checkin.check_in
                      }
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Out:{" "}
                      {checkin.check_out ||
                        "-"}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab ===
        "payments" && (
        <div>
          {/* Top Bar */}
          <div className="flex justify-end mb-5">
            <button
              onClick={() =>
                setIsModalOpen(true)
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
            >
              <Plus size={18} />
              Log Payment
            </button>
          </div>

          {/* Payment Cards */}
          <div className="space-y-4">
            {payments.length >
            0 ? (
              payments.map(
                (payment) => (
                  <div
                    key={payment.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left */}
                      <div>
                        <h2 className="text-xl font-bold">
                          ₹
                          {
                            payment.amount
                          }
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                          {
                            payment.method
                          }
                        </p>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium">
                            {new Date(
                              payment.date
                            ).toLocaleDateString()}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {payment.note ||
                              "No note"}
                          </p>
                        </div>

                        {/* WhatsApp */}
                        <button
                          onClick={() =>
                            sendWhatsAppBill(
                              payment
                            )
                          }
                          className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                          title="Send bill via WhatsApp"
                        >
                          <MessageCircle
                            size={18}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
                No payments found
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Log Payment
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

            <form
              onSubmit={
                handlePaymentSubmit
              }
              className="space-y-4"
            >
              <div>
                <label className="block mb-1 font-medium">
                  Amount
                </label>

                <input
                  type="number"
                  value={
                    paymentForm.amount
                  }
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount:
                        e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Payment Method
                </label>

                <select
                  value={
                    paymentForm.method
                  }
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      method:
                        e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                >
                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Card">
                    Card
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Date
                </label>

                <input
                  type="date"
                  value={
                    paymentForm.date
                  }
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      date:
                        e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Note
                </label>

                <textarea
                  rows={3}
                  value={
                    paymentForm.note
                  }
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      note:
                        e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none"
                />
              </div>

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
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfile;

