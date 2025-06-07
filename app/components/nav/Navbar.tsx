import { Redressed } from "next/font/google";
import Container from "./Container";
import Link from "next/link";
import CartCount from "./CartCount";


const redressed =Redressed({subsets : ["latin"], weight:["400"]})
const Navbar = () => {
    return ( <div className="sticky top-0 w-full  bg-slate-200 z-30 shadow-30">
        <div className="py-4 border-b-[1px]">
            <Container >
                <div className="flex item-center justify-between gap-3 md:gap-0">
                <Link href="/" className={`${redressed.className} font-bold text-2xl`}>E-shop</Link>
                <div className="hidden md:block">search</div>
                <div className="flex items-center gap-8 md:gap-12">
               <CartCount />
                <div>UserMenu</div>
                </div>
                </div>
               
                
            </Container>
        </div>
    </div> );
}
 
export default Navbar;

