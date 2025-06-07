import { Container } from "@mui/material";
import CartClient from "./CartClient";



const Cart = async () => {


  return (
    <div className="pt-8">
      <Container>
        <CartClient />
      </Container>
    </div>
  );
};

export default Cart;