"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";

import Status from "@/app/components/Status";
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Heading from "@/app/components/products/Heading";

interface ManageOrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

type RowType = {
  id: string;
  customer: string;
  amount: string;
  paymentStatus: string;
  date: string;
  deliveryStatus: string; // ✅ plus de null ici
};

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders }) => {
  const router = useRouter();

  const rows: RowType[] = orders.map((order) => ({
    id: order.id,
    customer: order.user.name || "N/A",
    amount: formatPrice(order.amount / 100),
    paymentStatus: order.status,
    date: format(new Date(order.createDate), "dd MMM yyyy"),
    deliveryStatus: order.deliveryStatus || "pending", // ✅ fallback si null
  }));

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "customer", headerName: "Customer Name", width: 130 },
    {
      field: "amount",
      headerName: "Amount (USD)",
      width: 130,
      renderCell: (params) => (
        <div className="font-bold text-slate-800">{params.row.amount}</div>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell: (params) => (
        <>
          {params.row.paymentStatus === "pending" ? (
            <Status
              text="pending"
              icon={MdAccessTimeFilled}
              bg="bg-slate-200"
              color="text-slate-700"
            />
          ) : params.row.paymentStatus === "complete" ? (
            <Status
              text="completed"
              icon={MdDone}
              bg="bg-green-200"
              color="text-green-700"
            />
          ) : null}
        </>
      ),
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 130,
      renderCell: (params) => (
        <>
          {params.row.deliveryStatus === "pending" ? (
            <Status
              text="pending"
              icon={MdAccessTimeFilled}
              bg="bg-slate-200"
              color="text-slate-700"
            />
          ) : params.row.deliveryStatus === "dispatched" ? (
            <Status
              text="dispatched"
              icon={MdDeliveryDining}
              bg="bg-purple-200"
              color="text-purple-700"
            />
          ) : params.row.deliveryStatus === "delivered" ? (
            <Status
              text="delivered"
              icon={MdDone}
              bg="bg-green-200"
              color="text-green-700"
            />
          ) : null}
        </>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-between gap-4 w-full">
          <ActionBtn
            icon={MdDeliveryDining}
            onClick={() => handleDispatch(params.row.id)}
          />
          <ActionBtn
            icon={MdDone}
            onClick={() => handleDeliver(params.row.id)}
          />
          <ActionBtn
            icon={MdRemoveRedEye}
            onClick={() => router.push(`/order/${params.row.id}`)}
          />
        </div>
      ),
    },
  ];

  const handleDispatch = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "dispatched",
      })
      .then(() => {
        toast.success("Order Dispatched");
        router.refresh();
      })
      .catch(() => {
        toast.error("Oops! Something went wrong");
      });
  }, [router]);

  const handleDeliver = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "delivered",
      })
      .then(() => {
        toast.success("Order Delivered");
        router.refresh();
      })
      .catch(() => {
        toast.error("Oops! Something went wrong");
      });
  }, [router]);

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Orders" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageOrdersClient;
