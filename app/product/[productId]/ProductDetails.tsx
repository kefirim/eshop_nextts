"use client";

import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetColor from "@/app/components/products/SetColor";
import SetQuatity from "@/app/components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
//import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

interface ProductDetailsProps {
  products: any;
}

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImgType;
  quantity: number;
  price: number;
};

export type SelectedImgType = {
  color: string;
  colorCode: string;
  image: string;
};

const Horizontal = () => {
  return <hr className="w-[30%] my-2" />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ products }) => {
  if (
    !products ||
    !products.images ||
    products.images.length === 0 ||
    !products.reviews
  ) {
    return <p>Produit non disponible ou données manquantes.</p>;
  }
  const { handleAddProductToCart, cartProducts } = useCart();

  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: products.id,
    name: products.name,
    description: products.description,
    category: products.category,
    brand: products.brand,
    selectedImg: { ...products.images[0] },
    quantity: 1,
    price: products.price,
  });

   const router = useRouter();

  useEffect(() => {
    setIsProductInCart(false);

    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === products.id
      );
      console.log(cartProduct)

      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts,products.id]);

  // Calcul sécurisé de la note moyenne
  const productRating =
    products.reviews.length > 0
      ? products.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
        products.reviews.length
      : 0;

  const handleColorSelect = useCallback((value: SelectedImgType) => {
    setCartProduct((prev) => {
      return { ...prev, selectedImg: value };
    });
  }, []);

  const handleQtyIncrease = useCallback(() => {
    setCartProduct((prev) => {
      if (prev.quantity >= 99) return prev;
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, []);

  const handleQtyDecrease = useCallback(() => {
    setCartProduct((prev) => {
      if (prev.quantity <= 1) return prev;
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        cartProduct={cartProduct}
        products={products}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{products.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{products.reviews.length} reviews</div>
        </div>
        <Horizontal />
        <div className="text-justify">{products.description}</div>
        <Horizontal />
        <div>
          <span className="font-semibold">CATEGORY:</span> {products.category}
        </div>
        <div>
          <span className="font-semibold">BRAND:</span> {products.brand}
        </div>
        <div className={products.inStock ? "text-teal-400" : "text-rose-400"}>
          {products.inStock ? "In stock" : "Out of stock"}
        </div>
        <Horizontal />
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle className="text-teal-400" size={20} />
              <span>Product added to cart</span>
            </p>
            <div className="max-w-[300px]">
              <Button
                label="View Cart"
                outline
                onClick={() => {
                 router.push("/cart")
                }}
              />
            </div>
          </>
        ) : (
          <>
            <SetColor
              cartProduct={cartProduct}
              images={products.images}
              handleColorSelect={handleColorSelect}
            />
            <Horizontal />
            <SetQuatity
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <Horizontal />
            <div className="max-w-[300px]">
              <Button
                label="Add To Cart"
                onClick={() => {
                   handleAddProductToCart(cartProduct);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
