export const revalidate = 0;

import Container from "./components/nav/Container";
import HomeBanner from "./components/nav/HomeBanner";
import ProductCard from "./components/products/productCard";
import getProducts, { IProductParams } from "@/actions/getProducts";
import NullData from "./components/NullData";

interface HomeProps {
 searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
   const category =
    typeof searchParams.category === "string" ? searchParams.category : undefined;

  const searchTerm =
    typeof searchParams.searchTerm === "string" ? searchParams.searchTerm : undefined;

  const products = await getProducts({ category, searchTerm });

  if (!products || products.length === 0) {
    return (
      <NullData title='Oops! No products found. Click "All" to clear filters' />
    );
  }

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledProducts = shuffleArray(products);

  return (
    <div className="p-8">
      <Container>
        <HomeBanner />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {shuffledProducts.map((product: any) => (
            <ProductCard data={product} key={product.id} />
          ))}
        </div>
      </Container>
    </div>
  );
}
