import { useCallback, useState } from "react"
import { toast } from "react-toastify"

import { X, Edit, Trash2, Plus } from "lucide-react"
import { useCreateLiveFeedMutation, useDeleteStreamMutation, useGetAllLiveFeedsQuery, useUpdateLiveFeedMutation } from "@/redux/features/live/liveServices"

interface LiveStream {
  _id: string
  videoId: string
  country: string
  status: "Online" | "Offline"
  info: string
  flag: string
}

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
  title: string
}

export default function ManageLanguageStream() {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  
  const { data, refetch } = useGetAllLiveFeedsQuery({})
  const [deleteStream] = useDeleteStreamMutation()

  const handleDelete = useCallback(async () => {
    if (deleteId) {
      try {
        await deleteStream(deleteId).unwrap()
        toast.success("Stream deleted successfully")
        refetch()
        setDeleteId(null)
      } catch (error) {
        toast.error("Failed to delete stream")
      }
    }
  }, [deleteId, refetch])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Live Stream Management</h1>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add Stream</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.live?.map((stream: LiveStream) => (
          <div key={stream._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-xl overflow-hidden">
              {stream.videoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/live_stream?channel=${stream.videoId}`}
                  title={stream.info}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 p-4">
                  Invalid YouTube channel ID
                </div>
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stream.country}
                </span>
                <span className={`text-sm font-semibold ${
                  stream.status === "Online" ? "text-green-600" : "text-red-600"
                }`}>
                  {stream.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stream.info}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedStream(stream)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteId(stream._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
      >
        <div className="p-6 space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this stream?
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
        isOpen={!!selectedStream || isCreateOpen}
        onClose={() => {
          setSelectedStream(null)
          setIsCreateOpen(false)
        }}
        title={`${selectedStream ? "Edit" : "Create"} Stream`}
      >
        <StreamForm
          initialData={selectedStream}
          onSuccess={() => {
            refetch()
            setSelectedStream(null)
            setIsCreateOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}

const StreamForm = ({ initialData, onSuccess }: { 
  initialData?: LiveStream | null
  onSuccess: () => void 
}) => {
  const [formData, setFormData] = useState({
    videoId: initialData?.videoId || "",
    country: initialData?.country || "",
    info: initialData?.info || "",
    status: initialData?.status || "Online",
    flag: initialData?.flag||""

  })

  const [updateLiveFeed] = useUpdateLiveFeedMutation()
  const [createLiveFeed] = useCreateLiveFeedMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialData?._id) {
        await updateLiveFeed({ 
          id: initialData._id,
          ...formData 
        }).unwrap()
        toast.success("Stream updated successfully")
      } else {
        await createLiveFeed(formData).unwrap()
        toast.success("Stream created successfully")
      }
      onSuccess()
    } catch (err: any) {
      toast.error(err.data?.message || "Operation failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          YouTube Channel ID
        </label>
        <input
          required
          value={formData.videoId}
          onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
          placeholder="Enter YouTube channel ID"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Country/Language
        </label>
        <input
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="Enter country or language"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Country/Flag
        </label>
        <input
          required
          value={formData.flag}
          onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
          placeholder="Enter country flag"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Information
        </label>
        <textarea
          required
          maxLength={150}
          value={formData.info}
          onChange={(e) => setFormData({ ...formData, info: e.target.value })}
          placeholder="Enter stream description"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          required
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "Online" | "Offline" })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          {initialData ? "Update Stream" : "Create Stream"}
        </button>
      </div>
    </form>
  )
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps & { isOpen: boolean }) => {
  if (!isOpen) return null

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
  )
}