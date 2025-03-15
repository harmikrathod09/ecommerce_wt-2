import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CategorySection() {
    const [categoryData, setCategoryData] = useState([]);
        
        useEffect(() => {
            // Fetch categories data
            fetch("http://localhost:3000/category/")
                .then((res) => res.json())
                .then((res) => setCategoryData(res))
                .catch((error) => console.error("Error fetching categories:", error));
        }, []);
    return (
        <>
            <section className="py-5 overflow-hidden">
                <div className="container-lg">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="section-header d-flex flex-wrap justify-content-between mb-5">
                                <h2 className="section-title">Category</h2>

                                <div className="d-flex align-items-center">
                                    <a href="#" className="btn btn-primary me-2">View All</a>
                                    <div className="swiper-buttons">
                                        <button className="swiper-prev category-carousel-prev btn btn-yellow">❮</button>
                                        <button className="swiper-next category-carousel-next btn btn-yellow">❯</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">

                            <div className="category-carousel swiper">
                                <div className="swiper-wrapper">
                                    {
                                        categoryData.map((d)=>(
                                            <Link to={'/categoryproducts/'+d._id} className="nav-link swiper-slide text-center" key={d._id}>    
                                                <img src={'./../../../Images/CategoryImage/'+d.CategoryImage} height={150} width={150} className="rounded-circle" alt="Category Thumbnail" />
                                                <h4 className="fs-6 mt-3 fw-normal category-title">{ d.CategoryName }</h4>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}