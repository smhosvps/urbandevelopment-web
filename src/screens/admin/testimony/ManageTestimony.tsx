import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TestimonyForm } from "@/components/modal/TestimonyForm"
import { TestimoniesTable } from "@/components/modal/TestimoniesTable"

export default function TestimoniesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTestimony, setEditingTestimony] = useState(null)
  const { toast } = useToast()

  const handleEdit = (testimony:any) => {
    setEditingTestimony(testimony)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTestimony(null)
  }

  const handleSuccess = (message:any) => {
    toast({
      title: "Success",
      description: message,
    })
    handleCloseForm()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimony Management</h1>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800">
          <PlusCircle className="h-4 w-4" />
          Add Testimony
        </Button>
      </div>

      {isFormOpen ? (
        <TestimonyForm testimony={editingTestimony} onClose={handleCloseForm} onSuccess={handleSuccess} />
      ) : (
        <TestimoniesTable onEdit={handleEdit} />
      )}
    </div>
  )
}

