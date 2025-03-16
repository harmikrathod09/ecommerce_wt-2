import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            Swal.fire("Error", "Please log in to access your profile.", "error");
            return;
        }

        fetch(`http://localhost:3000/user/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load profile data.");
            return res.json();
        })
        .then(data => setUserData(data))
        .catch(err => Swal.fire("Error", err.message || "Failed to load profile data.", "error"));
    }, []);

    if (!userData) {
        return <div className="container text-center mt-5">Loading profile...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <div className="d-flex align-items-center gap-3">
                    <img 
                        src={`http://localhost:3000/${userData.UserProfileImage}`} 
                        alt="User Profile" 
                        className="rounded-circle border border-3 border-primary" 
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div>
                        <h2 className="fw-bold">{userData.UserName}</h2>
                        <p className="text-muted">{userData.UserEmail}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <h5 className="fw-bold">Contact Details</h5>
                    <p>📞 {userData.UserContact}</p>
                    <p>🏠 {userData.UserAddress}</p>
                    <p>📍 {userData.UserCity}, {userData.UserState}, {userData.UserCountry} - {userData.UserPincode}</p>
                </div>
            </div>
        </div>
    );
}
