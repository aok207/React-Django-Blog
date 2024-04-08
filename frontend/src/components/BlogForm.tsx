import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../components/Loader";
import {
  useCreateNewBlogMutation,
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
} from "../slices/blogApiSlice";
import showToast from "../utils/showToast";
import { useNavigate } from "react-router-dom";

const buttonVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      type: "spring",
    },
  },
  exit: {
    opacity: 0,
    x: "100vw",
  },
};

type BlogFormType = {
  id?: number | null;
  initialTitle: string;
  initialContent: string;
  initialImage: string | null;
  type: "create" | "update";
};

// Shared refetch function
let sharedRefetchFunction: (() => void) | null = null;

// Turn
const getUrlExtension = (url: string) => {
  return url!.split(/[#?]/)[0]!.split(".")!.pop()!.trim();
};

// Turn image src to file object
const turnImageURLToFile = async (imgUrl: string) => {
  const imgExt = getUrlExtension(imgUrl);

  const response = await fetch(imgUrl);
  const blob = await response.blob();
  const file = new File([blob], "profileImage." + imgExt, {
    type: blob.type,
  });

  return file;
};

const BlogForm = ({
  id = null,
  initialTitle,
  initialContent,
  initialImage,
  type,
}: BlogFormType) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<null | File | string>(initialImage);

  const { refetch: singleBlogRefetch } = useGetSingleBlogQuery(
    id === null ? 0 : id
  );

  const { refetch: allBlogsRefetch } = useGetAllBlogsQuery(null);

  const [createNewBlog] = useCreateNewBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Set the shared refetch function
  sharedRefetchFunction = () => {
    singleBlogRefetch();
    allBlogsRefetch();
  };

  async function handleCreateFormSubmit(formData: FormData) {
    try {
      const res = await createNewBlog(formData);
      console.log(res.data);

      showToast("success", "Blog created successfully.");

      setTitle("");
      setContent("");
      setImage(null);
      setIsLoading(false);

      if (sharedRefetchFunction) {
        sharedRefetchFunction();
      }

      navigate(`/blogs/${res.data.id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      showToast("error", err.detail);
    }
  }

  const handleUpdateFormSubmit = async (formData: FormData) => {
    try {
      const res = await updateBlog({ id: id, formData: formData });
      console.log(res.data);

      setTitle("");
      setContent("");
      setImage(null);
      setIsLoading(false);

      showToast("success", "Blog updated successfully.");

      if (sharedRefetchFunction) {
        sharedRefetchFunction();
      }

      navigate(`/blogs/${res.data.id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      showToast("error", err.detail);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    if (!title || !content) {
      showToast("error", "The input fields must not be blank.");
      return;
    }

    if (type === "create" && !image) {
      showToast("error", "The cover image is required.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", content);

    if (type === "update" && typeof image === "string") {
      const fileObj = await turnImageURLToFile(image);
      formData.append("image", fileObj);
    } else {
      formData.append("image", image);
    }

    if (type === "create") {
      handleCreateFormSubmit(formData);
    } else {
      handleUpdateFormSubmit(formData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-10 w-fit mx-auto">
        {type === "create" ? "Create a new blog" : "Edit: " + initialTitle}
      </h1>
      <form
        className="max-w-sm mx-auto"
        encType="multipart/form-data"
        onSubmit={handleFormSubmit}
      >
        <div className="mb-5">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="content"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Content
          </label>
          <textarea
            id="content"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your content here..."
            onChange={(e) => setContent(e.target.value)}
            defaultValue={content}
          ></textarea>
        </div>
        <div className="mb-5">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload Cover Image
          </label>

          {image && (
            <img
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt=""
              className="my-4"
            />
          )}
          <input
            className="block p-2.5 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept="image/*"
            required={type === "create"}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImage(e.target.files[0]);
              }
            }}
          />
        </div>
        <AnimatePresence>
          {title && content && image && (
            <motion.button
              key="create-blog-btn"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:hover:bg-blue-700 disabled:hover:dark:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader
                  loading={isLoading}
                  override={{}}
                  color="#fff"
                  size={15}
                />
              ) : (
                <>{type === "create" ? "Create" : "Update"}</>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default BlogForm;
