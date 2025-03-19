import WishlistIcon from './../assets/wishlist.svg';
import CartIcon from './../assets/cart.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    async function getUserData(token) {
        try {
            const response = await fetch('http://localhost:3000/user/getOneAuth', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    useEffect(() => {
        if (token) {
            getUserData(token);
        }
    }, [token]);

    const handleLogout = () => {
        if (localStorage.getItem("token")) localStorage.removeItem("token");
        else if (sessionStorage.getItem("token")) sessionStorage.removeItem("token");
        setUserData(null);
        navigate("/");
    };

    return (
        <header>
            <div className="container-fluid">
                <div className="row py-3 border-bottom">

                    {/* Logo Section */}
                    <div className="col-sm-4 col-lg-2 text-center text-sm-start d-flex gap-3 justify-content-center justify-content-md-start">
                        <div className="d-flex align-items-center my-3 my-sm-0">
                            <Link to='/'>
                                <img src="/images/logo.svg" alt="logo" className="img-fluid" />
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-4">
                        <div className="search-bar row bg-light p-2 rounded-4 justify-content-between"> 
                            <div className="col-11">
                                <form id="search-form" className="text-center" action="/" method="get">
                                    <input type="text" className="form-control border-0 bg-transparent w-100" placeholder="Search for more than 20,000 products" />
                                </form>
                            </div>
                            <div className="col-1"> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="col-lg-4">
                        <ul className="navbar-nav list-unstyled d-flex flex-row gap-3 gap-lg-5 justify-content-center flex-wrap align-items-center mb-0 fw-bold text-uppercase text-dark">
                            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/order">Order</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
                        </ul>
                    </div>

                    {/* User Actions */}
                    <div className="col-sm-8 col-lg-2 d-flex gap-4 align-items-center justify-content-center justify-content-sm-end">
                        <ul className="d-flex justify-content-end list-unstyled m-0 align-items-center">

                            {/* User Profile or Login/Signup */}
                            {token ? (
                                <li>
                                    <Link to="/profile" className="p-2 mx-1">
                                        <img 
                                            src={userData?.UserProfileImage ? `http://localhost:3000/Images/UserImage/${userData.UserProfileImage}` : "/images/default-user.png"} 
                                            alt="User" 
                                            width={32} height={32} 
                                            className="rounded-circle border p-1"
                                        />
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li><Link to='/login' className="text-dark fw-bold">Log in</Link></li>
                                    <li><Link to='/register' className="text-dark fw-bold">Sign up</Link></li>
                                </>
                            )}

                            {/* Wishlist & Cart Icons */}
                            <li>
                                <Link to="/wishlist" className="p-2 mx-1">
                                    <img src={WishlistIcon} alt="Wishlist" width={32} height={32} />
                                </Link>
                            </li>
                            <li>
                            <Link to="/cart" className="p-2 mx-1">
                                <button className="p-2 mx-1 border-0 bg-transparent" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                                    <img src={CartIcon} alt="Cart" width={32} height={32} />
                                </button>
                                </Link>
                            </li>

                            {/* Logout Button */}
                            {token && (
                                <li>
                                    <button className="btn btn-outline-danger btn-sm fw-bold px-3" onClick={handleLogout}>Log out</button>
                                </li>
                            )}

                        </ul>
                    </div>

                </div>
            </div>
        </header>
    );
}
