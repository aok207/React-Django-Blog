import axios from "axios";
import Loader from "../components/Loader";
import { PostType } from "../types/postType";
import showToast from "../utils/showToast";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteBlogMutation } from "../slices/blogApiSlice";

const modalBackdropVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

const modalVariants = {
  initial: {
    opacity: 0,
    y: -200,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -200,
    transition: {
      delay: 0.2,
      duration: 0.3,
    },
  },
};

const UserBlogsPage = () => {
  const [blogIsLoading, setIsLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<PostType[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Modal Data
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalId, setModalId] = useState(0);

  // Delete post
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();

  const handleDeleteBlog = async (id: number) => {
    try {
      await deleteBlog(id);
      const newBlogs = blogs.filter((blog) => blog.id !== id);
      setBlogs(newBlogs);
      setShowModal(false);
      showToast("success", "Deleted successfully.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      showToast("error", error.detail);
    }
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    const res = await axios.get(
      import.meta.env.VITE_BACKEND_BASE_URL + "/api/users/posts/",
      { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
    );

    if (res.status === 200) {
      setBlogs(res.data);
      setIsLoading(false);
      setIsError(false);
    } else {
      setIsLoading(false);
      setIsError(true);
      setError(res.data.detail);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (isError) {
    showToast("error", error);
  }

  return (
    <div className="w-[90%] overflow-hidden mx-auto rounded-lg shadow-xs mt-4 mb-4">
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalBackdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-screen md:inset-0 h-screen flex max-h-screen bg-gray-950/50"
          >
            <motion.div
              variants={modalVariants}
              className="relative p-4 w-full max-w-2xl max-h-full"
            >
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Delete: {modalTitle}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the blog?
                  </p>
                </div>
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => handleDeleteBlog(modalId)}
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 w-full flex justify-between">
        <h1 className="font-bold text-3xl">Your blogs</h1>
        <Link
          to="/blogs/create"
          className="w-fit text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create+
        </Link>
      </div>

      {blogIsLoading && (
        <Loader loading={true} override={{}} size={50} color="purple" />
      )}

      {blogs.length === 0 && !isLoading && (
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          You haven't written any blogs yet.
        </p>
      )}

      {blogs.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">Cover Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {blogs.map((blog) => (
                <tr
                  className="text-gray-700 dark:text-gray-400 user-row"
                  key={blog.id}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm w-[120px]">
                      <img
                        loading="lazy"
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{blog.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{blog.created_at}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <Link
                        to={"/blogs/" + blog.id + "/edit"}
                        className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                        aria-label="Edit"
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                      </Link>
                      <button
                        onClick={() => {
                          setModalId(blog.id);
                          setModalTitle(blog.title);
                          setShowModal(true);
                        }}
                        className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserBlogsPage;
