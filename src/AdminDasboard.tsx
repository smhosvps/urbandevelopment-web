import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  CheckSquare,
  Square,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css'
import { useBulkDeleteStaffFormsMutation, useDeleteStaffFormMutation, useGetAllStaffFormsQuery } from "./redux/features/staffFormsAPi/staffFormsApi"
import { useDispatch } from "react-redux"
import { clearCredentials } from "./redux/features/auth/authSlice"
import { useLogoutMutation } from "./redux/api/apiSlice"

interface FormData {
  _id: string
  surname: string
  otherNames: string
  email: string
  personalPhone: string
  officialPhone: string
  accountBank: string
  position: string
  department: string
  pastorChoice: string
  stateOfResidence: string
  region: string
  country: string
  passportPhoto: string
  submittedAt: string
}

export default function StaffFormsList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [logout] = useLogoutMutation();
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    country: '',
    pastorChoice: '',
    department: ''
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data, isLoading, error, refetch } = useGetAllStaffFormsQuery<any>({})
  const [bulkDelete] = useBulkDeleteStaffFormsMutation()
  const [deleteForm] = useDeleteStaffFormMutation()

  const staffForms = data?.data || []

  // Calculate total pages based on filtered forms
  const totalFilteredForms = useMemo(() => {
    return staffForms.filter((form: any) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
          form.surname.toLowerCase().includes(searchLower) ||
          form.otherNames.toLowerCase().includes(searchLower) ||
          form.email.toLowerCase().includes(searchLower) ||
          form.personalPhone.toLowerCase().includes(searchLower) ||
          form.officialPhone.toLowerCase().includes(searchLower) ||
          form.position.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      if (filter.country && form.country !== filter.country) return false
      if (filter.pastorChoice && form.pastorChoice !== filter.pastorChoice) return false
      if (filter.department && form.department !== filter.department) return false

      return true
    })
  }, [staffForms, searchTerm, filter])

  // Get current forms for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentForms = totalFilteredForms.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(totalFilteredForms.length / itemsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filter])

  // Select/deselect all on current page
  const toggleSelectAll = () => {
    const currentPageIds = currentForms.map((form: any) => form._id)
    
    if (selectedForms.length === currentPageIds.length && 
        currentPageIds.every(id => selectedForms.includes(id))) {
      // Deselect all on current page
      setSelectedForms(prev => prev.filter(id => !currentPageIds.includes(id)))
    } else {
      // Select all on current page
      const newSelected = [...new Set([...selectedForms, ...currentPageIds])]
      setSelectedForms(newSelected)
    }
  }

  // Toggle single selection
  const toggleSelect = (id: string) => {
    setSelectedForms(prev =>
      prev.includes(id)
        ? prev.filter(formId => formId !== id)
        : [...prev, id]
    )
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedForms.length === 0) {
      toast.error('Please select forms to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedForms.length} form(s)?`)) {
      return
    }

    try {
      await bulkDelete({ ids: selectedForms }).unwrap()
      toast.success(`${selectedForms.length} form(s) deleted successfully`)
      setSelectedForms([])
      refetch()
      // Reset to first page if current page becomes empty
      if (currentForms.length === selectedForms.length && currentPage > 1) {
        setCurrentPage(prev => Math.max(1, prev - 1))
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete forms')
    }
  }

  // Handle single delete
  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete form for ${email}?`)) {
      return
    }

    try {
      await deleteForm(id).unwrap()
      toast.success('Form deleted successfully')
      refetch()
      // Remove from selected if present
      setSelectedForms(prev => prev.filter(formId => formId !== id))
      // Adjust pagination if needed
      if (currentForms.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete form')
    }
  }

  // View form details
  const handleView = (id: string) => {
    navigate(`/admin/staff-forms/${id}`)
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle filter change
  const handleFilterChange = (key: keyof typeof filter, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilter({
      country: '',
      pastorChoice: '',
      department: ''
    })
    setSearchTerm('')
  }

  // Export data as CSV
  const handleExport = () => {
    if (totalFilteredForms.length === 0) {
      toast.error('No data to export')
      return
    }

    try {
      // Convert to CSV
      const headers = ['S/N', 'Surname', 'Other Names', 'Email', 'Personal Phone', 'Position', 'Department', 'Country', 'Region', 'Submitted Date']
      const csvData = totalFilteredForms.map((form: any, index: number) => [
        index + 1,
        form.surname,
        form.otherNames,
        form.email,
        form.personalPhone,
        form.position,
        form.department || 'Not Specified',
        form.country,
        form.region,
        new Date(form.submittedAt).toLocaleDateString()
      ])

      const csvContent = [
        headers.join(','),
        ...csvData.map((row: any) => row.map((cell: any) => `"${cell}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `staff-forms-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Data exported successfully')
    } catch (error:any) {
      toast.error('Failed to export data')
    }
  }

  // Get unique values for filters
  const getUniqueValues = (key: keyof FormData) => {
    const values = staffForms.map((form: any) => form[key]).filter(Boolean) as string[]
    return Array.from(new Set(values)).sort()
  }

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value)
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      if (currentPage <= 3) {
        startPage = 2
        endPage = 4
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
        endPage = totalPages - 1
      }
      
      pages.push(1)
      if (startPage > 2) pages.push('...')
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    
    return pages
  }

  // Update selected forms when data changes
  useEffect(() => {
    // Remove selected forms that no longer exist in current data
    setSelectedForms(prev =>
      prev.filter(id => staffForms.some((form: any) => form._id === id))
    )
  }, [staffForms])

  //   handle logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      // Navigate to sign-in page
      navigate("/");
      // Refresh the page
      window.location.reload();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Forms</h2>
          <p className="text-gray-600 mb-4">
            {error?.data?.message || 'Failed to load staff forms. Please try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Staff Forms</h1>
              <p className="text-blue-100 mt-2">Manage and review all submitted staff forms</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                disabled={totalFilteredForms.length === 0 || isLoading}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-[5px] flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-[5px] flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-500 rounded-[5px] flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white rounded-[10px] shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{staffForms.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[10px] shadow mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 rounded-[10px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by name, email, phone, or position..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => document.getElementById('filterPanel')?.classList.toggle('hidden')}
                  className="px-4 py-3 border border-gray-300  rounded-[10px] hover:bg-gray-50 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <div id="filterPanel" className="hidden border-b">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={filter.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {getUniqueValues('country').map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Pastor Choice Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pastor Type
                </label>
                <select
                  value={filter.pastorChoice}
                  onChange={(e) => handleFilterChange('pastorChoice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {getUniqueValues('pastorChoice').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filter.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {getUniqueValues('department').filter(dept => dept).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
              <span className="text-sm text-gray-500">
                Showing {totalFilteredForms.length} of {staffForms.length} forms
              </span>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedForms.length > 0 && (
            <div className="bg-blue-50 border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">
                      {selectedForms.length} form{selectedForms.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                </div>
                <button
                  onClick={() => setSelectedForms([])}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Info and Pagination Controls */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalFilteredForms.length)}</span> of{' '}
              <span className="font-semibold">{totalFilteredForms.length}</span> staff form{totalFilteredForms.length !== 1 ? 's' : ''}
              {(searchTerm || Object.values(filter).some(Boolean)) && (
                <span className="ml-2">
                  (filtered from {staffForms.length} total)
                </span>
              )}
            </p>
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading staff forms...</p>
            </div>
          ) : totalFilteredForms.length === 0 ? (
            <div className="p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
              <p className="text-gray-600">
                {searchTerm || Object.values(filter).some(Boolean)
                  ? 'Try changing your search or filters'
                  : 'No staff forms have been submitted yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-6 py-3">
                        <button
                          onClick={toggleSelectAll}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={currentForms.length === 0}
                          title="Select/Deselect all on this page"
                        >
                          {currentForms.length > 0 && 
                           currentForms.every((form: any) => selectedForms.includes(form._id)) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S/N
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position & Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentForms.map((form: any, index: number) => (
                      <tr
                        key={form._id}
                        className={`hover:bg-gray-50 ${selectedForms.includes(form._id) ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleSelect(form._id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {selectedForms.includes(form._id) ? (
                              <CheckSquare className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={form.passportPhoto || '/default-avatar.png'}
                                alt={form.surname}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/default-avatar.png'
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {form.surname}, {form.otherNames}
                              </div>
                              <div className="text-sm text-gray-500">
                                {form.pastorChoice || 'Staff Member'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {form.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {form.personalPhone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900">
                              {form.position}
                            </div>
                            <div className="text-sm text-gray-500">
                              {form.department || 'No department specified'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {form.region}, {form.country}
                            </div>
                            {form.stateOfResidence && (
                              <div className="text-sm text-gray-500">
                                {form.stateOfResidence}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(form.submittedAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(form.submittedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(form._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(form._id, form.email)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && goToPage(page)}
                          disabled={page === '...'}
                          className={`px-3 py-1 border text-sm rounded ${
                            currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          } ${page === '...' ? 'cursor-default' : ''}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      Go to page:
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                        className="ml-2 w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Performance Note */}
        {totalFilteredForms.length > 100 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Showing {totalFilteredForms.length} forms
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Consider using search or filters to narrow down results for better performance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}