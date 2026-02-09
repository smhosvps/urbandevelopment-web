import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify'
import { 
  useCreatePrivacyMutation, 
  useEditPolicyMutation, 
  useGetAllPrivacyQuery 
} from '@/redux/features/privacy/privacyApi';
import { Loader2 } from 'lucide-react';


export default function ManagePrivacy() {
  const { data: privacyData, isLoading, refetch } = useGetAllPrivacyQuery({});
  const [editPolicy, { isLoading: isUpdating }] = useEditPolicyMutation();
  const [createPrivacy, { isLoading: isCreating }] = useCreatePrivacyMutation();
  
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Initialize form with existing data
  useEffect(() => {
    if (privacyData?.privacy) {
      setTitle(privacyData.privacy.title);
      setContent(privacyData.privacy.detail);
    }
  }, [privacyData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return toast.error('Title is required');
    if (!content.trim()) return toast.error('Content is required');

    const payload = { title, detail: content };
    
    try {
      if (privacyData?.privacy?._id) {
        await editPolicy({ 
          id: privacyData.privacy._id, 
          data: payload 
        }).unwrap();
        toast.success('Policy updated successfully');
      } else {
        await createPrivacy(payload).unwrap();
        toast.success('Policy created successfully');
      }
      refetch();
      setEditMode(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed');
    }
  };

  if (isLoading) return <Loader2 className='text-blue-800' />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {privacyData?.privacy ? 'Privacy Policy' : 'Create Privacy Policy'}
        </h1>
        {privacyData?.privacy && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg ${
              editMode 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {editMode ? 'Cancel Editing' : 'Edit Policy'}
          </button>
        )}
      </div>

      {!privacyData?.privacy ? (
        // Create Form
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Policy Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter policy title"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Policy Content *
            </label>
            <div className="border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isCreating ? 'Creating...' : 'Create Policy'}
          </button>
        </form>
      ) : (
        // View/Edit Mode
        <div className="bg-white rounded-xl shadow-sm">
          {editMode ? (
            // Edit Form
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-2xl font-bold border-b focus:ring-2 focus:ring-blue-500"
                placeholder="Policy Title"
              />

              <div className="border rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="bg-white"
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            // Display Mode
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}