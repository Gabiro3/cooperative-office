import { useState } from "react";
import API from "@/lib/axios-client";

export default function UploadComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file); // Make sure "file" matches the backend key

    setIsUploading(true);

    try {
      const response = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.data;
      console.log("Upload Response:", data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`File upload failed!: ${error}`);
    }

    setIsUploading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}
