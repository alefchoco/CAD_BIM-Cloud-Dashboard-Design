import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Navigation, FileText, Mountain, Box, Upload, FolderOpen, Clock } from 'lucide-react';
import { useState } from 'react';
import { FileUploader } from '../components/FileUploader';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
  preview?: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [showUploader, setShowUploader] = useState(false);
  const [recentFiles, setRecentFiles] = useState([
    { name: 'Downtown_Office_Tower.rvt', type: 'Revit', date: '2 hours ago', icon: Box },
    { name: 'Site_Plan_A1.dwg', type: 'AutoCAD', date: 'Yesterday', icon: Navigation },
    { name: 'Elevation_Study.pdf', type: 'PDF', date: '3 days ago', icon: FileText },
  ]);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    // Add uploaded files to recent files
    const newFiles = files.map(file => {
      let type = 'Document';
      let icon = FileText;
      
      if (file.name.endsWith('.rvt')) {
        type = 'Revit';
        icon = Box;
      } else if (file.name.endsWith('.dwg')) {
        type = 'AutoCAD';
        icon = Navigation;
      } else if (file.name.endsWith('.pdf')) {
        type = 'PDF';
        icon = FileText;
      }

      return {
        name: file.name,
        type,
        date: 'Just now',
        icon,
      };
    });

    setRecentFiles([...newFiles, ...recentFiles].slice(0, 6));
  };

  const documentTypes = [
    {
      id: 'north',
      icon: Navigation,
      title: 'North Symbol',
      description: 'Import orientation & compass data',
      color: 'from-blue-500 to-blue-600',
      fileType: '.dwg, .dxf',
    },
    {
      id: 'revit',
      icon: Box,
      title: 'Revit',
      description: 'Load BIM models & families',
      color: 'from-purple-500 to-purple-600',
      fileType: '.rvt, .rfa',
    },
    {
      id: 'pdf',
      icon: FileText,
      title: 'PDF Plans',
      description: 'Import architectural drawings',
      color: 'from-red-500 to-red-600',
      fileType: '.pdf',
    },
    {
      id: 'terrain',
      icon: Mountain,
      title: 'Terrain Data',
      description: 'Load topography & site data',
      color: 'from-green-500 to-green-600',
      fileType: '.xyz, .las, .laz',
    },
    {
      id: 'elevation',
      icon: Box,
      title: '3D Elevation',
      description: 'Generate 3D building elevation',
      color: 'from-orange-500 to-orange-600',
      fileType: 'Create new',
    },
    {
      id: 'recent',
      icon: FolderOpen,
      title: 'Recent Files',
      description: 'Access your recent projects',
      color: 'from-slate-500 to-slate-600',
      fileType: 'Open',
    },
    {
      id: 'upload',
      icon: Upload,
      title: 'Upload Files',
      description: 'Upload new files to your project',
      color: 'from-gray-500 to-gray-600',
      fileType: 'Upload',
    },
  ];

  const handleCardClick = (id: string) => {
    if (id === 'upload') {
      setShowUploader(true);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center mb-6"
        >
          <img src="/logo.svg" alt="CAD/BIM Logo" className="w-20 h-20" />
        </motion.div>

        <h1 className="text-5xl font-bold text-white mb-4">
          CAD/BIM Cloud Platform
        </h1>
        <p className="text-xl text-slate-400">
          Modern Architecture & Engineering Management System
        </p>
      </motion.div>

      {/* File Uploader Modal */}
      {showUploader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploader(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Upload Files</h2>
              <button
                onClick={() => setShowUploader(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            
            <FileUploader onFilesUploaded={handleFilesUploaded} />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowUploader(false);
                  navigate('/dashboard');
                }}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Open in Dashboard
              </button>
              <button
                onClick={() => setShowUploader(false)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recent Files Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-6xl mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <Clock size={20} />
            <h2 className="text-lg font-semibold">Recent Files</h2>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentFiles.map((file, index) => {
            const Icon = file.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/dashboard')}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                      {file.name}
                    </div>
                    <div className="text-slate-400 text-xs mt-1">
                      {file.type} • {file.date}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Document Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.button
              key={type.id}
              onClick={() => {
                if (type.id === 'recent') {
                  // Show recent files
                } else {
                  setShowUploader(true);
                }
              }}
              className="relative bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-slate-200 text-left group overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Icon - SMALLER */}
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 relative z-10`}>
                <Icon className="text-white" size={18} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-base font-semibold text-slate-900 mb-1">{type.title}</h3>
                <p className="text-xs text-slate-600 mb-2">{type.description}</p>
                <span className="inline-block px-2 py-1 bg-slate-100 rounded text-[10px] font-mono text-slate-500">
                  {type.fileType}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-slate-500 text-sm mb-4">
          Or drag and drop files anywhere to start
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
        >
          Continue to Dashboard →
        </button>
      </motion.div>
    </div>
  );
}