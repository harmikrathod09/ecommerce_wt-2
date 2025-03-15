import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { router as CartRouter} from './Routers/CartRouter.js'
import CategoryRouter from './Routers/CategoryRouter.js'
import OrderRouter from './Routers/OrderRouter.js'
import ProductRouter from './Routers/ProductRouter.js'
import RemarkRouter from './Routers/RemarkRouter.js'
import UserRouter from './Routers/UserRouter.js'
import WishlistRouter from './Routers/WishlistRouter.js'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ecommerce:ecommerce123@e-commerce.jaz4g.mongodb.net/?retryWrites=true&w=majority&appName=e-commerce').then(() => {
    console.log("Database Connected");
    

    app.use("/cart",CartRouter);
    app.use("/category",CategoryRouter);
    app.use("/order",OrderRouter);
    app.use("/product",ProductRouter);
    app.use("/remark",RemarkRouter);
    app.use("/user",UserRouter);
    app.use("/wishlist",WishlistRouter);

    app.listen(3000,()=>{
        console.log("Server Started at ",3000);
    })
})