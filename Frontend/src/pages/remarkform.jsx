import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddRemarkForm() {
    const { productId } = useParams();
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description.trim()) {
            Swal.fire("Error", "Please enter a valid remark.", "error");
            return;
        }

        const userId = "651a9e7b4a6b4c001cd134c2"; // Mock user ID or fetch dynamically
        setIsSubmitting(true);

        const response = await fetch("http://localhost:3000/remark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ProductID: productId,
                RemarkDescription: description,
                Rating: rating,
                UserId: userId
            })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire("Success", "Your remark has been added successfully.", "success");
            setDescription("");
            setRating(5);
        } else {
            Swal.fire("Error", data.message || "Failed to submit remark.", "error");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="container mt-4">
            <h4 className="fw-bold mb-3">Add Your Remark</h4>
            <form onSubmit={handleSubmit} className="border p-3 rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Your Remark</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        placeholder="Write your thoughts about this product..."
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Rating</label>
                    <select
                        className="form-select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                        <option value={3}>⭐⭐⭐ (3 Stars)</option>
                        <option value={2}>⭐⭐ (2 Stars)</option>
                        <option value={1}>⭐ (1 Star)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Remark"}
                </button>
            </form>
        </div>
    );
}
