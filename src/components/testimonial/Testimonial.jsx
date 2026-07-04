


import React, { useState } from "react";
import { useData } from "../../context/data/MyState";

function Testimonial() {
  const context = useData();
  const { mode } = context;

  const [comments] = useState([
    {
      name: "Priya Sharma",
      role: "Verified Buyer",
      content:
        "The bridal hair pins are absolutely stunning! I wore them on my wedding day and received so many compliments. The quality is excellent and they stayed in place all day. Highly recommend ARPA Collection!",
    },
    {
      name: "Ananya Patel",
      role: "Fashion Enthusiast",
      content:
        "I'm obsessed with the scrunchies! They're so soft and don't damage my hair at all. The colors are vibrant and match perfectly with my outfits. Already ordered more for my friends!",
    },
    {
      name: "Meera Reddy",
      role: "Regular Customer",
      content:
        "Amazing shopping experience! The textiles are of premium quality and the delivery was super fast. Customer service was very helpful when I had questions. Will definitely shop again!",
    },
    {
      name: "Kavya Singh",
      role: "Bride-to-be",
      content:
        "Found the perfect accessories for my wedding! The bridal collection is gorgeous and reasonably priced. The packaging was beautiful too. Thank you ARPA Collection for making my special day even more special!",
    },
    {
      name: "Riya Gupta",
      role: "College Student",
      content:
        "Love the variety of scrunchies and hair accessories! They're affordable, trendy, and great quality. Perfect for everyday wear. My go-to store for all hair accessories now!",
    },
    {
      name: "Sneha Iyer",
      role: "Working Professional",
      content:
        "The textiles and fashion items are exactly as shown in the pictures. Great quality at reasonable prices. Fast shipping and excellent customer support. Highly satisfied with my purchase!",
    },
  ]);

  return (
    <section
      className="body-font mb-10"
      style={{ backgroundColor: mode === "dark" ? "#232F3E" : "#F0EBE3" }}
    >
      <div className="container px-5 py-10 mx-auto">
        <h1
          className="text-center text-3xl font-bold"
          style={{ color: mode === "dark" ? "#fff" : "#232F3E" }}
        >
          Customer Reviews
        </h1>
        <h2
          className="text-center text-xl font-medium mb-10"
          style={{ color: mode === "dark" ? "#ddd" : "#555" }}
        >
          What our{" "}
          <span style={{ color: "#555" }}>verified buyers</span> are saying
        </h2>

        <div className="flex flex-wrap -m-4 justify-center">
          {comments.map((review, idx) => (
            <div key={idx} className="lg:w-1/3 md:w-1/2 w-full p-4">
              <div
                className="h-full p-6 rounded-lg border shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  borderColor: mode === "dark" ? "#555" : "#F3D0D7",
                  backgroundColor: mode === "dark" ? "#374151" : "#FFEFEF",
                  color: mode === "dark" ? "#fff" : "#111",
                }}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{
                      backgroundColor: "#F3D0D7",
                      color: "#232F3E",
                    }}
                  >
                    {review.name.charAt(0)}
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: "#FFD700" }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <svg
                  className="w-6 h-6 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "#F3D0D7" }}
                >
                  <path d="M7.17 6A5.001 5.001 0 002 11v2a1 1 0 001 1h3v4a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1H5v-1a3 3 0 015.83-1H7.17zm10 0A5.001 5.001 0 0012 11v2a1 1 0 001 1h3v4a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-3v-1a3 3 0 015.83-1h-3.83z" />
                </svg>
                <p
                  className="leading-relaxed text-sm text-center mb-4"
                  style={{ color: mode === "dark" ? "#ddd" : "#555" }}
                >
                  "{review.content}"
                </p>
                <div className="mt-6 text-center border-t pt-4"
                  style={{ borderColor: mode === "dark" ? "#555" : "#F3D0D7" }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: "#F3D0D7" }}
                  >
                    {review.name}
                  </h3>
                  <p
                    className="text-xs mt-1"
                    style={{ color: mode === "dark" ? "#bbb" : "#777" }}
                  >
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
