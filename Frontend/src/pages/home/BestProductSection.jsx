import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartIcon from './../../assets/cart.svg';
import WishlistIcon from './../../assets/wishlist.svg';

export default function BestProductSection() {
    const [products, setProducts] = useState([]);
    const [cartMessage, setCartMessage] = useState("");
    const navigate = useNavigate();

    // Fetch products from API
    useEffect(() => {
        fetch("http://localhost:3000/product")
            .then((response) => response.json())
            .then((data) => setProducts(data));
    }, []);

    // Function to navigate to product detail page
    const goToProductDetail = (id) => {
        navigate(`/product/${id}`);
    };

    // Function to check if user is logged in
    const isLoggedIn = () => localStorage.getItem("token") || sessionStorage.getItem("token");

    // Function to add product to cart
    const addToCart = (productId, quantity = 1) => {
        const token = isLoggedIn();

        if (!token) {
            sessionStorage.setItem("pendingCartItem", JSON.stringify({ productId, quantity }));
            navigate("/login");
            return;
        }

        fetch("http://localhost:3000/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ProductID: productId, ProductQuantity: quantity })
        }).then(response => {
            if (response.ok) {
                setCartMessage("Product added to cart!");
                setTimeout(() => setCartMessage(""), 2000);
            }
        });
    };

    // Check if there's a pending cart item after login
    useEffect(() => {
        const pendingItem = sessionStorage.getItem("pendingCartItem");
        if (pendingItem && isLoggedIn()) {
            const { productId, quantity } = JSON.parse(pendingItem);
            addToCart(productId, quantity);
            sessionStorage.removeItem("pendingCartItem");
        }
    }, []);

    return (
        <section className="pb-5">
            <div className="container-lg">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-header d-flex flex-wrap justify-content-between my-4">
                            <h2 className="section-title">Best Selling Products</h2>
                            <div className="d-flex align-items-center">
                                <a href="#" className="btn btn-primary rounded-1">View All</a>
                            </div>
                        </div>
                    </div>
                </div>

                {cartMessage && (
                    <div className="alert alert-success text-center">{cartMessage}</div>
                )}

                <div className="row">
                    <div className="col-md-12">
                        <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
                            {products.map((product) => (
                                <div className="col" key={product._id}>
                                    <div className="product-item">
                                        <div onClick={() => goToProductDetail(product._id)} style={{ cursor: "pointer" }}>
                                            <figure>
                                                <img src={product.ProductImage} alt={product.ProductName} className="tab-image" />
                                            </figure>
                                            <div className="d-flex flex-column text-center">
                                                <h3 className="fs-6 fw-normal">{product.ProductName}</h3>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column text-center">
                                            <div>
                                                <span className="rating">
                                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                                </span>
                                                <span>({product.ProductPurchaseCount})</span>
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <del>₹{product.ProductPrice.toFixed(2)}</del>
                                                <span className="text-dark fw-semibold">
                                                    ₹{(product.ProductPrice - (product.ProductPrice * product.ProductDiscount / 100)).toFixed(2)}
                                                </span>
                                                <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">
                                                    {product.ProductDiscount}% OFF
                                                </span>
                                            </div>

                                            <div className="button-area p-3 pt-0">
                                                <div className="row g-1 mt-2">
                                                    <div className="col-3">
                                                        <input 
                                                            type="number" 
                                                            name="quantity" 
                                                            className="form-control border-dark-subtle input-number quantity" 
                                                            defaultValue="1" 
                                                            min="1" 
                                                        />
                                                    </div>
                                                    <div className="col-7">
                                                        <button 
                                                            className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"
                                                            onClick={() => addToCart(product._id, 1)}
                                                        >
                                                            <img src={CartIcon} alt="cart" width={24} height={24} /> Add to Cart
                                                        </button>
                                                    </div>
                                                    <div className="col-2">
                                                        <button className="btn btn-outline-dark rounded-1 p-2 fs-6">
                                                            <img src={WishlistIcon} alt="wishlist" width={24} height={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
