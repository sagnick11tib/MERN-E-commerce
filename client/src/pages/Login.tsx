import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [gender, setGender] = useState<string>('');
  const [date, setDate] = useState<string>('');

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <main className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-center">
            <p className="mb-4 text-gray-600">Already Signed In Once</p>
            <button className="flex items-center justify-center w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700">
              <FcGoogle className="mr-2" /> <span>Sign in with Google</span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;