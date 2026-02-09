import { Button } from "@/components/ui/button";
import {
  useDeleteUserAdminMutation,
  useGetAllUsersQuery,
} from "@/redux/features/user/userApi";
import { EyeIcon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "jspdf-autotable";


type Props = {}

export default function Accounts({}: Props) {
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [deleteUserAdmin, { isSuccess, error }] = useDeleteUserAdminMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  console.log(setEntriesPerPage)
  const [searchName, setSearchName] = useState("");

  // Filter users
  const filteredUsers = (data?.users || []).filter((user: any) => {
    const searchTerm = searchName.trim().toLowerCase();
    const firstName = user?.firstName?.toLowerCase().trim() || '';
    const lastName = user?.lastName?.toLowerCase().trim() || '';
    const country = user?.country?.toLowerCase().trim() || '';
  
    return (
      firstName.includes(searchTerm) ||
      lastName.includes(searchTerm) ||
      `${firstName} ${lastName}`.includes(searchTerm) ||
      country.includes(searchTerm)
    );
  });
  // No sorting needed since we removed the sort controls
  const sortedUsers = [...filteredUsers];

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (isSuccess) {
      toast.success("User successfully deleted.");
      refetch();
    }
    if (error) {
      const errorData = error as any;
      toast.error(errorData.data.message);
    }
  }, [isSuccess, error]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUserAdmin(id);
    }
  };

  // CSV Download
  const handleDownloadCSV = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Country", "Phone", "Status"],
      ...sortedUsers.map((user) => [
        `"${user?.firstName}" "${user?.lastName}"`,
        `"${user?.email}"`,
        `"${user?.role}"`,
        `"${user?.country || ""}"`,
        `"${user?.phoneNumber || ""}"`,
        `"${user?.isVerified ? "Verified" : "Not Verified"}"`,
      ]),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <div className="mt-6 bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="flex justify-between border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Manage User's Accounts
          </h3>
          <div className="flex gap-4">
            <Button onClick={handleDownloadCSV}>Download CSV</Button>
            <Link to="/dashboard/add-admin-account">
              <Button className="bg-green-700 text-white">
                <PlusCircle className="mr-2" />
                Add Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name or country"
              className="p-2 border rounded w-2/3"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.map((user, index) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {indexOfFirstEntry + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.firstName} {""} {user?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.phoneNumber || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.country || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.isVerified == true && (
                          <Link to={`/dashboard/user-detail/${user._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 bg-green-700 text-white hover:bg-green-600 hover:text-white mr-2"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                See details
                              </span>
                            </Button>
                          </Link>
                        )}
                        {user.isVerified == true && (
                          <Link
                            to={`/dashboard/edit-admin-account/${user._id}`}
                            className="edit-link"
                          >
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="ml-2 text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  Showing {indexOfFirstEntry + 1} to{" "}
                  {Math.min(indexOfLastEntry, filteredUsers.length)} of{" "}
                  {filteredUsers.length} entries
                </span>
                <div>
                  <Button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    className="ml-2"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastEntry >= filteredUsers.length}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
