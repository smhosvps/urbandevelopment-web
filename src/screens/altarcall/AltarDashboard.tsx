import MonthlyChart from "@/components/chart/MonthlyChart";
import { useGetAltarCallStatsQuery } from "@/redux/features/altarcalls/altarcallApi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "#3B82F6", // blue-500
  secondary: "#EC4899", // pink-500
  success: "#10B981", // emerald-500
  warning: "#F59E0B", // amber-500
  info: "#06B6D4", // cyan-500
  error: "#EF4444", // red-500
};

export default function AltarDashboard() {
  const { data, isLoading, isError } = useGetAltarCallStatsQuery({});

  const filteredGenderData =
    data?.genderDistribution?.filter((g: any) => g.gender) || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error loading data
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Summary Card */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700">
          Total Registrations:{" "}
          <span className="text-blue-600">{data?.total}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gender Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Gender Distribution
          </h2>
          <div className="h-80">
            {filteredGenderData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredGenderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="gender"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {filteredGenderData.map((index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index % 2 === 0 ? COLORS.primary : COLORS.secondary
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No gender data available
              </div>
            )}
          </div>
        </div>

        {/* Purpose Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Purpose Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.purposeDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="purpose"
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar dataKey="count" name="Registrations">
                  {data?.purposeDistribution?.map((index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [COLORS.primary, COLORS.success, COLORS.warning][
                          index % 3
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Distribution */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Monthly Registration Trends
        </h2>
        <div className="h-96">
          <MonthlyChart data={data?.monthlyDistribution} />
        </div>
      </div>
    </div>
  );
}
