import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Layout from './Layout'
import Home from "./pages/Home";
import CategoryProducts from "./pages/CategoryProducts";
import CategoryList from "./pages/CategoryList";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ProductDetail from "./pages/ProductDetail";
import AboutUs from "./pages/aboutus/aboutus";
import CartPage from "./pages/cart";
import ProfilePage from "./pages/profilepage";
import OrderPage from "./pages/order";


function App() {

    useEffect(() => {
        const initSwiper = () => {
          // Main swiper initialization
          const mainSwiper = new Swiper(".main-swiper", {
            speed: 500,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
          });
    
          // Category carousel swiper
          const categorySwiper = new Swiper(".category-carousel", {
            slidesPerView: 8,
            spaceBetween: 30,
            speed: 500,
            navigation: {
              nextEl: ".category-carousel-next",
              prevEl: ".category-carousel-prev",
            },
            breakpoints: {
              0: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              991: { slidesPerView: 5 },
              1500: { slidesPerView: 8 },
            },
          });
    
          $(".products-carousel").each(function () {
            const $elId = $(this).attr("id");
            const productSwiper = new Swiper(`#${$elId} .swiper`, {
              slidesPerView: 5,
              spaceBetween: 30,
              speed: 500,
              navigation: {
                nextEl: `#${$elId} .products-carousel-next`,
                prevEl: `#${$elId} .products-carousel-prev`,
              },
              breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
                991: { slidesPerView: 4 },
                1500: { slidesPerView: 5 },
              },
            });
          });
    
          const thumbSlider = new Swiper(".product-thumbnail-slider", {
            slidesPerView: 5,
            spaceBetween: 20,
            direction: "vertical",
            breakpoints: {
              0: { direction: "horizontal" },
              992: { direction: "vertical" },
            },
          });
    
          const largeSlider = new Swiper(".product-large-slider", {
            slidesPerView: 1,
            spaceBetween: 0,
            effect: "fade",
            thumbs: { swiper: thumbSlider },
            pagination: { el: ".swiper-pagination", clickable: true },
          });
        };
    
        initSwiper();
    
        return () => {
          Swiper.instances.forEach((swiper) => swiper.destroy());
        };
      }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={ <Home /> } ></Route>
                        <Route path="/category" element={ <CategoryList /> } ></Route>
                        <Route path="/categoryproducts/:categoryId" element={<CategoryProducts />} />
                        <Route path="/login" element={ <Login /> } ></Route>
                        <Route path='/register' element={ <Registration /> } ></Route>
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/order" element={<OrderPage />} />


                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;