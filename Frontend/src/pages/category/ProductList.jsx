import { useEffect, useState } from "react";

export default function ProductList(props){
    const [productData, setProductData] = useState({});

    const fetchProductsByCategory = (categoryId) => {
        fetch(`http://localhost:3000/product/category/${categoryId}`)
            .then((res) => res.json())
            .then((res) => {
                setProductData((prev) => ({ ...prev, [categoryId]: res }));
            })
            .catch((error) => console.error("Error fetching products:", error));
    };

    useEffect(() => {
        if (!productData[props.categoryId]) {
            fetchProductsByCategory(props.categoryId);
        }
    }, [props.categoryId, productData]);

    const products = productData[props.categoryId] || [];

    return(
        <>
            {
                products.map((productObj) => (
                    <div className="product-item swiper-slide" key={productObj._id} style={{width:"25%",margin:"10px"}} >
                        <figure>
                            <a href={'./../../Images/ProductImage/'+productObj.ProductImage} title="Product Title">
                                <img src={'./../../Images/ProductImage/'+productObj.ProductImage} style={{width: "200px", height: "300px", borderRadius: "8px", objectFit: "cover"}} alt="Product Thumbnail" className="tab-image" />
                            </a>
                        </figure>
                        <div className="d-flex flex-column text-center ">
                            <h3 className="fs-6 fw-normal">{productObj.ProductName}</h3>
                            <div>
                                <span className="rating">
                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                    <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                </span>
                                <span>({productObj.ProductPurchaseCount})</span>
                            </div>
                            <div className="d-flex justify-content-center align-items-center gap-2">
                                <del>₹{productObj.ProductPrice}</del>
                                <span className="text-dark fw-semibold">₹{productObj.ProductPrice - (productObj.ProductPrice * (productObj.ProductDiscount / 100))}</span>
                                <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">{productObj.ProductDiscount}% OFF</span>
                            </div>
                            <div className="button-area p-3 pt-0">
                                <div className="row g-1 mt-2">
                                    <div className="col-3">
                                        <input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" value="1" onChange={()=>{}} />
                                    </div>
                                    <div className="col-7">
                                        <a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg>Add to Cart</a>
                                    </div>
                                    <div className="col-2">
                                        <a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    );
}