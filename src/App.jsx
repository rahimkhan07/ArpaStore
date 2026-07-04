import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/registration/Login.jsx";
import Signup from "./pages/registration/Signup.jsx";
import Dashboard from "./pages/admin/dashboard/Dashboard.jsx";
import AllProducts from "./pages/allproducts/AllProducts.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Order from "./pages/order/Order.jsx";
import ProductInfo from "./pages/productInfo/ProductInfo.jsx";
import Wishlist from "./pages/wishlist/Wishlist.jsx";
import OrderSuccess from "./components/orderSuccess/OrderSuccess.jsx";
import NoPage from "./pages/nopage/NoPage.jsx";
import MyState from "./context/data/MyState.jsx";
import AuthProvider from "./components/protector/AuthContext.jsx";
import ProtectedRoute from "./components/protector/ProtectedRoute.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import { useAuth } from "./components/protector/AuthContext.jsx";

const ADMIN_EMAILS = ["i.raheem727@gmail.com", "asadalamaligg@gmail.com"];

/* Redirect logged-in users away from login/signup */
function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

/* Require authentication */
function AuthRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* Admin-only guard */
const AdminRoute = ({ children }) => {
  try {
    const admin = JSON.parse(localStorage.getItem("user"));
    if (admin && ADMIN_EMAILS.includes(admin.user.email)) return children;
  } catch {}
  return <Navigate to="/login" replace />;
};

function App() {
  const router = createBrowserRouter([
    /* ── Auth pages ── */
    { path: "/login",  element: <GuestRoute><Login /></GuestRoute> },
    { path: "/signup", element: <GuestRoute><Signup /></GuestRoute> },

    /* ── Main store (with navbar + footer) ── */
    {
      path: "/",
      element: <AuthRoute><Layout /></AuthRoute>,
      children: [
        { index: true,                  element: <Home /> },
        { path: "/allproducts",         element: <AllProducts /> },
        { path: "/productinfo/:id",     element: <ProductInfo /> },
        { path: "/cart",                element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: "/order",               element: <ProtectedRoute><Order /></ProtectedRoute> },
        { path: "/wishlist",            element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
        { path: "/order-success",       element: <ProtectedRoute><OrderSuccess /></ProtectedRoute> },
        { path: "/dashboard",           element: <AdminRoute><Dashboard /></AdminRoute> },
        { path: "/*",                   element: <NoPage /> },
      ],
    },
  ]);

  return (
    <AnimatePresence mode="wait">
      <AuthProvider>
        <MyState>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-center"
            autoClose={2000}
            theme="colored"
            transition={Bounce}
          />
        </MyState>
      </AuthProvider>
    </AnimatePresence>
  );
}

export default App;
