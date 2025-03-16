import { useEffect, useState } from "react";

export default function ProductList({ categoryId }) {
    const [productData, setProductData] = useState({});
    const [quantities, setQuantities] = useState({});

    const fetchProductsByCategory = (categoryId) => {
        fetch(`http://localhost:3000/product/category/${categoryId}`)
            .then((res) => res.json())
            .then((res) => setProductData((prev) => ({ ...prev, [categoryId]: res })))
            .catch((error) => console.error("Error fetching products:", error));
    };

    useEffect(() => {
        if (!productData[categoryId]) {
            fetchProductsByCategory(categoryId);
        }
    }, [categoryId]);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, parseInt(value) || 1)
        }));
    };

    const handleAddToCart = (productId, quantity) => {
        fetch(`http://localhost:3000/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ProductID: productId,
                quantity: quantity || 1
            })
        })
        .then(res => res.json())
        .then(() => alert("Product added to cart!"))
        .catch(() => alert("Failed to add product."));
    };

    const products = productData[categoryId] || [];

    return (
        <>
            {products.map((productObj) => (
                <div className="product-item swiper-slide" key={productObj._id} style={{ width: "25%", margin: "10px" }}>
                    <figure>
                        <img
                            src={`http://localhost:3000/images/${productObj.ProductImage}`}
                            style={{ width: "200px", height: "300px", borderRadius: "8px", objectFit: "cover" }}
                            alt="Product Thumbnail"
                            className="tab-image"
                        />
                    </figure>
                    <div className="d-flex flex-column text-center ">
                        <h3 className="fs-6 fw-normal">{productObj.ProductName}</h3>
                        <div className="rating">
                            {[...Array(Math.floor(productObj.Rating))].map((_, i) => (
                                <svg key={i} width="18" height="18" className="text-warning">
                                    <use xlinkHref="#star-full"></use>
                                </svg>
                            ))}
                            {productObj.Rating % 1 !== 0 && (
                                <svg width="18" height="18" className="text-warning">
                                    <use xlinkHref="#star-half"></use>
                                </svg>
                            )}
                            <span>({productObj.ProductPurchaseCount})</span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <del>₹{productObj.ProductPrice}</del>
                            <span className="text-dark fw-semibold">
                                ₹{productObj.ProductPrice - (productObj.ProductPrice * (productObj.ProductDiscount / 100))}
                            </span>
                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">
                                {productObj.ProductDiscount}% OFF
                            </span>
                        </div>
                        <div className="button-area p-3 pt-0">
                            <div className="row g-1 mt-2">
                                <div className="col-3">
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="form-control border-dark-subtle input-number quantity"
                                        value={quantities[productObj._id] || 1}
                                        onChange={(e) => handleQuantityChange(productObj._id, e.target.value)}
                                    />
                                </div>
                                <div className="col-7">
                                    <button
                                        className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"
                                        onClick={() => handleAddToCart(productObj._id, quantities[productObj._id] || 1)}
                                    >
                                        <svg width="18" height="18"><use xlinkHref="#cart"></use></svg>
                                        Add to Cart
                                    </button>
                                </div>
                                <div className="col-2">
                                    <a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6">
                                        <svg width="18" height="18"><use xlinkHref="#heart"></use></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}