import { motion } from "framer-motion";
import { authContainerVariants } from "../framerMotionVariants";
import { useRegisterUserMutation } from "../slices/userApiSlice";
import { ChangeEvent, FormEvent, useState } from "react";
import Loader from "../components/Loader";
import "react-toastify/dist/ReactToastify.css";
import showToast from "../utils/showToast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUserInfo } from "../slices/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  async function handleRegisterSubmit(e: FormEvent) {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    if (!username || !password || !passwordConfirm) {
      showToast("error", "The input fields must not be blank.");
      return;
    }

    if (password !== passwordConfirm) {
      showToast("error", "The passwords do not match.");
      return;
    }

    try {
      await registerUser({
        username,
        password,
        password_confirm: passwordConfirm,
      }).unwrap();

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      dispatch(removeUserInfo());

      navigate("/login");
      showToast("success", "Account created successfully. Now please log in.");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast("error", error?.data?.detail);
    }
  }
  return (
    <motion.div
      variants={authContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center pt-20 px-6 py-8 mx-auto md:h-screen"
    >
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Register a new account
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleRegisterSubmit}
          >
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="password_confirm"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="password_confirm"
                id="password_confirm"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={passwordConfirm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPasswordConfirm(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:hover:bg-blue-600 disabled:dark:hover:bg-blue-600 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader
                  loading={isLoading}
                  override={{ marginRight: 6 }}
                  color="white"
                  size={15}
                />
              )}{" "}
              Register
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
