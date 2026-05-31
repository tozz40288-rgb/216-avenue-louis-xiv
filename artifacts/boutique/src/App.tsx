import { Switch, Route, Router as WouterRouter } from "wouter";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Marque from "@/pages/Marque";
import Contact from "@/pages/Contact";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Admin from "@/pages/Admin";
import Suivi from "@/pages/Suivi";
import ProductPage from "@/pages/ProductPage";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground relative selection:bg-foreground selection:text-background overflow-x-hidden">
      <Navbar />
      <CartPanel />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/marque" component={Marque} />
        <Route path="/contact" component={Contact} />
        <Route path="/checkout/success" component={CheckoutSuccess} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/shop/:id" component={ProductPage} />
        <Route path="/admin" component={Admin} />
        <Route path="/suivi/:id" component={Suivi} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </CartProvider>
  );
}

export default App;
