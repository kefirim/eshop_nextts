"use client";

import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetColor from "@/app/components/products/SetColor";
import SetQuatity from "@/app/components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

interface ProductDetailsProps {
  product: any; // à typer mieux si possible
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

const Horizontal = () => <hr className="w-[30%] my-2" />;

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Toujours appeler les hooks en haut, hors conditions
  const { handleAddProductToCart, cartProducts } = useCart();

  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!product) return; // sécurité

    setCartProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      selectedImg: { ...product.images[0] },
      quantity: 1,
      price: product.price,
    });

    setIsProductInCart(false);

    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );
      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts, product]);

  // Si produit manquant ou données invalides, on affiche un message
  if (
    !product ||
    !product.images ||
    product.images.length === 0 ||
    !product.reviews
  ) {
    return <p>Produit non disponible ou données manquantes.</p>;
  }

  // Calcul sécurisé de la note moyenne
  const productRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
        product.reviews.length
      : 0;

  const handleColorSelect = useCallback((value: SelectedImgType) => {
    if (!cartProduct) return;
    setCartProduct({ ...cartProduct, selectedImg: value });
  }, [cartProduct]);

  const handleQtyIncrease = useCallback(() => {
    if (!cartProduct) return;
    setCartProduct((prev) => {
      if (!prev) return prev;
      if (prev.quantity >= 99) return prev;
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [cartProduct]);

  const handleQtyDecrease = useCallback(() => {
    if (!cartProduct) return;
    setCartProduct((prev) => {
      if (!prev) return prev;
      if (prev.quantity <= 1) return prev;
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [cartProduct]);

  if (!cartProduct) {
    // Evite le rendu avant initialisation du cartProduct
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        cartProduct={cartProduct}
        products={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <Horizontal />
        <div className="text-justify">{product.description}</div>
        <Horizontal />
        <div>
          <span className="font-semibold">CATEGORY:</span> {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND:</span> {product.brand}
        </div>
        <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>
          {product.inStock ? "In stock" : "Out of stock"}
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
                onClick={() => router.push("/cart")}
              />
            </div>
          </>
        ) : (
          <>
            <SetColor
              cartProduct={cartProduct}
              images={product.images}
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
                onClick={() => handleAddProductToCart(cartProduct)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
