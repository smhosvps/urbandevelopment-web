import ModalFeedback from "@/components/modal/ModalFeedback"
import { useDeleteFeedbackMutation, useGetFeedbacksQuery } from "@/redux/features/feedback/feedBackApi"
import { useGetAllUsersQuery } from "@/redux/features/user/userApi"
import { FileType, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { toast } from "react-toastify"

type Props = {}

export default function ManageFeedback({}: Props) {
  const { data: usersData } = useGetAllUsersQuery({});
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const { data: feedbacks, isLoading, isError, refetch } = useGetFeedbacksQuery({})
  const [deleteFeedback, { isSuccess, error }] = useDeleteFeedbackMutation()
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)

  // Get user name from userId
  const getUserName = (userId: string) => {
    const user = usersData?.users?.find((u: any) => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  useEffect(() => {
    if (isSuccess) {
      const message = feedbacks?.message || "Successfully deleted feedback";
      toast.success(message);
      refetch()
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message)
      }
    }
  }, [isSuccess, error])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await deleteFeedback(id)
    }
  }

  const openDetailModal = (feedback: any) => {
    setSelectedFeedback(feedback)
    setIsDetailModalOpen(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading feedbacks</div>

  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFeedbacks = feedbacks?.feedbacks?.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
      </div>

      <div className="rounded-xl border shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedFeedbacks?.map((feedback: any) => (
                <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{feedback.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getUserName(feedback.userId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openDetailModal(feedback)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50"
                      >
                        <FileType className="w-4 h-4" />
                        <span className="text-sm">Details</span>
                      </button>
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="flex items-center gap-1.5 text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} - {Math.min(endIndex, feedbacks?.length || 0)} of {feedbacks?.length || 0} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCircleChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">
              Page {page}
            </span>
            <button
              onClick={() => setPage(old => old + 1)}
              disabled={page >= Math.ceil((feedbacks?.length || 0) / itemsPerPage)}
              className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCircleChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <ModalFeedback 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title="Feedback Details"
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold">{selectedFeedback.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Submitted by: {getUserName(selectedFeedback.userId)}
              </p>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700">{selectedFeedback.content}</p>
            </div>
            <div className="text-sm text-gray-500">
              <time>
                {new Date(selectedFeedback.createdAt).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </time>
            </div>
          </div>
        )}
      </ModalFeedback>
    </div>
  )
}