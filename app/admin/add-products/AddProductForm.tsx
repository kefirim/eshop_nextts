"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Heading from "@/app/components/products/Heading";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox ";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import SelectColor from "@/app/components/inputs/SelectColor";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import { storage } from "@/libs/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [isProductCreated, setIsProductCreated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
    },
  });

  const setCustomValue = useCallback((id: string, value: unknown) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [setValue]);

  useEffect(() => {
    setCustomValue("images", images);
  }, [images, setCustomValue]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected!");
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("No selected image!");
    }

    const handleImageUploads = async () => {
      toast("Creating product, please wait..");
      try {
        for (const item of data.images as ImageType[]) {
          if (item.image) {
            const fileName = `${Date.now()}-${item.image.name}`;
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                },
                (error) => {
                  console.log("Error uploading image", error);
                  reject(error);
                },
                async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  uploadedImages.push({
                    ...item,
                    image: downloadURL,
                  });
                  resolve();
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Upload error:", error);
        return toast.error("Error uploading images.");
      }
    };

    await handleImageUploads();

    const productData = {
      ...data,
      images: uploadedImages,
    };

    axios
      .post("/api/product", productData)
      .then(() => {
        toast.success("Product created");
        setIsProductCreated(true);
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong when saving product to db");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const category = watch("category");

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        return prev.filter((item) => item.color !== value.color);
      }
      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a Product" center />
      <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />
      <Input id="price" label="Price" disabled={isLoading} register={register} errors={errors} type="number" required />
      <Input id="brand" label="Brand" disabled={isLoading} register={register} errors={errors} required />
      <TextArea id="description" label="Description" disabled={isLoading} register={register} errors={errors} required />
      <CustomCheckBox id="inStock" register={register} label="This product is in stock" />

      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
          {categories.map((item) => {
            if (item.label === "All") return null;
            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">Select the available product colors and upload their images.</div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise your color selection will be ignored.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => (
            <SelectColor
              key={index}
              item={item}
              addImageToState={addImageToState}
              removeImageFromState={removeImageFromState}
              isProductCreated={isProductCreated}
            />
          ))}
        </div>
      </div>

      <Button
        label={isLoading ? "Loading..." : "Add Product"}
        onClick={handleSubmit(onSubmit)}
        type="submit"
      />
    </>
  );
};

export default AddProductForm;
