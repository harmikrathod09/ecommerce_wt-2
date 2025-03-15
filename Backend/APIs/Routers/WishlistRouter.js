import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import WishlistSchema from '../../Schemas/WishlistSchema.js';

const router = express.Router();
router.use(bodyParser.json());

// 1. Get All Wishlists
router.get("/", async (req, res) => {
    const wishlists = await WishlistSchema.find();
    res.send(wishlists);
});

// 2. Get Wishlist by UserID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const wishlist = await WishlistSchema.find({UserId : id});

    if (!wishlist) {
        return res.send("Wishlist not found");
    }
    res.send(wishlist);
});

// 3. Insert a New Wishlist
router.post("/", async (req, res) => {
    const { ProductId, UserId } = req.body;

    const newWishlist = new WishlistSchema({
        ProductId,
        UserId
    });

    await newWishlist.save();
    res.send({ message: "Wishlist created successfully", wishlist: newWishlist });
});

// 4. Update Wishlist by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { ProductID, UserId } = req.body;
    const wishlist = await WishlistSchema.findById(id);

    if (!wishlist) {
        return res.send("Wishlist not found");
    }

    wishlist.ProductID = ProductID;
    wishlist.UserId = UserId;

    await wishlist.save();
    res.send({ message: "Wishlist updated successfully", wishlist });
});

// 5. Delete Wishlist by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const wishlist = await WishlistSchema.findByIdAndDelete(id);

    if (!wishlist) {
        return res.send("Wishlist not found");
    }
    res.send("Wishlist deleted successfully");
});

export default router;