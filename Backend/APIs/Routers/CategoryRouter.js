import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import CategorySchema from '../../Schemas/CategorySchema.js';

const router = express.Router();
router.use(bodyParser.json());

//Cloth : 67c462190b9dfa8816202c62
//electro : 67c4624d0b9dfa8816202c64

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../Frontend/public/Images/CategoryImage'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 1. Get All Categories
router.get("/", async (req, res) => {
    const categories = await CategorySchema.find();
    res.send(categories);
});

// 2. Get Category by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const category = await CategorySchema.findById(id);

    if (!category) {
        return res.send("Category not found");
    }
    res.send(category);
});

// 3. Insert a New Category
router.post("/", upload.single('CategoryImage'), async (req, res) => {
    const { CategoryName } = req.body;
    const CategoryImage = req.file ? req.file.filename : null;

    const newCategory = new CategorySchema({ CategoryImage : CategoryImage, CategoryName : CategoryName });

    await newCategory.save();
    res.send({ message: "Category created successfully", category: newCategory });
});

// 4. Update Category by ID
router.put("/:id", async (req, res) => {
    const { CategoryName } = req.body;
    const CategoryImage = req.file ? req.file.filename : null;
    const category = await CategorySchema.findById(
        req.params.id,
        { CategoryImage, CategoryName },
        { new: true }
    );

    if (!category) {
        return res.send("Category not found");
    }

    await category.save();
    res.send("Category updated successfully");
});

// 5. Delete Category by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const category = await CategorySchema.findByIdAndDelete(id);
    
    if (!category) {
        return res.send("Category not found");
    }
    res.send("Category deleted successfully");
});

export default router;