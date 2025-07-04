"use client";



interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  dealName?: string;
  isDeleting?: boolean;
}

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  dealName,
  isDeleting = false 
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-500/30 p-8 max-w-md w-full mx-4 shadow-2xl shadow-red-500/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/40">
              <span className="text-white text-xl font-bold">⚠</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <p className="text-gray-300 leading-relaxed">{message}</p>
            {dealName && (
              <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
                <p className="text-red-300 font-medium tracking-wide">
                  Deal: {dealName}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 font-medium transition-all duration-200 tracking-wide disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white px-6 py-3 font-bold transition-all duration-200 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 tracking-wide disabled:opacity-50"
            >
              {isDeleting ? 'DELETING...' : 'DELETE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
