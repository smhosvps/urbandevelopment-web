
import { useState } from "react"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  FileText, 
  Calendar,
  Globe,
  Banknote,
  Briefcase,
  Printer,
  Trash2,
  Copy,
  Check,
  AlertCircle
} from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useDeleteStaffFormMutation, useGetStaffFormByIdQuery } from "./redux/features/staffFormsAPi/staffFormsApi"


export default function FormDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  
  const { data, isLoading, error } = useGetStaffFormByIdQuery(id || '')
  const [deleteForm] = useDeleteStaffFormMutation()

  const form = data?.data

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleDelete = async () => {
    if (!form || !confirm(`Are you sure you want to delete ${form.email}'s form?`)) {
      return
    }

    try {
      await deleteForm(form._id).unwrap()
      toast.success('Form deleted successfully')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete form')
    }
  }

  const handleCopyId = () => {
    if (form) {
      navigator.clipboard.writeText(form._id)
      setCopied(true)
      toast.success('Form ID copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    window.print()
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading form details...</p>
        </div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error?.data?.message || 'The requested staff form could not be found.'}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <ToastContainer position="top-right" />
      
      {/* Header */}
      <div className="bg-purple-600 text-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Staff Form Details</h1>
                <p className="text-blue-100 mt-1">Complete information for {form.surname}, {form.otherNames}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-[4px] flex items-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              {/* <button
                onClick={handleExport}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button> */}
              <div className="relative">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-[4px] flex items-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form ID */}
        <div className="mb-6 print:hidden">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Form ID:</span>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded font-mono">
                  {form._id}
                </code>
              </div>
              <button
                onClick={handleCopyId}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy ID
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Photo */}
          <div className="lg:col-span-1 space-y-6">
            {/* Passport Photo */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Passport Photograph
                </h2>
              </div>
              <div className="p-6">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  <img
                    src={form.passportPhoto}
                    alt={`${form.surname}, ${form.otherNames}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/default-avatar.png'
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Submitted on {formatDate(form.submittedAt)}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {form.surname}, {form.otherNames}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`mailto:${form.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {form.email}
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personal Phone
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a 
                        href={`tel:${form.personalPhone}`}
                        className="text-gray-900 hover:text-blue-600"
                      >
                        {form.personalPhone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Official Phone
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a 
                        href={`tel:${form.officialPhone}`}
                        className="text-gray-900 hover:text-blue-600"
                      >
                        {form.officialPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employment Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Employment Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {form.position}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {form.department || 'Not Specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pastor Type
                    </label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        form.pastorChoice === 'Senior Pastor' 
                          ? 'bg-purple-100 text-purple-800'
                          : form.pastorChoice === 'Associate Pastor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {form.pastorChoice || 'Not a Pastor'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Details
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{form.accountBank}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{form.country}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{form.region}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State/Province
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{form.stateOfResidence || 'Not Specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline & Meta Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Timeline & System Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted Date
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(form.submittedAt)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(form.lastModified || form.submittedAt)}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form Status
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Completed
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        ✅ Verified
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        📄 Document Uploaded
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="print:hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => window.open(`mailto:${form.email}`, '_blank')}
                    className="p-4 bg-white border border-gray-200 rounded-[10px] hover:border-blue-300 hover:shadow-md transition text-left group"
                  >
                    <Mail className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">Send Email</p>
                    <p className="text-sm text-gray-600">Contact {form.surname}</p>
                  </button>
                  <button
                    onClick={() => window.open(`tel:${form.personalPhone}`, '_blank')}
                    className="p-4 bg-white border border-gray-200 rounded-[10px] hover:border-blue-300 hover:shadow-md transition text-left group"
                  >
                    <Phone className="w-5 h-5 text-green-600 mb-2" />
                    <p className="font-medium text-gray-900 group-hover:text-green-600">Call Personal</p>
                    <p className="text-sm text-gray-600">{form.personalPhone}</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p className="font-bold text-lg">Salvation Ministries Staff Database</p>
            <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            <p className="mt-4 text-sm">This document contains confidential information. Handle with care.</p>
          </div>
        </div>
      </div>
    </div>
  )
}