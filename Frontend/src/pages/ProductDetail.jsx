import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import StarFullIcon from './../assets/star-full.svg';
import StarHalfIcon from './../assets/star-half.svg';
import StarEmptyIcon from './../assets/star-empty.svg';
import {jwtDecode} from "jwt-decode";
import AddRemarkForm from "./remarkform";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="star-rating d-flex align-items-center mt-1">
      {[...Array(fullStars)].map((_, i) => <img key={i} src={StarFullIcon} alt="full-star" width={18} height={18} />)}
      {halfStars === 1 && <img src={StarHalfIcon} alt="half-star" width={18} height={18} />}
      {[...Array(emptyStars)].map((_, i) => <img key={i} src={StarEmptyIcon} alt="empty-star" width={18} height={18} />)}
      <span className="ms-2 text-muted fs-6">({rating.toFixed(1)})</span>
    </div>
  );
};

// Function to get full image URL
const getFullImageUrl = (image) => image?.startsWith("http") ? image : `http://localhost:3000/${image || "images/default-product.jpg"}`;

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const remarksEndRef = useRef(null);

  useEffect(() => {
    if (!productId) return;

    fetch(`http://localhost:3000/product/${productId}`)
      .then(res => res.json())
      .then(data => setProductData(data));

    fetch(`http://localhost:3000/remark/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        const totalRating = data.reduce((sum, remark) => sum + remark.Rating, 0);
        setAverageRating(data.length ? totalRating / data.length : 0);
        setRemarks(data);
      });
  }, [productId]);

  // Function to check if the user is logged in
  const isLoggedIn = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  // Function to handle Add to Cart with SweetAlert


  // Import jwt-decode

  const addToCart = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      if (!token) {
        Swal.fire({
          title: "Login Required",
          text: "Please log in before adding items to your cart.",
          icon: "warning",
          confirmButtonText: "Go to Login"
        }).then((result) => {
          if (result.isConfirmed) navigate("/login");
        });
        return;
      }
      console.log(token);
      
  
      const decodedPayload = jwtDecode(token);
  
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ProductID: productData?._id,
          ProductQuantity: quantity,
          UserID: decodedPayload?.userId // Extracted from token
        })
      });
  
      const data = await response.json();
      if (!response.ok) {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to add product to cart.",
          icon: "error",
          confirmButtonText: "Try Again"
        });
        return;
      }
  
      Swal.fire({
        title: "Added to Cart!",
        text: `${productData?.ProductName} (x${quantity}) has been added successfully.`,
        icon: "success",
        confirmButtonText: "OK"
      });
  };
  

  // Check if there's a pending cart item after login
  useEffect(() => {
    const pendingItem = sessionStorage.getItem("pendingCartItem");
    if (pendingItem && isLoggedIn()) {
      const { productId, quantity, returnUrl } = JSON.parse(pendingItem);
      setQuantity(quantity);
      addToCart();
      sessionStorage.removeItem("pendingCartItem");
      if (returnUrl) navigate(returnUrl);
    }
  }, []);

  if (!productData) {
    return <div className="container mt-5 text-center"><h4>Loading Product...</h4></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 d-flex justify-content-center">
          <img
            src={getFullImageUrl(productData.ProductImage)}
            alt={productData.ProductName}
            className="img-fluid rounded-3 shadow-sm"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="fw-bold">{productData.ProductName}</h2>
          <StarRating rating={averageRating} />
          <p className="text-muted mt-2">{productData.ProductDescription}</p>

          <div className="d-flex align-items-center gap-3 mt-2">
            <del className="text-muted fs-5">₹{productData.ProductPrice}</del>
            <span className="fs-4 fw-bold text-danger">
              ₹{(productData.ProductPrice - (productData.ProductPrice * (productData.ProductDiscount / 100))).toFixed(2)}
            </span>
            <span className="badge bg-success fs-6">{productData.ProductDiscount}% OFF</span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="d-flex align-items-center gap-3 mt-4">
            <input
              type="number"
              name="quantity"
              className="form-control w-25 text-center border-1 shadow-sm"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            />
            <button className="btn btn-primary rounded-3 px-4 shadow-sm fw-semibold" onClick={addToCart}>
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="mt-5">
        <h4>Customer Remarks</h4>
        <div className="mt-3">
          {remarks.length ? remarks.map((remark, index) => (
            <div key={index} className="remark-card p-3 mb-3 shadow-sm border rounded">
              <p>{remark.RemarkDescription}</p>
              <small className="text-muted">{new Date(remark.UpdatedAt).toLocaleString()}</small>
            </div>
          )) : <p>No remarks yet. Be the first to leave a review!</p>}
          <div ref={remarksEndRef}></div>
        </div>
      </div>

      <AddRemarkForm />
    </div>

  
  );
}
