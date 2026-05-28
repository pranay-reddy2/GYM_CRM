const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </div>

        <div className="p-3 bg-gray-100 rounded-full">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;