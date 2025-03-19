import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import OrderSchema from '../../Schemas/OrderSchema.js';

const router = express.Router();
router.use(bodyParser.json());

// 1. Get All Orders
router.get("/", async (req, res) => {
    const orders = await OrderSchema.find();
    res.send(orders);
});

// 2. Get Order by User ID
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await OrderSchema.find({ UserID: userId }).populate("ProductItems.ProductID");
        if (!orders || orders.length === 0) {
            return res.status(404).json([]);
        }
        res.status(200).json(orders);  
    } catch (error) {
        res.status(500).json([]);
    }
});

// 3. Create New Order
router.post("/", async (req, res) => {
    try {
        const { UserID, ProductItems, TotalAmount, OrderDate } = req.body;

        const newOrder = new OrderSchema({
            UserID,
            ProductItems,
            TotalAmount,
            OrderDate
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: "Failed to create order", details: error.message });
    }
});

// 4. Delete Order by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const order = await OrderSchema.findByIdAndDelete(id);

    if (!order) {
        return res.send("Order not found");
    }
    res.send("Order deleted successfully");
});

export default router;
