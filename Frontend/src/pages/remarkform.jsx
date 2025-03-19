import { useState } from "react";

export default function AddRemarkForm({ productId }) { // Added `productId` as prop
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(5);

    const handleRemarkSubmit = () => {
        if (!description.trim()) {
            alert("Please enter a valid remark description.");
            return;
        }

        const newRemarkData = {
            RemarkDescription: description.trim(),
            Rating: rating,
            ProductID: productId, // Added productId correctly
            UserId: localStorage.getItem("userId") || sessionStorage.getItem("userId")
        };

        fetch(`http://localhost:3000/remark/product/addRemarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRemarkData),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert("Remark submitted successfully!");
            }
        })
        .catch((error) => console.error("Error submitting remark:", error));
    };

    return (
        <div className="add-remark mt-4">
            <textarea
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your remark here..."
            ></textarea>

            <div className="mt-2">
                <label>Rating:</label>
                <select
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                >
                    <option value={1}>1 - Poor</option>
                    <option value={2}>2 - Fair</option>
                    <option value={3}>3 - Good</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={5}>5 - Excellent</option>
                </select>
            </div>

            <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleRemarkSubmit}
            >
                Submit Remark
            </button>
        </div>
    );
}
