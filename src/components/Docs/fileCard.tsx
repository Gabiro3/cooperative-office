import React from "react";
import { Trash2 } from "lucide-react"; // Import the Trash icon

interface FileCardProps {
  url: string;
  id: string; // Add the document ID here
  onDelete: (url: string, id: string) => void; // Pass both url and id to the onDelete handler
}

const FileCard: React.FC<FileCardProps> = ({ url, id, onDelete }) => {
  // Extract file name from the URL
  const fileName = decodeURIComponent(url.split("/").pop() || "Unknown File");

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      onDelete(url, id); // Call the onDelete handler with both URL and ID
    }
  };

  return (
    <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg">
      {/* File Preview (Only for PDFs) */}
      {url.match(/\.(pdf)$/) ? (
        <img
          className="w-full h-40 object-cover"
          src="https://blog.idrsolutions.com/app/uploads/2020/10/pdf-1.png"
          alt={fileName}
        />
      ) : (
        <img
          className="w-full h-40 object-cover"
          src="https://1000logos.net/wp-content/uploads/2023/01/Google-Docs-logo.png"
          alt={fileName}
        />
      )}

      {/* File Details */}
      <div className="p-4">
        <h2 className="font-bold text-lg truncate">{fileName}</h2>
        <div className="mt-2 flex justify-between items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            Download
          </a>

          {/* Delete Icon */}
          <button
            onClick={handleDeleteClick}
            className="text-red-500 hover:text-red-600"
            title="Delete Document"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;