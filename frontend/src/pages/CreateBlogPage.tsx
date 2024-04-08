import BlogForm from "../components/BlogForm";

const CreateBlogPage = () => {
  return (
    <BlogForm
      initialTitle=""
      initialContent=""
      initialImage={null}
      type="create"
    />
  );
};

export default CreateBlogPage;
