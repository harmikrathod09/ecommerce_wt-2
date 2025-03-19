import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import RemarkSchema from '../../Schemas/RemarkSchema.js';

const router = express.Router();
router.use(bodyParser.json());

// 1. Get All Remarks
router.get("/product/:id", async (req, res) => {
    const { id } = req.params;
    const remark = await RemarkSchema.find({ ProductID: id });

    if (!remark || remark.length === 0) {
        return res.status(404).send({ error: "Remark not found" });
    }
    res.send(remark);
});



// 3. Insert a New Remark
router.post("/addRemarks", async (req, res) => {
    try {
        const { RemarkDescription, Rating, ProductID, UserId } = req.body;

        // Field validation
        if (!RemarkDescription || !Rating || !ProductID || !UserId) {
            return res.status(400).send({ error: "All fields are required" });
        }

        const newRemark = new RemarkSchema({
            RemarkDescription,
            Rating,
            UpdatedAt: new Date(),
            UserId,
            ProductID
        });

        await newRemark.save();
        res.send({ message: "Remark created successfully", remark: newRemark });
    } catch (error) {
        res.status(500).send({ error: "Failed to create remark", details: error.message });
    }
});

// 4. Update Remark by ID
router.put("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { RemarkDescription, Rating, UpdatedAt, UserId, ProductID } = req.body;

        const remark = await RemarkSchema.findById(id);

        if (!remark) {
            return res.status(404).send({ error: "Remark not found" });
        }

        remark.RemarkDescription = RemarkDescription;
        remark.Rating = Rating;
        remark.UpdatedAt = UpdatedAt || new Date();
        remark.UserId = UserId;
        remark.ProductID = ProductID;

        await remark.save();
        res.send({ message: "Remark updated successfully", remark });
    } catch (error) {
        res.status(500).send({ error: "Failed to update remark", details: error.message });
    }
});

// 5. Delete Remark by ID
router.delete("/product/remarks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const remark = await RemarkSchema.findByIdAndDelete(id);

        if (!remark) {
            return res.status(404).send({ error: "Remark not found" });
        }
        res.send("Remark deleted successfully");
    } catch (error) {
        res.status(500).send({ error: "Failed to delete remark", details: error.message });
    }
});

export default router;


