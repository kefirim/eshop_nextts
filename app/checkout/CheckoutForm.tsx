"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


import Button from "../components/Button";
import Heading from "../components/products/Heading";

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
    const router = useRouter();
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } =
    useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const formattedPrice = formatPrice(cartTotalAmount);


  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
  }, [stripe]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!stripe || !elements) return;

  setIsLoading(true);

  const result = await stripe.confirmPayment({
    elements,
    redirect: "if_required",
  });

  if (!result.error) {
    toast.success("Checkout Success");
    handleClearCart();
    handleSetPaymentSuccess(true);
    handleSetPaymentIntent(null);

    router.push("/checkout");
  } else {
    toast.error(result.error.message || "Payment failed");
  }

  setIsLoading(false);
};


  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mb-6">
        <Heading title="Enter your details to complete checkout" />
      </div>
      <h2 className="font-semibold mb-2">Address Information</h2>
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["US", "KE"],
        }}
      />
      <h2 className="font-semibold mt-4 mb-2">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="py-4 text-center text-slate-700 text-xl font-bold">
        Total: {formattedPrice}
      </div>
      <Button
        label={isLoading ? "Processing" : "Pay now"}
        disabled={isLoading || !stripe || !elements}
        type="submit"
      />
    </form>
  );
};

export default CheckoutForm;
