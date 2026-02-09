import { useState } from "react";
import { toast } from "react-toastify";
import { X, Loader2, Edit, Trash2, Plus } from "lucide-react";
import {
  useCreateTvMutation,
  useDeleteTvMutation,
  useEditTvMutation,
  useGetTvQuery,
} from "@/redux/features/salvationTv/salvationApi";


export default function SalvationTv() {
  const [selectedChannel, setSelectedChannel] = useState<any>(
    null
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, refetch, isLoading } = useGetTvQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );


  const [deleteTv] = useDeleteTvMutation();

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteTv(deleteId).unwrap();
        toast.success("Channel deleted successfully");
        refetch();
        setDeleteId(null);
      } catch (error) {
        toast.error("Failed to delete channel");
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
          Salvation TV Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add Channel</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Title", "Language", "URL", "Status", "Actions"].map(
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
              {data?.channel?.map((channel: any) => (
                <tr key={channel._id} className="dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {channel.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {channel.lang}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {channel.url}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        channel.isApprove === "true" ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                      }`}
                    >
                      {channel.isApprove === "true" ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedChannel(channel);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(channel._id)}
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

        {data?.channel?.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No channels found
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
      >
        <div className="p-6 space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this channel?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChannel(null);
        }}
        title={`${selectedChannel ? "Edit" : "Create"} Channel`}
      >
        <ChannelForm
          initialData={selectedChannel}
          onSuccess={() => {
            refetch();
            setIsModalOpen(false);
            setSelectedChannel(null);
          }}
        />
      </Modal>
    </div>
  );
}

const ChannelForm = ({
  initialData,
  onSuccess,
}: {
  initialData?: any;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    lang: initialData?.lang || "English",
    url: initialData?.url || "",
    isApprove: initialData?.isApprove || false,
    thumbnail: initialData?.thumbnail || "",
  });

  const [createTv] = useCreateTvMutation();
  const [editTv] = useEditTvMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
    } catch (error) {
      toast.error("Error uploading image");
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        title: formData.title,
        lang: formData.lang,
        url: formData.url,
        isApprove: formData.isApprove,
        thumbnail: formData.thumbnail,
      };

      if (initialData?._id) {
        await editTv({
          idx: initialData._id,
          title: formData.title,
          lang: formData.lang,
          url: formData.url,
          isApprove: formData.isApprove,
          thumbnail: formData.thumbnail,
        }).unwrap();
      } else {
        await createTv(data).unwrap();
      }

      onSuccess();
      toast.success(
        `Channel ${initialData?._id ? "updated" : "created"} successfully`
      );
    } catch (err: any) {
      toast.error(err.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex flex-row items-center gap-4">
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter channel title"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Language
          </label>
          <select
            required
            value={formData.lang}
            onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {["English", "French", "Chinese", "Arabic", "Spanish"].map(
              (lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL
          </label>
          <input
            type="url"
            required
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="Enter stream URL"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-1 items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Approved
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isApprove}
              onChange={(e) =>
                setFormData({ ...formData, isApprove: e.target.checked })
              }
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                formData.isApprove == true
                  ? "bg-indigo-600 dark:bg-indigo-500"
                  : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform transform ${
                  formData.isApprove == true
                    ? "translate-x-5 bg-white"
                    : "bg-gray-400"
                }`}
              />
            </div>
          </label>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Thumbnail
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const image = await handleImageUpload(file);
              setFormData({ ...formData, thumbnail: image });
            }
          }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        {formData.thumbnail && (
          <img
            src={formData.thumbnail}
            alt="Thumbnail preview"
            className="mt-2 h-32 w-full object-contain rounded-lg"
          />
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData?._id ? "Update Channel" : "Create Channel"}
        </button>
      </div>
    </form>
  );
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
