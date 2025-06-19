// Import de la police Poppins optimisée via Next.js
import { Poppins } from "next/font/google";

// Import des styles globaux CSS
import "./globals.css";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/footer/Footer";
import CartProvider from "@/providers/CartProvider";
import { Toaster } from "react-hot-toast";

// Configuration de la police Poppins avec des options
const poppins = Poppins({
  variable: "--font-poppins",    // Variable CSS personnalisée pour utiliser la police dans les styles
  subsets: ["latin"],            // Chargement uniquement des caractères latins pour optimiser la taille
  weight: ["400", "700"],        // Choix des variantes de poids de la police : normal (400) et gras (700)
});

// Composant de layout global de l'application
export default function RootLayout({
  children,                      // Représente le contenu des pages qui sera inséré ici
}: {
  children: React.ReactNode;     // Typage TypeScript : children est un élément React
}) {
  return (
    <html lang="en" suppressHydrationWarning>            
      <body className={`${poppins.className} text-slate-700`} >
      <Toaster
          toastOptions={{
            style: {
              background: "rgb(51 65 85)",
              color: "#fff",
            },
          }}
        />
         <CartProvider>
          <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children} </main>
          <Footer />
          </div>
         </CartProvider>
        
                    
      </body>
    </html>
  );
}
