import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch Cart Items
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log(token);

    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to view your cart.",
        icon: "warning",
        confirmButtonText: "Go to Login"
      }).then(() => navigate("/login"));
      return;
    }

    fetch("http://localhost:3000/cart", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data); // ✅ Inspect API response
        setCartItems(Array.isArray(data) ? data : []); // ✅ Ensures data is an array
      })
      .catch(() => Swal.fire("Error", "Failed to load cart items.", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  // ✅ Update Quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    fetch(`http://localhost:3000/cart/item/${cartItemId}`, {
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
      })
      .catch(() => Swal.fire("Error", "Failed to update quantity.", "error"));
  };

  // ✅ Remove Item
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
        fetch(`http://localhost:3000/cart/item/${cartItemId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then(err => { throw new Error(err.error || "Failed to remove item."); });
            }
            setCartItems(cartItems.filter(item => item._id !== cartItemId));
            Swal.fire("Removed!", "Item has been removed from cart.", "success");
          })
          .catch(() => Swal.fire("Error", "Failed to remove item.", "error"));
      }
    });
  };


  // ✅ Calculate Total Price
  const totalPrice = cartItems.reduce((sum, item) =>
    sum + item.ProductQuantity * (item.ProductID?.ProductPrice || 0), 0
  );

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading Cart...</h4>
      </div>
    );
  }

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

                  <td className="cursor-pointer"
                    style={{ cursor: "pointer" }}   onClick={() => navigate(`/product/${item.ProductID?._id}`)}
>
                    {item.ProductID?.ProductName}
                  </td>
                  <td>₹{(item.ProductID?.ProductPrice || 0).toFixed(2)}</td>
                  <td>
                    {item.ProductQuantity}
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