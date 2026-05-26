import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Login Required",
                text: "Please log in to view your orders.",
                icon: "warning",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#3085d6"
            }).then((result) => {
                if (result.isConfirmed) navigate("/login");
            });
            setLoading(false);
            return;
        }

        try {
            const decodedPayload = jwtDecode(token);
            console.log("Decoded Token Payload:", decodedPayload);

            fetch(`http://localhost:3000/order/user/${decodedPayload?.userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch");
                }
                return res.json();
            })
            .then(data => {
                console.log("Fetched Orders:", data);
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch orders error:", err);
                setOrders([]);
                setLoading(false);
            });
        } catch (error) {
            console.error("JWT Decode error:", error);
            Swal.fire("Error", "Invalid token session. Please log in again.", "error");
            setLoading(false);
        }
    }, [navigate]);

    return (
        <div className="container py-5" style={{ minHeight: "80vh" }}>
            <div className="text-center mb-5">
                <h1 className="fw-extrabold mb-2" style={{ 
                    background: "linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "2.5rem"
                }}>
                    Your Order History
                </h1>
                <p className="text-muted">Track and view details of all your past purchases</p>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-5 shadow-sm rounded-4 border bg-white mx-auto p-5" style={{ maxWidth: "600px" }}>
                    <div className="mb-4 text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-bag-x" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6.146 8.146a.5.5 0 0 1 .708 0L8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 0 1 0-.708z"/>
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                    </div>
                    <h4 className="fw-bold">No Orders Placed Yet</h4>
                    <p className="text-muted mb-4">Browse our collection and find products you love!</p>
                    <button className="btn btn-primary btn-lg rounded-pill px-5" onClick={() => navigate("/")}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="row g-4 justify-content-center">
                    {orders.map((order) => (
                        <div key={order._id} className="col-lg-8 col-md-10">
                            <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white mb-3">
                                <div className="card-header bg-light border-0 py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                                    <div>
                                        <span className="text-muted small text-uppercase fw-semibold d-block">Order Placed</span>
                                        <span className="fw-bold text-dark">
                                            {order.OrderDate ? new Date(order.OrderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date"}
                                        </span>
                                    </div>
                                    <div className="text-sm-end">
                                        <span className="text-muted small text-uppercase fw-semibold d-block">Order ID</span>
                                        <code className="text-primary fw-semibold">{order._id}</code>
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-3 text-secondary">Items Ordered</h5>
                                        <ul className="list-group list-group-flush">
                                            {order.ProductItems?.map((item, index) => {
                                                const product = item.ProductID;
                                                const isPopulated = product && typeof product === "object";
                                                return (
                                                    <li key={index} className="list-group-item d-flex align-items-center justify-content-between py-3 px-0 border-0 border-bottom bg-transparent">
                                                        {isPopulated ? (
                                                            <div className="d-flex align-items-center gap-3 w-100">
                                                                {product.ProductImage ? (
                                                                    <img 
                                                                        src={`http://localhost:3000/Images/ProductImage/${product.ProductImage}`} 
                                                                        alt={product.ProductName} 
                                                                        width={60} 
                                                                        height={60} 
                                                                        className="rounded-3 object-fit-cover border shadow-sm" 
                                                                    />
                                                                ) : (
                                                                    <div className="rounded-3 bg-light border d-flex align-items-center justify-content-center shadow-sm" style={{ width: 60, height: 60 }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                                                                            <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z"/>
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                                <div className="flex-grow-1">
                                                                    <h6 className="mb-1 fw-bold text-dark">{product.ProductName}</h6>
                                                                    <p className="mb-0 text-muted small">Price: ₹{product.ProductPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                                                </div>
                                                                <div className="text-end">
                                                                    <span className="badge bg-secondary rounded-pill px-3 py-2">Qty: {item.ProductQuantity}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                                <span className="text-muted small">Product ID: {product || "Unknown"}</span>
                                                                <span className="badge bg-secondary rounded-pill">Qty: {item.ProductQuantity}</span>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                                        <h5 className="fw-bold mb-0 text-dark">Total Paid:</h5>
                                        <h4 className="fw-bold mb-0 text-success">
                                            ₹{order.TotalAmount ? order.TotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "0.00"}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}