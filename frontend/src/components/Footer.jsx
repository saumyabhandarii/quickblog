import React from "react";
import logo from "../assets/logo.svg";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#f9fafb", padding: "40px 20px", fontFamily: "sans-serif", color: "#333" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", maxWidth: "1200px", margin: "auto" }}>
        
        {/* Logo & Description */}
        <div style={{ flex: 1, minWidth: "200px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Quickblog Logo" style={{ width: "40px", height: "40px", marginRight: "10px" }} />
            <h2 style={{ margin: 0, fontSize: "20px" }}>Quickblog</h2>
          </div>
          <p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde quaerat eveniet cumque accusamus atque qui error quo enim fugiat?
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ flex: 1, minWidth: "150px", marginBottom: "20px" }}>
          <h4>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0, color: "#666", fontSize: "14px" }}>
            <li><a href="#">Home</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Offers & Deals</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>

        {/* Help Links */}
        <div style={{ flex: 1, minWidth: "150px", marginBottom: "20px" }}>
          <h4>Need help?</h4>
          <ul style={{ listStyle: "none", padding: 0, color: "#666", fontSize: "14px" }}>
            <li><a href="#">Delivery Information</a></li>
            <li><a href="#">Return & Refund Policy</a></li>
            <li><a href="#">Payment Methods</a></li>
            <li><a href="#">Track your Order</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div style={{ flex: 1, minWidth: "150px", marginBottom: "20px" }}>
          <h4>Follow Us</h4>
          <ul style={{ listStyle: "none", padding: 0, color: "#666", fontSize: "14px" }}>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: "center", borderTop: "1px solid #e5e7eb", paddingTop: "20px", color: "#999", fontSize: "14px" }}>
        Copyright 2025 &copy; QuickBlog All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;
