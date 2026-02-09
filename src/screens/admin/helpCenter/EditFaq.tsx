import { useEditFaqMutation, useGetAllFaqQuery } from '@/redux/features/fag/faqApi';
import { useEffect, useState } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FAQItem {
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  description: string;
}

export default function EditFaq() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editFaq, { isLoading, isSuccess, error }] = useEditFaqMutation();
  const { data: fetchedData, isLoading: isFetching, refetch } = useGetAllFaqQuery({});

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
  });
  
  const [faqItems, setFaqItems] = useState<FAQItem[]>([{ question: '', answer: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with fetched data
  useEffect(() => {
    if (fetchedData && id) {
      const faq = fetchedData.find((item: any) => item._id === id);
      if (faq) {
        setFormData({
          name: faq.name,
          description: faq.description,
        });
        setFaqItems(faq.faq);
      }
    }
  }, [fetchedData, id]);

  // Handle API responses
  useEffect(() => {
    if (isSuccess) {
      toast.success('FAQ updated successfully');
      navigate('/dashboard/help-center');
      refetch()
    }
    
    if (error) {
      if ('data' in error) {
        toast.error((error as any).data.message);
      } else {
        toast.error('Failed to update FAQ');
      }
    }
  }, [isSuccess, error, navigate]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    faqItems.forEach((item, index) => {
      if (!item.question.trim()) newErrors[`question-${index}`] = 'Question is required';
      if (!item.answer.trim()) newErrors[`answer-${index}`] = 'Answer is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!id) {
      toast.error('Invalid FAQ ID');
      return;
    }

    try {
      await editFaq({
        id,
        data: {
          name: formData.name,
          description: formData.description,
          faq: faqItems,
        }
      }).unwrap();
    } catch (err) {
      toast.error('Failed to update FAQ');
    }
  };

  const handleFaqChange = (index: number, field: keyof FAQItem, value: string) => {
    setFaqItems(faqItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addFaqItem = () => setFaqItems([...faqItems, { question: '', answer: '' }]);

  const removeFaqItem = (index: number) => {
    if (faqItems.length > 1) {
      setFaqItems(faqItems.filter((_, i) => i !== index));
    }
  };

  if (isFetching) return <div className="text-center p-8 text-gray-500">Loading FAQ...</div>;
  if (!id) return <div className="text-center p-8 text-red-500">Invalid FAQ ID</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit FAQ</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            FAQ Title *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-3 border rounded-lg ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className={`w-full p-3 border rounded-lg ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="space-y-4 border-l-4 border-blue-100 pl-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Item {index + 1}</h3>
                {faqItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFaqItem(index)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <AiOutlineMinusCircle className="w-5 h-5" />
                    Remove
                  </button>
                )}
              </div>

              {/* Question Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Question *
                </label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  className={`w-full p-3 border rounded-lg ${
                    errors[`question-${index}`] ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors[`question-${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`question-${index}`]}</p>
                )}
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Answer *
                </label>
                <textarea
                  value={item.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  className={`w-full p-3 border rounded-lg ${
                    errors[`answer-${index}`] ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                />
                {errors[`answer-${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`answer-${index}`]}</p>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaqItem}
            className="w-full py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2"
          >
            <AiOutlinePlusCircle className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Updating...' : 'Update FAQ'}
        </button>
      </form>
    </div>
  );
}