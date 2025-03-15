import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Fetch Cart Items
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Login Required", "Please log in to view your cart.", "warning");
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/cart", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Cart Data:", data);
        setCartItems(data);
      })
      .catch(error => console.error("Error fetching cart:", error));
  }, [navigate]);

  // Update Quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    fetch(`http://localhost:3000/cart/${cartItemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ ProductQuantity: newQuantity })
    })
      .then(res => res.json())
      .then(() => {
        setCartItems(cartItems.map(item =>
          item._id === cartItemId ? { ...item, ProductQuantity: newQuantity } : item
        ));
      });
  };

  // Remove Item
  const removeItem = (cartItemId) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/cart/${cartItemId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(() => {
            setCartItems(cartItems.filter(item => item._id !== cartItemId));
            Swal.fire("Removed!", "Item has been removed from cart.", "success");
          });
      }
    });
  };

  // Calculate Total Price
  const totalPrice = cartItems.reduce((sum, item) =>
    sum + item.ProductQuantity * (item.ProductID?.ProductPrice || 0), 0
  );

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h5>Your cart is empty.</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Go to Shop</button>
        </div>
      ) : (
        <>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td className="d-flex align-items-center">
                    <img src={`http://localhost:3000/${item.ProductID?.ProductImage || "default.jpg"}`} 
                         alt={item.ProductID?.ProductName || "Unknown"} 
                         width={70} height={70} className="me-3 rounded" />
                    {item.ProductID?.ProductName || "Unknown"}
                  </td>
                  <td>₹{(item.ProductID?.ProductPrice || 0).toFixed(2)}</td>
                  <td>
                    <input 
                      type="number" 
                      value={item.ProductQuantity} 
                      min="1"
                      className="form-control w-50 mx-auto"
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>₹{(item.ProductQuantity * (item.ProductID?.ProductPrice || 0)).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)}>❌ Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total Price: ₹{totalPrice.toFixed(2)}</h4>
            <button className="btn btn-success">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
