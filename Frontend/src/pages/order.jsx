import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Login Required",
                text: "Please log in to view your orders.",
                icon: "warning",
                confirmButtonText: "Go to Login"
            }).then((result) => {
                if (result.isConfirmed) navigate("/login");
            });
            return;
        }

        const decodedPayload = jwtDecode(token);
        console.log("Decoded Token Payload:", decodedPayload);

        fetch(`http://localhost:3000/order/user/${decodedPayload?.userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log("Fetched Orders:", data);
            setOrders(Array.isArray(data) ? data : []);
        })
        .catch(() => Swal.fire("Error", "Failed to fetch orders.", "error"));
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-center mb-4">Your Orders</h2>

            {orders.length === 0 ? (
                <p className="text-center">No orders found.</p>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order._id} className="col-md-6 mb-4">
                            <div className="card shadow-sm border-0 rounded-4 p-3">
                                <h5 className="fw-bold">Order ID: {order._id}</h5>
                                <p><strong>Order Date:</strong> {new Date(order.OrderDate).toLocaleDateString()}</p>
                                <p><strong>Total Amount:</strong> ₹{order.TotalAmount?.toFixed(2)}</p>
                                <div>
                                    <h6>Products:</h6>
                                    <ul className="list-group">
                                        {order.ProductItems?.map((item, index) => (
                                            <li key={index} className="list-group-item">
                                                Product ID: {item.ProductID} - Quantity: {item.ProductQuantity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}