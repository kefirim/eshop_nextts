import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/libs/prismadb"; // Assure-toi que le chemin est correct

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing the stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send("Webhook error: " + (err as Error).message);
  }

  switch (event.type) {
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;

      if (typeof charge.payment_intent === "string") {
        const shippingAddress = charge.shipping?.address;

        // Formatage de l'adresse pour correspondre au type Prisma
        const formattedAddress = shippingAddress
          ? {
              city: shippingAddress.city ?? "",
              country: shippingAddress.country ?? "",
              line1: shippingAddress.line1 ?? "",
              line2: shippingAddress.line2 ?? undefined, // optionnel
              postal_code: shippingAddress.postal_code ?? "",
              state: shippingAddress.state ?? "",
            }
          : undefined;

        try {
          await prisma.order.update({
            where: { paymentIntentId: charge.payment_intent },
            data: {
              status: "complete",
              address: formattedAddress ? { set: formattedAddress } : undefined,
            },
          });
        } catch (error) {
          console.error("Prisma update error:", error);
          return res.status(500).send("Internal server error");
        }
      }
      break;

    default:
      console.log("Unhandled event type:", event.type);
  }

  res.json({ received: true });
}
