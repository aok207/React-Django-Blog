import { useParams } from "react-router-dom";
import { useGetSingleBlogQuery } from "../slices/blogApiSlice";
import NotFoundPage from "./NotFoundPage";
import Loader from "../components/Loader";

const SingleBlogPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleBlogQuery(id);

  if (isError) {
    return <NotFoundPage />;
  }

  return (
    <div className="my-20 lg:max-w-4xl w-[90%] mx-auto flex flex-col gap-10 items-center text-left">
      {isLoading && (
        <Loader loading={true} override={{}} size={50} color="purple" />
      )}
      {data && (
        <>
          <img
            src={data.image}
            alt={data.title}
            className="transform scale-[0.9]"
          />
          <h1 className="text-3xl font-extrabold">{data.title}</h1>
          <p className="text-lg leading-loose font-">{data.description}</p>

          <div className="flex justify-between w-full">
            <div>
              author: <span className="font-semibold">{data.author}</span>
            </div>
            <span>On {data.created_at.slice(0, 10)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleBlogPage;
