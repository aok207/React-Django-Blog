import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const cardVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  hover: {
    y: -15,
  },
};

const imageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  hover: {
    scale: 1.1,
  },
};

type CardTypes = {
  id: number;
  image: string;
  title: string;
  description: string;
  author: string;
};

const Card = ({ id, image, title, description, author }: CardTypes) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden group"
    >
      <motion.img
        loading="lazy"
        variants={imageVariants}
        className="rounded-t-lg object-cover"
        src={image}
        alt=""
      />
      <div className="p-5">
        <Link to={`/blogs/${id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-1">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <Link
            to={`/blogs/${id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Read more
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2 hidden group-hover:block"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
          <div>
            Written by:{" "}
            <span className="font-bold">
              {userInfo && userInfo.username === author ? "You" : author}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
