// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../config/firebase";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { BASE_URL } from "./../../api/BASE_URL";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // React Query Mutation for login
  const loginMutation = useMutation(
    (userData) => axios.post(`${BASE_URL}/api/auth_user`, userData),
    {
      onSuccess: (data) => {
        // Invalidate and refetch any queries that depend on user data
        queryClient.invalidateQueries("user");

        // Handle successful login
        // console.log(data.data);
        navigate("/");
      },
      onError: (error) => {
        // Handle login error
        console.log(error);
      },
    }
  );

  const handleGoogleClick = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const uid = result?.user?.uid;
        const displayName = result?.user?.displayName;
        const email = result?.user?.email;

        // Check if any of the required properties are undefined
        if (
          uid === undefined ||
          displayName === undefined ||
          email === undefined
        ) {
          console.error("Invalid user data received from authentication");
          return;
        }

        // Call the login API using React Query and Axios
        loginMutation.mutate({ uid, displayName, email });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="w-full h-screen flex items-center flex-col justify-around relative">
      <div className="flex items-center justify-center flex-col">
        <img className="w-[32vw] " src="/96.webp" alt="" />
        <p className="uppercase font-extrabold text-[8.56vw]">trackz</p>
      </div>

      <button
        onClick={handleGoogleClick}
        className="bottom-[25vw] flex items-center justify-center gap-[2vw] border border-gray-400 px-[8vw] py-[2vw] rounded-lg active:scale-95"
      >
        <FcGoogle className="text-[5.5vw]" />
        <span className="text-[4.5vw] font-medium">Login with Google</span>
      </button>
    </div>
  );
};

export default Login;
