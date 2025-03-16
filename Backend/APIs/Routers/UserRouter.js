import mongoose from 'mongoose';
import express from 'express';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url';
import UserSchema from '../../Schemas/UserSchema.js';
import fs from 'fs';
import { log } from 'console';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../Frontend/public/Images/UserImage');
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('Absolute upload path:', path.resolve(uploadPath));
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

// Add User API (POST)
router.post('/register', upload.single('UserProfileImage'), async (req, res) => {
  try {
    console.log('File received:', req.file);
    const { UserName, UserEmail, UserPassword, UserContact, UserAddress, UserCity, UserState, UserCountry, UserPincode } = req.body;
    const UserProfileImage = req.file ? req.file.filename : null;

    const existingUser = await UserSchema.findOne({ UserEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new UserSchema({
      UserName,
      UserEmail,
      UserPassword,
      UserContact,
      UserAddress,
      UserCity,
      UserState,
      UserCountry,
      UserPincode,
      UserProfileImage,
    });

    const data = await newUser.save();
    const token = jwt.sign({ userId: data._id }, 'private', { expiresIn: '1h' });
    console.log(data._id);
    
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
  

//Login API
router.post('/login', async (req, res) => {
    const { UserName, UserPassword } = req.body;
    
    try {
      const user = await UserSchema.findOne({ UserName });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      if (user.UserPassword != UserPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
        
      const token = jwt.sign({ userId: user._id }, "private");
      console.log(user._id);
      
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update User API (PUT)
router.put("/:id", upload.single('UserProfileImage'), async (req, res) => {
    const { UserName, UserEmail, UserPassword, UserContact, UserAddress, UserCity, UserState, UserCountry, UserPincode } = req.body;
    const UserProfileImage = req.file ? req.file.filename : null;

    const updatedUser = await UserSchema.findByIdAndUpdate(
        req.params.id,
        { 
            UserName,
            UserEmail,
            UserPassword,
            UserContact,
            UserAddress,
            UserCity,
            UserState,
            UserCountry,
            UserPincode, 
            UserProfileImage: UserProfileImage || undefined
        },
        { new: true }
    );

    if (!updatedUser) {
        return res.send("User not found");
    }
    res.send("User updated successfully");
});

// Get All Users
router.get("/", async (req, res) => {
    const data = await UserSchema.find();
    res.send(data);
});

// Get User By ID
// router.get("/getOneAuth", authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         const data = await UserSchema.findOne({ _id: userId });
  
//         if (!data) {
//             return res.status(404).json({ message: 'User not found' });
//         }
  
//         res.send(data);
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });


router.get("/:id", async (req, res) => {
  try {
      const userId = req.params.id;
      const data = await UserSchema.findOne({ _id: userId });
      console.log(data);
      

      if (!data) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.send(data);
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete User By ID
router.delete("/:id", async (req, res) => {
    const data = await UserSchema.deleteOne({ _id: req.params.id });
    res.send(data);
});

// router.get("/profile", authenticate, async (req, res) => {
//   try {
//       const userData = await UserSchema.findById(req.user._id);

//       if (!userData) {
//           return res.status(404).json({ message: "User not found." });
//       }

//       res.status(200).json(userData);
//   } catch (error) {
//       res.status(500).json({ message: "Failed to retrieve user data.", error: error.message });
//   }
// });

export default router;