import { motion } from 'motion/react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
  preview?: string;
}

interface FileUploaderProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

export function FileUploader({ 
  onFilesUploaded, 
  acceptedTypes = ".dwg,.rvt,.pdf,.tif,.jpg,.png",
  maxSize = 50 
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
        continue;
      }

      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    }

    const updated = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updated);
    onFilesUploaded(updated);
  };

  const removeFile = (index: number) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    onFilesUploaded(updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white/50 hover:border-slate-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ y: dragActive ? -10 : 0 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              dragActive ? 'bg-blue-500' : 'bg-slate-200'
            }`}
          >
            <Upload
              size={32}
              className={dragActive ? 'text-white' : 'text-slate-600'}
            />
          </motion.div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {dragActive ? 'Drop files here' : 'Upload CAD/BIM Files'}
          </h3>

          <p className="text-sm text-slate-500 mb-4">
            Drag and drop or click to browse
          </p>

          <button
            onClick={() => inputRef.current?.click()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Browse Files
          </button>

          <p className="text-xs text-slate-400 mt-4">
            Supported: {acceptedTypes.replace(/\./g, '').toUpperCase().split(',').join(', ')} (Max {maxSize}MB)
          </p>
        </div>
      </motion.div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3"
        >
          <h4 className="text-sm font-semibold text-slate-700">
            Uploaded Files ({uploadedFiles.length})
          </h4>

          {uploadedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-200 shadow-sm"
            >
              {/* File Icon/Preview */}
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <File size={20} className="text-blue-500" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-900 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-slate-500">
                  {formatFileSize(file.size)}
                </div>
              </div>

              {/* Success Icon */}
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />

              {/* Remove Button */}
              <button
                onClick={() => removeFile(index)}
                className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={16} className="text-red-500" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
