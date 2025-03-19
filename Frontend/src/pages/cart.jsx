import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import jwtDecode from 'jwt-decode'; 
import Swal from "sweetalert2";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch Cart Items
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

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
      .then(data => setCartItems(Array.isArray(data) ? data : []))
      .catch(() => Swal.fire("Error", "Failed to load cart items.", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  // ✅ Calculate Discounted Price
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount || 0) / 100);
  };

  // ✅ Calculate Total Price with Discounts
  const totalPrice = cartItems.reduce((sum, item) =>
    sum + item.ProductQuantity * calculateDiscountedPrice(item.ProductID?.ProductPrice || 0, item.ProductID?.ProductDiscount || 0),
    0
  );

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

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading Cart...</h4>
      </div>
    );
  }

  
  // const CheckoutButton = ({ cartItems, totalPrice }) => {
  //   const handleCheckout = async () => {
  //       const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  //       if (!token) {
  //           Swal.fire("Login Required", "Please log in to place your order.", "warning");
  //           return;
  //       }

  //       // Decode the token to extract the UserID
  //       const decodedToken = jwtDecode(token);
  //       const UserID = decodedToken?.id; // Adjust this key based on your token structure

  //       const orderData = {
  //           UserID, // Dynamically set UserID
  //           ProductItems: cartItems.map(item => ({
  //               ProductID: item.ProductID?._id,
  //               ProductQuantity: item.ProductQuantity
  //           })),
  //           TotalAmount: totalPrice,
  //           OrderDate: new Date().toISOString()
  //       };

  //       try {
  //           const response = await fetch('/api/orders', {
  //               method: 'POST',
  //               headers: {
  //                   "Authorization": `Bearer ${token}`,
  //                   "Content-Type": "application/json"
  //               },
  //               body: JSON.stringify(orderData)
  //           });

  //           const data = await response.json();

  //           if (response.ok) {
  //               Swal.fire("Success", data.message, "success").then(() => {
  //                   navigate('/orders');
  //               });
  //           } else {
  //               Swal.fire("Error", data.error || "Failed to place order.", "error");
  //           }
  //       } catch (error) {
  //           console.error("Error placing order:", error);
  //           Swal.fire("Error", "Failed to place order.", "error");
  //       }
  //   };
  // }

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
                <th>Discount</th>
                <th>Final Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td
                    className="cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item.ProductID?._id}`)}
                  >
                    {item.ProductID?.ProductName}
                  </td>
                  <td>
                    ₹{(item.ProductID?.ProductPrice || 0).toFixed(2)}
                  </td>
                  <td>
                    {item.ProductID?.ProductDiscount || 0}%
                  </td>
                  <td>
                    ₹{calculateDiscountedPrice(item.ProductID?.ProductPrice || 0, item.ProductID?.ProductDiscount || 0).toFixed(2)}
                  </td>
                  <td>{item.ProductQuantity}</td>
                  <td>
                    ₹{(item.ProductQuantity * calculateDiscountedPrice(item.ProductID?.ProductPrice || 0, item.ProductID?.ProductDiscount || 0)).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(item._id)}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total Price: ₹{totalPrice.toFixed(2)}</h4>
            <button className="btn btn-success" >
            Proceed to Checkout
        </button>
          </div>
        </>
      )}
    </div>
  );
  }
