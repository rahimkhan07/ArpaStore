import { useEffect } from "react";
import { useData } from "../../context/data/MyState";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/FirebaseConfig";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaShoppingBag,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

function Profile() {
  const { mode, order } = useData();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist);

  // Filter orders belonging to this user
  const userOrders = order.filter((o) => o.userid === user?.user?.uid);

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear("user");
    navigate("/");
    toast.success("Logout Successfully!");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: mode === "dark" ? "#282c34" : "#F0EBE3",
        }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
            Please Login First
          </h2>
          <Link
            to="/login"
            className="bg-[#F3D0D7] text-[#232F3E] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFEFEF] transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: mode === "dark" ? "#282c34" : "#F0EBE3",
        color: mode === "dark" ? "white" : "#232F3E",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div
          className="rounded-2xl shadow-lg p-8 mb-6"
          style={{
            backgroundColor: mode === "dark" ? "#374151" : "white",
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{
                  backgroundColor: "#F3D0D7",
                  color: "#232F3E",
                }}
              >
                {user?.user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {user?.user?.email?.split("@")[0]}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-2">
                <FaEnvelope />
                <span>{user?.user?.email}</span>
              </div>
              {user?.user?.metadata?.creationTime && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
                  <FaCalendarAlt />
                  <span>
                    Member since{" "}
                    {new Date(user.user.metadata.creationTime).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Admin Badge */}
            {user?.user?.email === "i.raheem727@gmail.com" && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                <FaUserShield />
                ADMIN
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link to="/orders">
            <div
              className="rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              style={{ backgroundColor: mode === "dark" ? "#374151" : "white" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{userOrders.length}</p>
                </div>
                <FaShoppingBag className="text-4xl text-blue-500" />
              </div>
            </div>
          </Link>

          <Link to="/wishlist">
            <div
              className="rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              style={{ backgroundColor: mode === "dark" ? "#374151" : "white" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Wishlist Items</p>
                  <p className="text-3xl font-bold">{wishlistItems.length}</p>
                </div>
                <FaHeart className="text-4xl text-pink-500" />
              </div>
            </div>
          </Link>

          <Link to="/cart">
            <div
              className="rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              style={{ backgroundColor: mode === "dark" ? "#374151" : "white" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Cart Items</p>
                  <p className="text-3xl font-bold">{cartItems.length}</p>
                </div>
                <FaShoppingCart className="text-4xl text-yellow-500" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-6"
          style={{
            backgroundColor: mode === "dark" ? "#374151" : "white",
          }}
        >
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/orders"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition"
              style={{
                backgroundColor: mode === "dark" ? "#4B5563" : "#F9FAFB",
              }}
            >
              <FaShoppingBag className="text-2xl text-blue-500" />
              <div>
                <p className="font-semibold">My Orders</p>
                <p className="text-sm text-gray-500">View your order history</p>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition"
              style={{
                backgroundColor: mode === "dark" ? "#4B5563" : "#F9FAFB",
              }}
            >
              <FaHeart className="text-2xl text-pink-500" />
              <div>
                <p className="font-semibold">My Wishlist</p>
                <p className="text-sm text-gray-500">View saved items</p>
              </div>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition"
              style={{
                backgroundColor: mode === "dark" ? "#4B5563" : "#F9FAFB",
              }}
            >
              <FaShoppingCart className="text-2xl text-yellow-500" />
              <div>
                <p className="font-semibold">My Cart</p>
                <p className="text-sm text-gray-500">View cart items</p>
              </div>
            </Link>

            {user?.user?.email === "i.raheem727@gmail.com" && (
              <Link
                to="/dashboard"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition"
                style={{
                  backgroundColor: mode === "dark" ? "#4B5563" : "#F9FAFB",
                }}
              >
                <FaUserShield className="text-2xl text-red-500" />
                <div>
                  <p className="font-semibold">Admin Dashboard</p>
                  <p className="text-sm text-gray-500">Manage products & orders</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg"
        >
          <FaSignOutAlt className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
