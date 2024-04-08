import Card from "../components/Card";
import Loader from "../components/Loader";
import { useGetAllBlogsQuery } from "../slices/blogApiSlice";
import { PostType } from "../types/postType";

const HomePage = () => {
  const { data, isError, isLoading, error } = useGetAllBlogsQuery("");

  if (isError) {
    console.log(error);
  }

  return (
    <div className="max-w-7xl mx-auto py-10 grid space-y-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center place-items-baseline">
      {isLoading && (
        <Loader loading={true} override={{}} size={50} color="purple" />
      )}
      {data &&
        data.map((post: PostType) => (
          <Card
            key={post.id}
            id={post.id}
            title={post.title}
            image={post.image}
            description={post.description}
            author={post.author}
          />
        ))}
    </div>
  );
};

export default HomePage;
