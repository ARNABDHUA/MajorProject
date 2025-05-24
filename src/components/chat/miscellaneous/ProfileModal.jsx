import { useState } from "react";

const ProfileModal = ({ user, children, isOpen: externalIsOpen, onClose: externalOnClose }) => {
  const [isInternalOpen, setIsInternalOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : isInternalOpen;
  const onClose = externalOnClose || (() => setIsInternalOpen(false));
  const onOpen = () => setIsInternalOpen(true);

  return (
    <>
      {children ? (
        <span onClick={onOpen} className="cursor-pointer">{children}</span>
      ) : (
        <button 
          className="flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={onOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300" 
            onClick={onClose}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg z-10 animate-fade-in">
            {/* Header */}
            <div className="relative border-b px-6 py-4 flex items-center justify-center">
              <h2 className="text-2xl sm:text-3xl font-semibold font-sans text-center text-gray-800">
                {user.name}
              </h2>
              <button 
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                onClick={onClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-8 flex flex-col items-center space-y-6">
              <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-full overflow-hidden bg-gray-100 shadow-inner">
                {user.pic ? (
                  <img 
                    src={user.pic} 
                    alt={user.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl text-gray-500">
                    {user.name?.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-lg sm:text-xl text-gray-700 font-medium break-all text-center">
                Email: {user.email}
              </p>
              {
                user.isstudent ?(<p className="text-lg sm:text-xl bg-blue-400 p-1 rounded-xl text-gray-700 font-medium break-all text-center">
                Student
              </p>):(user.valid_teacher?(<p className="text-lg bg-green-400 rounded-xl p-1 sm:text-xl text-gray-700 font-medium break-all text-center">
                Teacher
              </p>):(<p className="text-lg sm:text-xl bg-amber-400 rounded-xl p-1 text-gray-700 font-medium break-all text-center">
                Admin
              </p>))
              }
              {/* <p className="text-lg sm:text-xl text-gray-700 font-medium break-all text-center">
                Email: {user.email}
              </p> */}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end">
              <button 
                onClick={onClose} 
                className="px-4 py-2 text-sm sm:text-base bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
