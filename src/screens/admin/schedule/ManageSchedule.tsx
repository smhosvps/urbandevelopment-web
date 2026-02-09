import {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useGetAllScheduleQuery,
  useUpdateScheduleMutation,
} from "@/redux/features/schedule/scheduleApi";
import { Loader2, Plus, X, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

export default function ManageSchedule({}: Props) {
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [info, setInfo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalType, setModalType] = useState("");

  const [createSchedule, { data, isSuccess, error, isLoading }] =
    useCreateScheduleMutation();
  const {
    data: schedules,
    refetch,
    isLoading: loadingSchedule,
  } = useGetAllScheduleQuery({});

  const [updateSchedule, { isLoading: updateLoading }] =
    useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules =
    schedules?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((schedules?.length || 0) / itemsPerPage);

 
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Schedule created successfully");
      closeModal();
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error && "data" in error) {
      toast.error((error as any).data.message);
    }
  }, [error]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const openCreateModal = () => {
    setModalType("create");
    setDate("");
    setInfo("");
    setSelectedId(null);
  };

  const openEditModal = (schedule: any) => {
    setModalType("edit");
    setDate(schedule.date);
    setInfo(schedule.info);
    setSelectedId(schedule._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteSchedule(id).unwrap();
        toast.success("Schedule deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete schedule");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
  
    if (selectedDate < today) {
      setDateError("Please select a date today or in the future");
      return;
    }
  
    try {
      if (modalType === "create") {
        await createSchedule({ info, date }).unwrap();
      } else if (selectedId) {
        await updateSchedule({ id: selectedId, info, date }).unwrap();
        toast.success("Schedule updated successfully");
        closeModal();
        refetch();
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const closeModal = () => {
    setModalType("");
    setSelectedId(null);
    setDate("");
    setInfo("");
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header and Create Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Schedules</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Create Schedule</span>
        </button>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loadingSchedule ? (
          <div className="p-6 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="mt-2">Loading schedules...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Information
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentSchedules?.map((schedule: any, index: number) => (
                    <tr key={schedule._id}>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(schedule.date)?.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {schedule.info}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(schedule.createdAt)?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 flex gap-3">
                        <button
                          onClick={() => openEditModal(schedule)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule?._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, schedules?.length || 0)} of{" "}
                  {schedules?.length || 0} entries
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  {[5, 10, 20].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(selectedId || modalType === "create") && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === "create" ? "Add" : "Edit"} Schedule
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 outline-none transition-all"
                  required
                />
                {dateError && (
                  <p className="text-sm text-red-600 mt-1">{dateError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Information
                </label>
                <textarea
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  maxLength={150}
                  placeholder="Enter description"
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 outline-none h-32 resize-none transition-all"
                  required
                />
                <p className="text-sm text-gray-500 text-right">
                  {info.length}/150
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || updateLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading || updateLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>
                      {modalType === "create" ? "Creating..." : "Updating..."}
                    </span>
                  </>
                ) : modalType === "create" ? (
                  "Create Schedule"
                ) : (
                  "Update Schedule"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
