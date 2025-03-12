import React, { useEffect, useState } from "react";
import FileCard from "./fileCard";
import API from "@/lib/axios-client";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

interface CustomFile {
  _id: string; // Ensure the file object includes the ID field
  name: string;
  fileUrl: string;
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const workspaceId = useWorkspaceId();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const name = user?.name || "Unknown";

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?._id;

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      if (!workspaceId) {
        console.error("Workspace ID not found");
        return;
      }

      const response = await API.post(`/documents`, 
        { cooperativeId: workspaceId },
        {
          headers: {
            userId: userId,
          },
        }
      );

      const data = response.data;
      setFiles(data.documents);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleDelete = async (url: string, id: string) => {
    try {
      const response = await API.delete("/delete-file", { data: { fileUrl: url, documentId: id } });
      console.log("File deleted successfully:", response.data);
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
        variant: "success",
      });

      // Refetch files after deletion
      fetchFiles();
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "An error occurred",
        description: "Your document could not be deleted. Try again!",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    if (!workspaceId) return alert("Workspace ID not found!");
    if (!name) return alert("User full name not found!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("cooperativeId", workspaceId);
    formData.append("uploadedBy", name);

    setIsUploading(true);

    try {
      const response = await API.post("/upload", formData);
      const data = response.data;
      console.log("Upload Response:", data);
      toast({
        title: "Document uploaded",
        description: "Document uploaded successfully!",
        variant: "success",
      });

      // Refetch files after upload
      fetchFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "An error occurred",
        description: "Your document was not uploaded. Try again!",
        variant: "destructive",
      });
    }

    setIsUploading(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Uploaded Files</h1>

      {/* Upload Section */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
          accept=".pdf,.docx"
        />
        <label
          htmlFor="fileInput"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-600"
        >
          <Plus />
          Upload Document
        </label>
        {file && (
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoadingFiles ? (
          <div className="flex justify-center items-center w-full h-32">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file, index) => (
            <FileCard 
              key={index} 
              url={file.fileUrl} 
              id={file._id} // Pass the document ID to FileCard
              onDelete={handleDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileList;