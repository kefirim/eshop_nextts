import Container from "@/app/components/nav/Container";
import ProductDetails from "./ProductDetails";
import { products } from "@/utils/products";
import ListRating from "./ListRating";

interface IParams {
  productId: string;
}

// 👇 async ici est la clé
const ProductPage = async ({ params }: { params: IParams }) => {
  console.log("params", params);

  // Si params est async dans ton contexte, le bug sera évité.
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return (
      <Container>
        <div className="p-8 text-center text-red-600">
          Produit non trouvé.
        </div>
      </Container>
    );
  }

  return (
    <div className="p-8">
      <Container>
        <ProductDetails products={product} />
          <div className="flex flex-col mt-20 gap-4">
          <div>AddRating </div>
           <ListRating product={product} />
           
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
