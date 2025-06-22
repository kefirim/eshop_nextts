import prisma from "@/libs/prismadb";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  isBefore,
  addDays,
  parseISO,
} from "date-fns";

export default async function getGraphData() {
  try {
    const startDate = startOfDay(subDays(new Date(), 6)); // 6 jours avant aujourd'hui
    const endDate = endOfDay(new Date()); // fin de journée aujourd'hui

    // Récupérer les commandes groupées par createDate
    const result = await prisma.order.groupBy({
      by: ["createDate"],
      where: {
        createDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },
      _sum: {
        amount: true,
      },
    });

    // Objet pour stocker les totaux par jour
    const aggregatedData: {
      [day: string]: { day: string; date: string; totalAmount: number };
    } = {};

    // Itérer sur chaque jour entre startDate et endDate
    for (
      let currentDate = startDate;
      !isBefore(endDate, currentDate);
      currentDate = addDays(currentDate, 1)
    ) {
      const day = format(currentDate, "EEEE"); // ex: Monday
      aggregatedData[day] = {
        day,
        date: format(currentDate, "yyyy-MM-dd"),
        totalAmount: 0,
      };
    }

    // Ajouter les montants des commandes par jour
   result.forEach((entry) => {
  const day = format(entry.createDate as Date, "EEEE"); // si TS exige un cast
  const amount = entry._sum.amount || 0;
  if (aggregatedData[day]) {
    aggregatedData[day].totalAmount += amount;
  }
});


    // Transformer en tableau et trier par date (en comparant les timestamps)
    const formattedData = Object.values(aggregatedData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return formattedData;
  } catch (error: any) {
    throw new Error(error);
  }
}
