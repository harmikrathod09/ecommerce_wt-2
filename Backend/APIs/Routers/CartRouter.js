import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import CartSchema from '../../Schemas/CartSchema.js';

const router = express.Router();
router.use(bodyParser.json());

// ✅ Get All Cart Items (for Debugging)




// Add Item to Cart
router.post("/", async (req, res) => {
    const { ProductID, ProductQuantity, UserID } = req.body;

    const newCartItem = new CartSchema({
        ProductID,
        ProductQuantity,
        UserID
    });

    await newCartItem.save();
    res.send("Product added to cart");
});

// ✅ Empty Cart (by UserID)
router.delete("/:userId", async (req, res) => {
    try {
        await CartSchema.deleteMany({ UserID: req.params.userId });
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
