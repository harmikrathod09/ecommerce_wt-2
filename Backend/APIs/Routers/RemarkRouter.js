import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'
import RemarkSchema from '../../Schemas/RemarkSchema.js';

const router = express.Router();
router.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, 'private', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
};

// 1. Get All Remarks
router.get("/", async (req, res) => {
    const remarks = await RemarkSchema.find();
    res.send(remarks);
});

// 2. Get Remark by ProductID
// router.get("/product/:id", async (req, res) => {
//     const { id } = req.params;
//     const remark = await RemarkSchema.find({ ProductID: id });
//     console.log(remark);
    

//     if (!remark) {
//         return res.send("Remark not found");
//     }
//     res.send(remark);
// });

// 3. Insert a New Remark
router.post("/", async (req, res) => {
    const { RemarkDescription, Rating, ProductID, UserId } = req.body;

    if (!RemarkDescription || !Rating || !ProductID || !UserId) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newRemark = new RemarkModel({
            RemarkDescription,
            Rating,
            ProductID,
            UserId,
            UpdatedAt: new Date().toISOString()
        });

        await newRemark.save();
        res.status(201).json({ message: "Remark added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add remark." });
    }
});


// ✅ Fetch Remarks by Product ID
router.get("/product/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        const remarks = await RemarkModel.find({ ProductID: productId }).populate("UserId");
        res.status(200).json(remarks);
    } catch (error) {
        res.status(500).json({ message: "Failed to load remarks." });
    }
});



// 4. Update Remark by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { RemarkDescription, Rating, UpdatedAt, UserId, ProductID } = req.body;
    const remark = await RemarkSchema.findById(id);

    if (!remark) {
        return res.send("Remark not found");
    }

    remark.RemarkDescription = RemarkDescription;
    remark.Rating = Rating;
    remark.UpdatedAt = UpdatedAt;
    remark.UserId = UserId;
    remark.ProductID = ProductID;
    
    await remark.save();
    res.send({ message: "Remark updated successfully", remark });
});

// 5. Delete Remark by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const remark = await RemarkSchema.findByIdAndDelete(id);

    if (!remark) {
        return res.send("Remark not found");
    }
    res.send("Remark deleted successfully");
});

export default router;