import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useGetAllPrivacyQuery } from "@/redux/features/privacy/privacyApi";
import { Loader2 } from "lucide-react";

export default function PublicPrivacy() {
  const { data: privacyData, isLoading } = useGetAllPrivacyQuery({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Initialize form with existing data
  useEffect(() => {
    if (privacyData?.privacy) {
      setTitle(privacyData.privacy.title);
      setContent(privacyData.privacy.detail);
    }
  }, [privacyData]);

  if (isLoading) return <Loader2 className="text-blue-800" />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">SMHOS APP Privacy Policy</h1>
      </div>
      <div className="py-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div
          className="prose max-w-none text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
