import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { toast } from 'react-toastify'
import { IoClose } from 'react-icons/io5';
import { useCreateGuideMutation, useEditGuideMutation, useGetGuideQuery } from '@/redux/features/homecell/houseFellowshipApi';

type Props = {}

export default function ManageHomecell({ }: Props) {
    const { data: dataP, refetch } = useGetGuideQuery({}, { refetchOnMountOrArgChange: true })
    const [createGuide, { isSuccess: success, isLoading: loading, error: errorP }] = useCreateGuideMutation({})
    const [editGuide, { isSuccess, isLoading, error }] = useEditGuideMutation({})

    const [id, setId] = useState<any>({})
    const [isOpen, setIsOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [detail, setValue] = useState("");
    const [date, setDate] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (id) {
            setTitle(id.title)
            setCategory(id.category)
            setValue(id.detail)
            setDate(id.date)
            setUrl(id.url)
        }
    }, [id])

    const data = {
        title,
        detail,
        url,
        date,
        category
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (!category) return toast.error("Select category");
        if (!title) return toast.error("Enter your title");
        if (!detail) return toast.error("Enter your detail");
        if (!url) return toast.error("Enter manual url");
        if (!date) return toast.error("Enter pick date for the manual");
        const idx = id?._id
        await editGuide({ idx, data })
    }

    const handleCreate = async (e: any) => {
        e.preventDefault()
        if (!category) return toast.error("Select category");
        if (!title) return toast.error("Enter your title");
        if (!detail) return toast.error("Enter your detail");
        if (!url) return toast.error("Enter manual url");
        if (!date) return toast.error("Enter pick date for the manual");
        await createGuide({ title, detail, url, date, category })
    }

    useEffect(() => {
        if (success) {
            refetch()
            setTitle("")
            setValue("")
            setCategory("")
            setIsOpen(false)
            toast.success("Manual created successfully")
        }
        if (isSuccess) {
            refetch()
            setId({})
            setIsEdit(false)
            toast.success("Manual updated successfully")
        }
        if (errorP) {
            if ("data" in errorP) {
                const errorMessage = errorP as any;
                toast.error(errorMessage.data.message)
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message)
            }
        }
    }, [isSuccess, error, errorP, success])

    return (
        <div className='min-h-screen p-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>Fellowship Guides</h1>
                    {/* {dataP?.homeguide?.length < 3 && ( */}
                        <button 
                            onClick={() => setIsOpen(true)}
                            className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
                        >
                            Create New Guide
                        </button>
                    {/* )} */}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {dataP?.homeguide?.map((i: any) => (
                            <div key={i._id} className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6'>
                                <div className='flex justify-between items-start mb-4'>
                                    <span className='inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full'>
                                        {i.category}
                                    </span>
                                    <button 
                                        onClick={() => { setId(i); setIsEdit(true) }}
                                        className='text-gray-400 hover:text-indigo-600 transition-colors'
                                    >
                                        ✏️ Edit
                                    </button>
                                </div>
                                <h3 className='text-xl font-semibold text-gray-800 mb-2'>{i.title}</h3>
                                <p className='text-gray-600 text-sm mb-4'>{i.date}</p>
                                <div className='prose prose-sm max-w-none text-gray-600' 
                                    dangerouslySetInnerHTML={{ __html: i.detail }} 
                                />
                                <a
                                    href={i.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors'
                                >
                                    View PDF ↗
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modals */}
                {isOpen && (
                    <ModalWrapper title="Create Guide" onClose={() => setIsOpen(false)}>
                        <GuideForm
                            {...{ title, setTitle, detail, setValue, date, setDate, url, setUrl, category, setCategory }}
                            onSubmit={handleCreate}
                            loading={loading}
                        />
                    </ModalWrapper>
                )}

                {isEdit && (
                    <ModalWrapper title="Edit Guide" onClose={() => setIsEdit(false)}>
                        <GuideForm
                            {...{ title, setTitle, detail, setValue, date, setDate, url, setUrl, category, setCategory }}
                            onSubmit={handleSubmit}
                            loading={isLoading}
                        />
                    </ModalWrapper>
                )}
            </div>
        </div>
    )
}

const ModalWrapper = ({ children, title, onClose }: any) => (
    <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className='p-6'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
                    <button 
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 transition-colors'
                    >
                        <IoClose className='text-2xl' />
                    </button>
                </div>
                {children}
            </div>
        </div>
    </>
)

const GuideForm = ({
    title,
    setTitle,
    detail,
    setValue,
    date,
    setDate,
    url,
    setUrl,
    category,
    setCategory,
    onSubmit,
    loading
}: any) => {
    return (
        <form onSubmit={onSubmit} className='space-y-6'>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                >
                    <option>Select category</option>
                    <option value="Home">Homefellowship guide</option>
                    <option value="Corporate">Corporate fellowship guide</option>
                    <option value="Unique">Unique fellowship guide</option>
                </select>
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Title</label>
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter title'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                />
            </div>

            <div className='grid grid-cols-2 gap-6'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>PDF Link</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder='Enter manual URL'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    />
                </div>
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Content</label>
                <div className='border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500'>
                    <ReactQuill
                        theme="bubble"
                        value={detail}
                        onChange={setValue}
                        placeholder='Write your content here...'
                        className='p-2 min-h-[150px] text-gray-700'
                    />
                </div>
            </div>

            <button
                type='submit'
                disabled={loading}
                className='w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50'
            >
                {loading ? 'Processing...' : 'Submit'}
            </button>
        </form>
    )
}