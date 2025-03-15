import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StarFullIcon from './../assets/star-full.svg';
import StarHalfIcon from './../assets/star-half.svg';
import StarEmptyIcon from './../assets/star-empty.svg';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const renderStar = (type) => (
    <img src={type === 'full' ? StarFullIcon : type === 'half' ? StarHalfIcon : StarEmptyIcon} alt={type} width={16} height={16} />
  );

  return (
    <div className="star-rating d-flex align-items-center justify-content-center mt-1">
      {[...Array(fullStars)].map((_, i) => <span key={i}>{renderStar('full')}</span>)}
      {halfStars === 1 && <span>{renderStar('half')}</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={i}>{renderStar('empty')}</span>)}
      <span className="ms-1 text-muted fs-7"> ({rating.toFixed(1)})</span>
    </div>
  );
};

// Function to get the full image URL
const getFullImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/200"; // Default placeholder image
  return image.startsWith("http") ? image : `http://localhost:3000/${image}`;
};

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const [productData, setProductData] = useState([]);
  const [remarksData, setRemarksData] = useState({});

  // Fetch Products by Category
  useEffect(() => {
    fetch(`http://localhost:3000/product/category/${categoryId}`)
      .then(res => res.json())
      .then(data => {
          console.log("Fetched Products:", data); // Debug API Response
          setProductData(data);
          fetchRemarksForProducts(data);
      });
  }, [categoryId]);

  // Fetch Remarks for All Products at Once
  const fetchRemarksForProducts = (products) => {
    Promise.all(products.map(product =>
      fetch(`http://localhost:3000/remark/product/${product._id}`).then(res => res.json())
    )).then(remarksResults => {
      setRemarksData(products.reduce((acc, product, index) => {
        const totalRating = remarksResults[index].reduce((sum, remark) => sum + remark.Rating, 0);
        return { ...acc, [product._id]: remarksResults[index].length ? totalRating / remarksResults[index].length : 0 };
      }, {}));
    });
  };

  return (
    <div className="container mt-4">
      <div className="row d-flex justify-content-center">
        {productData.map((productObj) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={productObj._id}>
            <div className="product-card p-3 shadow-sm border rounded-3 bg-white position-relative">
              <Link to={`/product/${productObj._id}`} className="text-decoration-none">
                <div className="product-img-wrapper position-relative overflow-hidden">
                  <img
                    src={getFullImageUrl(productObj.ProductImage)}
                    className="product-img w-100 rounded-2"
                    alt={productObj.ProductName}
                  />
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2 fs-7">{productObj.ProductDiscount}% OFF</span>
                </div>
                <h3 className="fs-6 fw-semibold text-dark mt-2 text-center">{productObj.ProductName}</h3>
              </Link>
              <StarRating rating={remarksData[productObj._id] || 0} />
              <div className="text-center mt-1 text-muted fs-7">({productObj.ProductPurchaseCount} Sold)</div>
              
              <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                <del className="text-muted fs-7">₹{productObj.ProductPrice.toFixed(2)}</del>
                <span className="text-success fw-bold">₹{(productObj.ProductPrice - (productObj.ProductPrice * (productObj.ProductDiscount / 100))).toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <input type="number" name="quantity" className="form-control w-25 text-center fs-7" defaultValue="1" />
                <button className="btn btn-primary btn-sm rounded-2 px-3">🛒 Add to Cart</button>
                <button className="btn btn-outline-dark btn-sm rounded-circle p-2"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
