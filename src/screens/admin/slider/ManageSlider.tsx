import CreateSliderModal from '@/components/modal/CreateSliderModal';
import { useDeleteSliderMutation, useGetAllSliderQuery } from '@/redux/features/slider/sliderApi';
import { Trash2, X, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';


type Props = {};

interface Slider {
  _id: string;
  title: string;
  url: string;
  createdAt: string;
  isApprove: boolean;
  thumbnail: {
    url: string;
  };
}

export default function SliderScreen({ }: Props) {
  const { data, isLoading, refetch } = useGetAllSliderQuery({}, { refetchOnMountOrArgChange: true });
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
  const [deleteSlider] = useDeleteSliderMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      try {
        await deleteSlider(id).unwrap();
        toast.success('Slider deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Delete failed. Please try again.');
      }
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Slider Management</h1>
        <button
          onClick={() => setActiveModal('create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add New Slider</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Cover', 'Title', 'Category', 'Created At', 'Status', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.map((slider: Slider) => (
                <tr key={slider._id} className="dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedSlider(slider);
                        setActiveModal('view');
                      }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={slider.thumbnail.url || "/noavatar.png"} 
                        alt="Slider cover" 
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{slider.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{slider.url}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(slider.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      slider.isApprove 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
                    }`}>
                      {slider.isApprove ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleDelete(slider._id)}
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
            No sliders found
          </div>
        )}
      </div>

      <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}>
        {activeModal === 'view' && selectedSlider && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Slider Preview</h2>
            <img 
              src={selectedSlider.thumbnail.url} 
              alt="Slider preview" 
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        )}

        {activeModal === 'create' && (
          <CreateSliderModal setActive={setActiveModal} refetch={refetch} />
        )}
      </Modal>
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