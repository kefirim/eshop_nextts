import Container from "@/app/components/nav/Container";

import ListRating from "./ListRating";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";

import getCurrentUser from "@/actions/getCurrentUser";
import ProductDetails from "./ProductDetails";

interface IPrams {
  productId?: string;
}

const Product = async({ params }: { params: IPrams }) => {

  const product = await getProductById(params)
  const user = await getCurrentUser()

  if(!product) return <NullData title="Oops! Product with the given id does not exist"/>

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
