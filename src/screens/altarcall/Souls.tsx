import { useState, useEffect } from 'react';
import { json2csv } from 'json-2-csv';
import { useGetAllAltarCallSoulsQuery } from '@/redux/features/altarcalls/altarcallApi';

const SoulsTable = () => {
  const { data, isLoading, isError } = useGetAllAltarCallSoulsQuery({});
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(null); 
  const [itemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    purpose: '',
    gender: '',
    search: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (data?.data) {
      let result = data.data;
      
      // Apply filters
      if (filters.purpose) {
        result = result.filter((item:any) => item.purpose === filters.purpose);
      }
      
      if (filters.gender) {
        result = result.filter((item:any) => item.gender === filters.gender);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter((item:any) => 
          item.name.toLowerCase().includes(searchTerm)
        );
      }
      
      setFilteredData(result);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [data, filters]);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber:any) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (e:any) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Download CSV function
  const downloadCSV = async () => {
    setIsDownloading(true);
    
    try {
      // Prepare data for CSV
      const csvData = filteredData.map((item:any, index) => ({
        'S/N': index + 1,
        'Name': item.name,
        'Phone': item.phone,
        'Email': item.email,
        'Gender': item.gender || 'N/A',
        'Purpose': item.purpose,
        'Address': item.address,
        'Country': item.country,
        'Date': new Date(item.createdAt).toLocaleDateString()
      }));

      // Convert to CSV using json-2-csv
      const csv = await json2csv(csvData, {
        prependHeader: true, // include headers
        sortHeader: false,   // keep original column order
        emptyFieldValue: 'N/A' // handle empty values
      });
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `souls_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV:', error);
    } finally {
      setIsDownloading(false);
    }
  };


  // Function to open modal with avatar
  const openAvatarModal = (avatarUrl:any) => {
    setSelectedAvatar(avatarUrl);
  };

  // Function to close modal
  const closeAvatarModal = () => {
    setSelectedAvatar(null);
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Error loading data</div>;

  // Get unique purposes and genders for filter options
  const purposes = [...new Set(data?.data?.map((item:any) => item.purpose))];
  const genders = [...new Set(data?.data?.map((item:any)=> item.gender).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Altar Call Records</h2>
        <button
          onClick={downloadCSV}
          disabled={isDownloading || filteredData.length === 0}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </>
          )}
        </button>
      </div>

      {selectedAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeAvatarModal}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Avatar Preview</h3>
              <button 
                onClick={closeAvatarModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <img 
                src={selectedAvatar} 
                alt="Enlarged avatar" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Purpose</label>
          <select
            name="purpose"
            value={filters.purpose}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Purposes</option>
            {purposes.map((purpose:any) => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Genders</option>
            {genders.map((gender:any) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Search by Name</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search souls..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item:any, index) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.avatar ? (
                      <button 
                        onClick={() => openAvatarModal(item.avatar)}
                        className="focus:outline-none"
                      >
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="h-10 w-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        />
                      </button>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.gender || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td  className="px-6 py-4 text-center text-sm text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoulsTable;