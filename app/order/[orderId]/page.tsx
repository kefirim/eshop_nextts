import Container from "@/app/components/nav/Container";
import OrderDetails from "./OrderDetails";

import NullData from "@/app/components/NullData";
import getOrderById from "@/actions/getOrderById";

interface IPrams {
  orderId?: string;
}

const Order = async ({ params }: { params: IPrams }) => {
  const order = await getOrderById(params);

  if (!order) return <NullData title="No order"></NullData>;

  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default Order;
