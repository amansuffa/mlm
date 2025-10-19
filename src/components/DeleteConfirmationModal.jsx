"use client";

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  blogTitle 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Delete Blog</h3>
              <p className="text-gray-600 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the blog post?
          </p>
          {blogTitle && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 font-semibold text-sm">
                "{blogTitle}"
              </p>
            </div>
          )}
          <p className="text-red-600 text-sm">
            ⚠️ All associated images and data will be permanently removed.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Delete Blog
          </button>
        </div>
      </div>
    </div>
  );
}