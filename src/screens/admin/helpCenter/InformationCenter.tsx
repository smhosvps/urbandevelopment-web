import { Loader2, Plus, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useDeleteFaqMutation,
  useGetAllFaqQuery,
} from "@/redux/features/fag/faqApi";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  const { toast } = useToast();
 
  const { data: faqSections, isLoading, refetch } = useGetAllFaqQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteFaqSection, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const handleDeleteSection = async (id: any) => {
    try {
      await deleteFaqSection(id).unwrap();
      toast({
        title: "Success",
        description: "FAQ section deleted successfully",
      });
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ section",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard/help-center">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage FAQ Sections
          </h1>
        </div>

        <Link to="/dashboard/create-faq">
          <Button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" />
            Create Section
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Sections</CardTitle>
          <CardDescription>
            Manage your FAQ sections and their questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {faqSections && faqSections?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqSections &&
                  faqSections?.map((section: any) => (
                    <TableRow key={section._id}>
                      <TableCell className="font-medium">
                        {section.name}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {section.description}
                      </TableCell>
                      <TableCell>{section.faq?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/dashboard/edit-faq/${section._id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                          </Link>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the "
                                  {section.name}" section and all its questions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteSection(section._id)
                                  }
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  {isDeleting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No FAQ sections found. Create your first section to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
