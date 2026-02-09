// features/notifications/SendNotificationForm.jsx
import { useSendBulkNotificationMutation } from '@/redux/features/notificationsApi/notificationApi';
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SendNotificationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general'
  });

  

  const navigate = useNavigate()

  const [sendBulkNotification, { isLoading, isSuccess, isError, error }]:any = 
    useSendBulkNotificationMutation();

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await sendBulkNotification(formData).unwrap();
      setFormData({ title: '', message: '', type: 'general' });
      alert("Success")
      navigate("/dashboard/manage-notification")
    } catch (err) {
      console.error('Failed to send notifications:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Send Bulk Notification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={30}
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message*
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={100}
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="general">General</option>
            <option value="alert">Alert</option>
            <option value="update">Update</option>
            <option value="promotion">Promotion</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !formData.title || !formData.message}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading || !formData.title || !formData.message ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Sending...' : 'Send to All Users'}
          </button>
        </div>

        {isSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              Notifications sent successfully!
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">
              Error: {error?.data?.message || 'Failed to send notifications'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SendNotificationForm;