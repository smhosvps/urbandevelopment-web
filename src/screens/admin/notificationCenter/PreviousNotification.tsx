import { useState } from 'react';
import { 
  useGetNotificationsQuery, 
  useDeleteNotificationMutation,
  useDeleteMultipleNotificationsMutation 
} from '@/redux/features/notificationsApi/notificationApi';
import { Link } from 'react-router-dom';

const PreviousNotification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const { data, isLoading, isError, error, refetch} = useGetNotificationsQuery<any>({
    page: currentPage,
    limit: pageSize
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openNotificationModal = (notification:any) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteMultipleNotifications] = useDeleteMultipleNotificationsMutation();

  const handleSingleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(id).unwrap();
        refetch()
        setSelectedNotifications(selectedNotifications.filter(item => item !== id));
        alert('Notification deleted successfully');
      } catch (err) {
        alert('Failed to delete notification');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) {
      alert('Please select at least one notification');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedNotifications.length} notifications?`)) {
      try {
        await deleteMultipleNotifications(selectedNotifications).unwrap();
        setSelectedNotifications([]);
        refetch()
        setSelectAll(false);
        alert(`${selectedNotifications.length} notifications deleted successfully`);
      } catch (err) {
        alert('Failed to delete notifications');
      }
    }
  };

  const handleSelectNotification = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications([...selectedNotifications, id]);
    } else {
      setSelectedNotifications(selectedNotifications.filter(item => item !== id));
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedNotifications(data?.notifications?.map((n: any) => n._id) || []);
    } else {
      setSelectedNotifications([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">
          Error loading notifications: {error?.data?.message || 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
         {/* Notification Detail Modal */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Notification Details</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="mt-1 text-lg font-semibold">{selectedNotification.title}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Type</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                  {selectedNotification.type}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${
                  selectedNotification.status === 'unread' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedNotification.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Date Sent</h4>
                <p className="mt-1 text-sm">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="mt-1 whitespace-pre-line">{selectedNotification.message}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Sent Notifications
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {selectedNotifications.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete Selected ({selectedNotifications.length})
            </button>
          )}
          <Link 
            to="/dashboard/send-bulk-notification" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Send Notification
          </Link>
        </div>
      </div>
      
      {data?.notifications?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.notifications?.map((notification: any) => (
                  <tr key={notification._id} className={selectedNotifications.includes(notification._id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification._id)}
                        onChange={(e) => handleSelectNotification(notification._id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {notification.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notification.status === 'unread' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                    <div 
                        className="text-sm text-gray-500 max-w-xs truncate cursor-pointer hover:text-gray-700"
                        onClick={() => openNotificationModal(notification)}
                      >
                        {notification.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSingleDelete(notification._id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              {selectedNotifications.length > 0 && (
                <span>{selectedNotifications.length} selected</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                    setSelectedNotifications([]);
                    setSelectAll(false);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.ceil((data?.total || 0) / pageSize) }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(Math.ceil((data?.total || 0) / pageSize), currentPage + 2))
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        setSelectedNotifications([]);
                        setSelectAll(false);
                      }}
                      className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-600 text-white' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil((data?.total || 0) / pageSize), p + 1))}
                  disabled={currentPage === Math.ceil((data?.total || 0) / pageSize)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <span className="text-sm text-gray-700">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data?.total || 0)} of {data?.total || 0} notifications
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">No notifications sent yet</p>
        </div>
      )}
    </div>
  );
};

export default PreviousNotification;