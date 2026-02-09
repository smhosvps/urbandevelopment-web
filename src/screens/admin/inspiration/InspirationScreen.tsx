import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateInspirationMutation,
  useDeleteInspirationMutation,
  useGetAllInspirationsQuery,
  useUpdateInspirationMutation,
} from "@/redux/features/inspiration/inspiration";
import Modal from "@/components/modal/Modal";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import InspirationForm from "@/components/modal/InpsirationForm";

type Props = {};

export default function InspirationScreen({}: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError, refetch } = useGetAllInspirationsQuery({
    page,
    pageSize,
  });
  const [createInspiration, { isSuccess, error }] =
    useCreateInspirationMutation();
  const [updateInspiration, { isSuccess: successUpdate }] =
    useUpdateInspirationMutation();
  const [deleteInspiration, { isSuccess: successDelete }] =
    useDeleteInspirationMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newInspiration, setNewInspiration] = useState({});
  const [editingInspiration, setEditingInspiration] = useState<any>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInspiration(newInspiration);
    setNewInspiration({});
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Inspiration created successfully");
      refetch();
      setIsCreateModalOpen(false);
    }
    if (successUpdate) {
      toast.success("Inspiration updated successfully");
      refetch();
      setIsEditModalOpen(false);
    }
    if (successDelete) {
      toast.success("Inspiration deleted successfully");
      refetch();
    }
    // Error handling remains the same
  }, [isSuccess, error, successDelete, successUpdate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInspiration) {
      await updateInspiration(editingInspiration);
      setEditingInspiration(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inspiration?")) {
      await deleteInspiration(id);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading inspirations
      </div>
    );

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Inspirations
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Title", "Scripture", "Body", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.inspire?.map((inspiration: any) => (
                <tr
                  key={inspiration._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 max-w-[200px] truncate">
                    {inspiration.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 max-w-[150px] truncate">
                    {inspiration.scripture}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 max-w-[300px] line-clamp-2">
                    {inspiration.body}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingInspiration(inspiration);
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(inspiration._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.inspire?.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No inspirations found
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing{" "}
              <span className="font-medium">{(page - 1) * pageSize + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * pageSize, data?.totalCount || 0)}
              </span>{" "}
              of <span className="font-medium">{data?.totalCount || 0}</span>{" "}
              results
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, data?.totalPages || 0) }).map(
                (_, idx) => {
                  const pageNumber =
                    page <= 3
                      ? idx + 1
                      : page >= (data?.totalPages || 0) - 2
                      ? (data?.totalPages || 0) - 4 + idx
                      : page - 2 + idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setPage(pageNumber)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        page === pageNumber
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                      disabled={pageNumber > (data?.totalPages || 0)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => setPage((old) => old + 1)}
              disabled={page >= (data?.totalPages || 0)}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals remain the same */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Inspiration"
      >
        <InspirationForm
          inspiration={newInspiration}
          onChange={(field: any, value: any) =>
            setNewInspiration((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={handleCreate}
          submitText="Create"
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Inspiration"
      >
        <InspirationForm
          inspiration={editingInspiration || {}}
          onChange={(field: any, value: any) =>
            setEditingInspiration((prev: any) =>
              prev ? { ...prev, [field]: value } : null
            )
          }
          onSubmit={handleUpdate}
          submitText="Update"
        />
      </Modal>
    </div>
  );
}
