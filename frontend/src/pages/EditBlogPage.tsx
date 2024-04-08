import { Navigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useGetSingleBlogQuery } from "../slices/blogApiSlice";
import Loader from "../components/Loader";
import BlogForm from "../components/BlogForm";
import { useSelector } from "react-redux";

const EditBlogPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleBlogQuery(id);

  if (isError) {
    return <NotFoundPage />;
  }

  if (data) {
    console.log(data);
  }

  if (isLoading) {
    return <Loader loading={true} override={{}} size={50} color="purple" />;
  }

  if (!data || !id || !userInfo || userInfo.username !== data.author) {
    return <Navigate to="/" />;
  }

  return (
    <BlogForm
      type="update"
      initialContent={data.description}
      initialTitle={data.title}
      initialImage={data.image}
      id={parseInt(id)}
    />
  );
};

export default EditBlogPage;
