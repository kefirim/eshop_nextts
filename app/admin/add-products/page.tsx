import Container from "@/app/components/nav/Container";
import FormWrap from "@/app/components/FormWrap";
//import AddProductForm from "./AddProductForm";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import AddProductForm from "./AddProductForm";

const AddProducts = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AddProducts;
