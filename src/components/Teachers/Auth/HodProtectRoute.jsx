import { AlertCircle, Lock, ArrowLeft } from "lucide-react";

export default function HodProtectedRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-red-500 p-4">
          <div className="flex items-center justify-center">
            <AlertCircle className="text-white mr-2" size={24} />
            <h2 className="text-xl font-bold text-white">Route Error</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <Lock className="text-red-500" size={32} />
            </div>
          </div>

          <p className="text-center text-gray-700 mb-6">
            Unfortunately, this page can only be accessed by the Head of
            Department.
          </p>
        </div>

        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t border-gray-200">
          Error code: 403 - Forbidden Access
        </div>
      </div>
    </div>
  );
}
