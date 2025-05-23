import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

const Login = () => {
  const [gender, setGender] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      // Validate if gender and dob are filled
      if (!gender) {
        toast.error("Gender is required");
        return;
      }
      if (!date) {
        toast.error("Date of Birth is required");
        return;
      }

      const provider = new GoogleAuthProvider(); // Create Google auth provider instance
      if (!auth) {
        throw new Error("Firebase auth instance is not initialized.");
      }

      // Proceed with Google sign-in if fields are valid
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid
      });

      // Handle response
      if ("data" in res) {
        toast.success(res.data!.message);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login">
      <main>
        <h1>Login</h1>
        <div>
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
