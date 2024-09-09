import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase"; // Ensure this is correctly imported
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

const Login = () => {
  const [gender, setGender] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const [ login ] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      if (!auth) {
        throw new Error("Firebase auth instance is not initialized.");
      }
      const { user } = await signInWithPopup(auth, provider);
      console.log(user.photoURL);
      const res = await login({
       name: user.displayName!,//! is used to tell typescript that this value will never be null
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid
      })
      console.log(res);
      if ("data" in res){
        toast.success(res.data!.message);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // if (error.code === 'auth/popup-closed-by-user') {
      //   toast.error("Popup closed by user before completing the sign in.");
      // } else if (error.code === 'auth/network-request-failed') {
      //   toast.error("Network error. Please check your internet connection.");
      // } else if (error.code === 'auth/argument-error') {
      //   toast.error("Invalid arguments provided. Please try again.");
      // } else {
      //   toast.error("Failed to login. Please try again.");
      // }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {
        
      }
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
          <button onClick={loginHandler} className="flex items-center justify-center w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700">
            <FcGoogle className="mr-2" /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;