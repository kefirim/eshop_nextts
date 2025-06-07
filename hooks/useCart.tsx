
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect

} from "react";
import toast from "react-hot-toast";


type CartContextType = {
  cartTotalQty: number;
   cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
 
 
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
   const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );

    useEffect(() => {
    const cartItems: any = localStorage.getItem("eShopCartItems");
    //const cProducts: CartProductType[] | null = JSON.parse(cartItems);
    
     try {
    const cProducts: CartProductType[] = cartItems ? JSON.parse(cartItems) : [];

    if (Array.isArray(cProducts)) {
       setCartProducts(cProducts);
    } else {
      setCartProducts([]);
    }
  } catch (error) {
    console.error("Failed to parse cart items from localStorage", error);
    setCartProducts([]);
  }
   

    
    
  }, []);
 
  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;

      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }

     
     localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
 return updatedCart
    });
     toast.success("Product added to cart");
  }, []);

 const value = {
    cartTotalQty,
    cartProducts,
    handleAddProductToCart,
 
  };

  return <CartContext.Provider value={value} {...props} />;
};

  export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }

  return context;
};