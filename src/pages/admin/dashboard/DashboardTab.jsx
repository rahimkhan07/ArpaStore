import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus, FaImages, FaHandshake, FaFilePdf } from "react-icons/fa";
import { AiFillShopping, AiFillDelete } from "react-icons/ai";
import { useData } from "../../../context/data/MyState";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import ManageSlider from "../page/ManageSlider";
import jsPDF from "jspdf";
function DashboardTab() {
  const context = useData();
  const dark = false;
  const { mode, product, editHandle, deleteProduct, order, users, sellerRequests, deleteSellerRequest, updateOrderStatus, deleteOrder } = context;
  console.log(product);
  let [isOpen, setIsOpen] = useState(false);
  const orderRef = useRef(null);

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 14;
    let y = margin;

    const checkPage = (needed = 10) => {
      if (y + needed > pageH - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(35, 47, 62);
    pdf.text("ARPA Collection - Order Details", pageW / 2, y, { align: "center" });
    y += 6;
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageW / 2, y, { align: "center" });
    y += 8;
    pdf.setDrawColor(243, 208, 215);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageW - margin, y);
    y += 6;

    order.forEach((o, idx) => {
      checkPage(40);

      // Order header background
      pdf.setFillColor(255, 245, 247);
      pdf.roundedRect(margin, y, pageW - margin * 2, 22, 3, 3, "F");

      pdf.setFontSize(8);
      pdf.setTextColor(136, 136, 136);
      pdf.text("PAYMENT ID", margin + 3, y + 5);
      pdf.text("CUSTOMER", margin + 55, y + 5);
      pdf.text("PHONE", margin + 95, y + 5);
      pdf.text("DATE & TIME", margin + 130, y + 5);
      pdf.text("STATUS", margin + 168, y + 5);

      const orderTime = o.time?.toDate
        ? o.time.toDate().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
        : "";

      pdf.setFontSize(9);
      pdf.setTextColor(35, 47, 62);
      pdf.text(String(o.paymentId || ""), margin + 3, y + 13, { maxWidth: 48 });
      pdf.text(String(o.addressInfo?.name || ""), margin + 55, y + 13, { maxWidth: 36 });
      pdf.text(String(o.addressInfo?.phoneNumber || ""), margin + 95, y + 13, { maxWidth: 32 });
      pdf.text(`${String(o.date || "")}`, margin + 130, y + 11, { maxWidth: 34 });
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(orderTime, margin + 130, y + 16, { maxWidth: 34 });

      // Status badge color
      const status = o.status || "pending";
      const statusColors = {
        confirmed: [21, 128, 61],
        pending: [133, 77, 14],
        cancelled: [185, 28, 28],
      };
      const [r, g, b] = statusColors[status] || statusColors.pending;
      pdf.setTextColor(r, g, b);
      pdf.setFontSize(9);
      pdf.text(status.toUpperCase(), margin + 168, y + 13);

      y += 26;

      // Address row
      checkPage(8);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`📍 ${o.addressInfo?.address || ""}, ${o.addressInfo?.pincode || ""}   📧 ${o.email || ""}`, margin + 3, y);
      y += 7;

      // Items
      o.cartItems?.forEach((item) => {
        checkPage(12);
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(margin + 2, y, pageW - margin * 2 - 4, 10, 2, 2, "F");
        pdf.setFontSize(9);
        pdf.setTextColor(35, 47, 62);
        pdf.text(String(item.title || ""), margin + 6, y + 6.5, { maxWidth: 90 });
        pdf.setTextColor(100, 100, 100);
        pdf.text(String(item.category || ""), margin + 100, y + 6.5, { maxWidth: 40 });
        pdf.setTextColor(255, 153, 0);
        pdf.text(`Rs.${item.price}`, pageW - margin - 6, y + 6.5, { align: "right" });
        y += 12;
      });

      // Divider
      checkPage(6);
      pdf.setDrawColor(243, 208, 215);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageW - margin, y);
      y += 6;
    });

    pdf.save(`ARPA_Orders_${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}.pdf`);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const add = () => {
    window.location.href = "/addproduct";
  };

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <>
      <div className="container mx-auto">
        <div className="tab container mx-auto ">
          <Tabs defaultIndex={0} className=" ">
            <TabList className="md:flex md:space-x-8 bg-  grid grid-cols-2 text-center gap-4   md:justify-center mb-10 ">
              <Tab>
                <button
                  type="button"
                  className="font-medium border-b-2 hover:shadow-purple-700 border-purple-500 text-purple-500 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]  px-5 py-1.5 text-center bg-[#605d5d12] "
                >
                  <div className="flex gap-2 items-center">
                    <MdOutlineProductionQuantityLimits />
                    Products
                  </div>{" "}
                </button>
              </Tab>
              <Tab>
                <button
                  type="button"
                  className="font-medium border-b-2 border-yellow-500 bg-[#605d5d12] text-yellow-500  hover:shadow-yellow-700  rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]    px-5 py-1.5 text-center "
                >
                  <div className="flex gap-2 items-center">
                    <AiFillShopping /> Order
                  </div>
                </button>
              </Tab>
              <Tab>
                <button
                  type="button"
                  className="font-medium border-b-2 border-green-500 bg-[#605d5d12] text-green-500 rounded-lg text-xl  hover:shadow-green-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]   px-5 py-1.5 text-center "
                >
                  <div className="flex gap-2 items-center">
                    <FaUser /> Users
                  </div>
                </button>
              </Tab>
              <Tab>
                <button
                  type="button"
                  className="font-medium border-b-2 border-pink-400 bg-[#605d5d12] text-pink-400 hover:shadow-pink-400 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center"
                >
                  <div className="flex gap-2 items-center">
                    <FaImages /> Slider
                  </div>
                </button>
              </Tab>
              <Tab>
                <button
                  type="button"
                  className="font-medium border-b-2 border-orange-400 bg-[#605d5d12] text-orange-400 hover:shadow-orange-400 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center"
                >
                  <div className="flex gap-2 items-center">
                    <FaHandshake /> Sellers
                  </div>
                </button>
              </Tab>
            </TabList>
            {/* product  */}
            <TabPanel>
              <div className="  px-4 md:px-0 mb-16">
                <h1
                  className=" text-center mb-5 text-3xl font-semibold underline"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Product Details
                </h1>
                <div className=" flex justify-end">
                  

                  <button
                    onClick={add}
                    type="button"
                    className="text-white bg-[#FF9900] hover:bg-[#cc7a00] font-semibold rounded-lg text-sm px-5 py-2.5 mb-2 mr-4 transition-all duration-300 shadow-md"
                    style={{
                      backgroundColor: mode === "dark" ? "#232F3E" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      Add Product <FaCartPlus size={20} />
                    </div>
                  </button>
                </div>
                <div className="relative overflow-x-auto ">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                    <thead
                      className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]"
                      style={{
                        backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                        color: mode === "dark" ? "white" : "",
                      }}
                    >
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Image
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    {product.map((item, index) => {
                      const {
                        title,
                        price,
                        imageUrl,
                        category,
                        type,
                        description,
                        date,
                      } = item;
                      return (
                        <tbody key={index} className="">
                          <tr
                            className="bg-gray-50 border-b  dark:border-gray-700"
                            style={{
                              backgroundColor:
                                mode === "dark" ? "rgb(46 49 55)" : "",
                              color: mode === "dark" ? "white" : "",
                            }}
                          >
                            <td
                              className="px-6 py-4 text-black font-bold"
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {index + 1}
                            </td>
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-black whitespace-nowrap"
                            >
                              <img className="w-16" src={imageUrl} alt="img" />
                            </th>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {title}
                            </td>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {"₹" + price}
                            </td>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {category}
                            </td>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {type}
                            </td>
                            <td
                              className="px-6 py-4 text-black "
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {date}
                            </td>
                            <td className="px-6 py-4">
                              <div className=" flex gap-2">
                                <div
                                  className=" flex gap-2 cursor-pointer text-black "
                                  style={{
                                    color: mode === "dark" ? "white" : "",
                                  }}
                                >
                                  <div className="flex gap-4">
                                    <div className="text-xl hover:text-red-700">
                                      <AiFillDelete
                                        onClick={() => deleteProduct(item)}
                                      />
                                    </div>
                                    <div className="text-xl hover:text-red-700">
                                      <Link to={"/updateproduct"}>
                                        <FaEdit
                                          onClick={() => editHandle(item)}
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              </div>
            </TabPanel>
            {/* orders  */}
            <TabPanel>
              <div className="px-4 md:px-0 mb-16">
                <h1 className="text-center mb-4 text-3xl font-bold"
                  style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                  🛒 Order Details
                </h1>

                {/* Print PDF Button */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition"
                  >
                    <FaFilePdf className="text-lg" />
                    Download Orders PDF
                  </button>
                </div>

                {order.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-lg">No orders yet.</div>
                ) : (
                  <div className="flex flex-col gap-6" ref={orderRef}>
                    {order.map((allOrder, index) => (
                      <div
                        key={index}
                        className="rounded-2xl shadow-lg overflow-hidden border"
                        style={{
                          backgroundColor: mode === "dark" ? "rgb(36,40,47)" : "#fff",
                          borderColor: mode === "dark" ? "#374151" : "#F3D0D7",
                        }}
                      >
                        {/* Order Header */}
                        <div
                          className="flex flex-wrap items-center justify-between px-6 py-4 gap-3"
                          style={{
                            backgroundColor: mode === "dark" ? "#232F3E" : "#FFF5F7",
                            borderBottom: `1px solid ${mode === "dark" ? "#374151" : "#F3D0D7"}`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🧾</span>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest"
                                style={{ color: mode === "dark" ? "#aaa" : "#888" }}>
                                Payment ID
                              </p>
                              <p className="font-bold text-sm"
                                style={{ color: mode === "dark" ? "#FFD814" : "#232F3E" }}>
                                {allOrder.paymentId}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-6 text-sm">
                            <div>
                              <p className="text-xs uppercase tracking-widest"
                                style={{ color: mode === "dark" ? "#aaa" : "#888" }}>Customer</p>
                              <p className="font-semibold"
                                style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                                {allOrder.addressInfo?.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-widest"
                                style={{ color: mode === "dark" ? "#aaa" : "#888" }}>Phone</p>
                              <p className="font-semibold"
                                style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                                {allOrder.addressInfo?.phoneNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-widest"
                                style={{ color: mode === "dark" ? "#aaa" : "#888" }}>Email</p>
                              <p className="font-semibold"
                                style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                                {allOrder.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-widest"
                                style={{ color: mode === "dark" ? "#aaa" : "#888" }}>Address</p>
                              <p className="font-semibold max-w-[180px]"
                                style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                                {allOrder.addressInfo?.address}, {allOrder.addressInfo?.pincode}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-widest"
                                style={{ color: mode === "dark" ? "#aaa" : "#888" }}>Date & Time</p>
                              <p className="font-semibold"
                                style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                                {allOrder.date}
                              </p>
                              <p className="text-xs mt-0.5"
                                style={{ color: mode === "dark" ? "#aaa" : "#888" }}>
                                {allOrder.time?.toDate
                                  ? allOrder.time.toDate().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <select
                              value={allOrder.status || "pending"}
                              onChange={(e) => updateOrderStatus(allOrder.id, e.target.value)}
                              className="text-xs font-bold px-3 py-2 rounded-lg border outline-none transition"
                              style={{
                                backgroundColor:
                                  (allOrder.status || "pending") === "confirmed" ? "#dcfce7"
                                  : allOrder.status === "cancelled" ? "#fee2e2" : "#fef9c3",
                                color:
                                  (allOrder.status || "pending") === "confirmed" ? "#15803d"
                                  : allOrder.status === "cancelled" ? "#b91c1c" : "#854d0e",
                                borderColor:
                                  (allOrder.status || "pending") === "confirmed" ? "#86efac"
                                  : allOrder.status === "cancelled" ? "#fca5a5" : "#fde047",
                              }}
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="confirmed">✅ Confirmed</option>
                              <option value="cancelled">❌ Cancelled</option>
                            </select>
                            <button
                              onClick={() => deleteOrder(allOrder.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition"
                              title="Delete Order"
                            >
                              <AiFillDelete className="text-lg" />
                            </button>
                          </div>
                        </div>
                        <div className="divide-y"
                          style={{ borderColor: mode === "dark" ? "#374151" : "#F3D0D7" }}>
                          {allOrder.cartItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate"
                                  style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                                  {item.title}
                                </p>
                                <p className="text-xs mt-0.5"
                                  style={{ color: mode === "dark" ? "#aaa" : "#888" }}>
                                  {item.category}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-base"
                                  style={{ color: "#FF9900" }}>
                                  ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabPanel>
            {/* users  */}
            <TabPanel>
              <div className="px-4 md:px-0 mb-10">
                <h1 className="text-center mb-2 text-3xl font-bold"
                  style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                  👥 User Details
                </h1>
                <p className="text-center text-sm mb-8"
                  style={{ color: mode === "dark" ? "#aaa" : "#888" }}>
                  {users.length} registered users
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {users.map((user, index) => {
                    const { name, uid, email, signedupAt } = user;
                    const initial = name?.charAt(0)?.toUpperCase() || "?";
                    const colors = ["#F3D0D7","#FFD814","#86efac","#93c5fd","#fca5a5","#c4b5fd"];
                    const bg = colors[index % colors.length];
                    return (
                      <div
                        key={index}
                        className="rounded-2xl shadow-md p-5 flex items-start gap-4 border transition hover:shadow-lg hover:-translate-y-0.5 duration-200"
                        style={{
                          backgroundColor: mode === "dark" ? "rgb(36,40,47)" : "#fff",
                          borderColor: mode === "dark" ? "#374151" : "#F3D0D7",
                        }}
                      >
                        {/* Avatar */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                          style={{ backgroundColor: bg, color: "#232F3E" }}
                        >
                          {initial}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-bold text-base truncate"
                              style={{ color: mode === "dark" ? "white" : "#232F3E" }}>
                              {name}
                            </p>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: mode === "dark" ? "#374151" : "#F0EBE3", color: mode === "dark" ? "#ccc" : "#555" }}>
                              #{index + 1}
                            </span>
                          </div>

                          <p className="text-xs truncate mb-2"
                            style={{ color: mode === "dark" ? "#aaa" : "#666" }}>
                            ✉️ {email}
                          </p>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span
                              className="px-2 py-1 rounded-lg font-mono truncate max-w-[140px]"
                              style={{ backgroundColor: mode === "dark" ? "#1a1f27" : "#F9FAFB", color: mode === "dark" ? "#ccc" : "#555" }}
                              title={uid}
                            >
                              🔑 {uid?.slice(0, 12)}...
                            </span>
                            <span
                              className="px-2 py-1 rounded-lg"
                              style={{ backgroundColor: mode === "dark" ? "#1a1f27" : "#F9FAFB", color: mode === "dark" ? "#ccc" : "#555" }}
                            >
                              📅 {signedupAt?.slice(0, 10)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabPanel>

            {/* Slider Management */}
            <TabPanel>
              <ManageSlider />
            </TabPanel>

            {/* Seller Requests */}
            <TabPanel>
              <div className="px-4 md:px-0 mb-16">
                <h1
                  className="text-center mb-5 text-3xl font-semibold underline"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Seller Applications ({sellerRequests.length})
                </h1>

                {sellerRequests.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">No seller applications yet.</div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead
                        className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]"
                        style={{
                          backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                      >
                        <tr>
                          <th className="px-4 py-3">S.No</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Business</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Message</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellerRequests.map((req, idx) => (
                          <tr
                            key={req.id}
                            className="bg-gray-50 border-b dark:border-gray-700"
                            style={{
                              backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                              color: mode === "dark" ? "white" : "",
                            }}
                          >
                            <td className="px-4 py-3 font-bold">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold">{req.name}</td>
                            <td className="px-4 py-3">{req.email}</td>
                            <td className="px-4 py-3">{req.phone}</td>
                            <td className="px-4 py-3">{req.businessName}</td>
                            <td className="px-4 py-3">
                              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-semibold">
                                {req.productCategory}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-[200px] truncate" title={req.message}>
                              {req.message || "—"}
                            </td>
                            <td className="px-4 py-3">{req.date}</td>
                            <td className="px-4 py-3">
                              <AiFillDelete
                                onClick={() => deleteSellerRequest(req.id)}
                                className="text-xl text-red-500 hover:text-red-700 cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabPanel>

          </Tabs>
        </div>
      </div>
    </>
  );
}

export default DashboardTab;
