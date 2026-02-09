import { useState } from "react";
import { X, Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import {
  useDeleteFlyerMutation,
  useGetAllFlyerQuery,
} from "@/redux/features/flyer/flyerApi";
import CreateFlyerModal from "@/components/modal/CreateFlyerModal";

type Props = {};

interface FlyerData {
  _id: string;
  note: string;
  createdAt: string;
  isApprove: boolean;
  thumbnail: {
    url: string;
  };
}

export default function ManageFlyer({}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlyer, setSelectedFlyer] = useState<string | null>(null);
  const { data, refetch, isLoading } = useGetAllFlyerQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteFlyer] = useDeleteFlyerMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this flyer?")) {
      try {
        await deleteFlyer(id).unwrap();
        toast.success("Flyer deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Delete failed. Please try again.");
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Flyer Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add New Flyer</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Flyer", "Title", "Created At", "Status", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.map((flyer: FlyerData) => (
                <tr key={flyer._id} className="dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedFlyer(flyer.thumbnail.url)}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={flyer.thumbnail.url || "/noavatar.png"}
                        alt="Flyer preview"
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {flyer.note}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(flyer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        flyer.isApprove
                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                      }`}
                    >
                      {flyer.isApprove ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(flyer._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No flyers found
          </div>
        )}
      </div>

      {/* Flyer Preview Modal */}
      <Modal isOpen={!!selectedFlyer} onClose={() => setSelectedFlyer(null)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Flyer Preview
          </h2>
          <img
            src={selectedFlyer || ""}
            alt="Flyer full preview"
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </Modal>

      {/* Add Flyer Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CreateFlyerModal
            setOpen={setIsModalOpen}
            refetch={refetch}
            flyer={selectedFlyer} // Pass selected flyer when editing
          />
        </Modal>
      )}
    </div>
  );
}

const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
        {children}
      </div>
    </div>
  );
};
