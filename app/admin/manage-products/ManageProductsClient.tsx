"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";

import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";

import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/libs/firebase";

import Heading from "@/app/components/products/Heading";
import ActionBtn from "@/app/components/ActionBtn";
import Status from "@/app/components/Status";

interface ManageProductsClientProps {
  products: Product[];
}

type ProductImage = {
  image: string;
  color: string;
  colorCode: string;
};

type RowType = {
  id: string;
  name: string;
  price: string;
  category: string;
  brand: string;
  inStock: boolean;
  images: ProductImage[];
};

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({ products }) => {
  const router = useRouter();

  const rows: RowType[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatPrice(product.price),
    category: product.category,
    brand: product.brand,
    inStock: product.inStock,
    images: product.images as unknown as ProductImage[], // 🔒 safe cast si tu sais que c'est bien structuré
  }));

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price (USD)",
      width: 100,
      renderCell: (params) => (
        <div className="font-bold text-slate-800">{params.row.price}</div>
      ),
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 120,
      renderCell: (params) =>
        params.row.inStock ? (
          <Status
            text="in stock"
            icon={MdDone}
            bg="bg-teal-200"
            color="text-teal-700"
          />
        ) : (
          <Status
            text="out of stock"
            icon={MdClose}
            bg="bg-rose-200"
            color="text-rose-700"
          />
        ),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-between gap-4 w-full">
          <ActionBtn
            icon={MdCached}
            onClick={() => handleToggleStock(params.row.id, params.row.inStock)}
          />
          <ActionBtn
            icon={MdDelete}
            onClick={() => handleDelete(params.row.id, params.row.images)}
          />
          <ActionBtn
            icon={MdRemoveRedEye}
            onClick={() => router.push(`/product/${params.row.id}`)}
          />
        </div>
      ),
    },
  ];

  const handleToggleStock = useCallback(
    (id: string, inStock: boolean) => {
      axios
        .put("/api/product", {
          id,
          inStock: !inStock,
        })
        .then(() => {
          toast.success("Product status changed");
          router.refresh();
        })
        .catch((err) => {
          toast.error("Oops! Something went wrong");
          console.error(err);
        });
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string, images: ProductImage[]) => {
      toast("Deleting product, please wait...");

      try {
        for (const item of images) {
          if (item.image) {
            const imageRef = ref(storage, item.image);
            await deleteObject(imageRef);
            console.log("Image deleted:", item.image);
          }
        }
      } catch (error) {
        console.error("Error deleting images:", error);
      }

      axios
        .delete(`/api/product/${id}`)
        .then(() => {
          toast.success("Product deleted");
          router.refresh();
        })
        .catch((err) => {
          toast.error("Failed to delete product");
          console.error(err);
        });
    },
    [router]
  );

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 9 } },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageProductsClient;
