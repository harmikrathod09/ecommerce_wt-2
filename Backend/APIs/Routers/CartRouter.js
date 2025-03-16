import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import CartSchema from '../../Schemas/CartSchema.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(bodyParser.json());


router.get("/", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized. Token missing." });
        }

        const decoded = jwt.verify(token, "private");
        const userID = decoded.userId;

        const cartItems = await CartSchema.find({ UserID: userID })
            .populate('ProductID')
            .exec();

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ error: "No items found in cart" });
        }

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});


// ✅ Empty Cart (by UserID)
router.delete("/:userId", async (req, res) => {
    try {
        await CartSchema.deleteOne({ UserID: req.params.userId });
        res.status(200).json({ message: "Cart emptied successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error emptying cart" });
    }
});

// ✅ Add Item to Cart
router.post("/", async (req, res) => {
    try {
        const { ProductID, ProductQuantity, UserID } = req.body;

        const newCartItem = new CartSchema({
            ProductID,
            ProductQuantity,
            UserID
        });

        await newCartItem.save();
        res.status(201).json({ message: "Product added to cart", newCartItem });
    } catch (error) {
        res.status(500).json({ error: "Error adding product to cart" });
    }
});

// ✅ Update Cart Item (by CartID)
router.put("/item/:cartId", async (req, res) => {
    try {
        const { cartId } = req.params;
        const { ProductQuantity } = req.body;
        const cartItem = await CartSchema.findById(cartId);

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        cartItem.ProductQuantity = ProductQuantity;
        await cartItem.save();
        res.status(200).json({ message: "Product quantity updated", cartItem });
    } catch (error) {
        res.status(500).json({ error: "Error updating cart item" });
    }
});

// ✅ Remove Item from Cart (by CartID)
router.delete("/item/:cartId", async (req, res) => {
    try {
        const deletedItem = await CartSchema.findByIdAndDelete(req.params.cartId);

        if (!deletedItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }
        res.status(200).json({ message: "Cart item removed" });
    } catch (error) {
        res.status(500).json({ error: "Error removing cart item" });
    }
});

export { router };
