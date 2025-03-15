import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductSchema from '../../Schemas/ProductSchema.js';

const router = express.Router();
router.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../Frontend/public/Images/ProductImage'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Add Product API (POST)
router.post("/", upload.single('ProductImage'), async (req, res) => {
    const { ProductName, ProductDescription, ProductPrice, ProductQuantity, ProductDiscount, ProductPurchaseCount, CategoryID } = req.body;
    const ProductImage = req.file ? req.file.filename : null;

    const newProduct = new ProductSchema({
        ProductImage,
        ProductName,
        ProductDescription,
        ProductPrice,
        ProductQuantity,
        ProductDiscount,
        ProductPurchaseCount,
        CategoryID
    });

    await newProduct.save();
    res.send("Product created successfully");
});

// Update Product API (PUT)
router.put("/:id", upload.single('ProductImage'), async (req, res) => {
    const { ProductName, ProductDescription, ProductPrice, ProductQuantity, ProductDiscount, ProductPurchaseCount, CategoryID } = req.body;
    const ProductImage = req.file ? req.file.filename : null;

    const updatedProduct = await ProductSchema.findByIdAndUpdate(
        req.params.id,
        {
            ProductName,
            ProductDescription,
            ProductPrice,
            ProductQuantity,
            ProductDiscount,
            ProductPurchaseCount,
            CategoryID,
            ProductImage: ProductImage || undefined
        },
        { new: true }
    );

    if (!updatedProduct) {
        return res.send("Product not found");
    }
    res.send("Product updated successfully");
});

// Get Product By ID (GET)
router.get("/:id", async (req, res) => {
    const product = await ProductSchema.findById(req.params.id);

    if (!product) {
        return res.send("Product not found");
    }
    res.send(product);
});

// Get Product By CategoryID (GET)
router.get("/category/:id", async (req, res) => {
    const products = await ProductSchema.find({ CategoryID : req.params.id });

    if (!products) {
        return res.send("Products not found");
    }
    res.send(products);
});

// Get All Products (GET)
router.get("/", async (req, res) => {
    const products = await ProductSchema.find();
    res.send(products);
});

// Delete Product By ID (DELETE)
router.delete("/:id", async (req, res) => {
    const deletedProduct = await ProductSchema.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
        return res.send("Product not found");
    }
    res.send("Product deleted successfully");
});

export default router;