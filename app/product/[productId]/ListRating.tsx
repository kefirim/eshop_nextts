"use client";

import Heading from "@/app/components/products/Heading";
import { Avatar, Rating } from "@mui/material";
import { format, parseISO } from 'date-fns';


interface ListRatingProps {
  product: any;
  
}


const ListRating: React.FC<ListRatingProps> = ({ product }) => {
   
 if(product.reviews.length === 0) return null

  return (
    <div>
      <Heading title="Product Review" />
      <div className="text-sm mt-2">
        {product.reviews &&
          product.reviews.map((review: any) => {
            const date = new Date(review.createdDate); // ✅ PAS de parseISO
          const formatted = format(date, "dd MMMM yyyy");
          
            return (
              <div key={review.id} className="max-w-[300px]">
                <div className="flex gap-2 items-center">
                  <Avatar src={review?.user.image} />
                  <div className="font-semibold">{review?.user.name}</div>
                  <div className="font-light">

                  {formatted}
                   
                  </div>
                </div>
                <div className="mt-2">
                  <Rating value={review.rating} readOnly />
                  <div className="ml-2">{review.comment}</div>
                  <hr className="mt-4 mb-4" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ListRating;
