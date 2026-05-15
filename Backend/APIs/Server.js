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
    origin: ['http://localhost:5173', 'http://localhost:5174'],
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://ecommerce:ecommerce123@e-commerce-shard-00-00.jaz4g.mongodb.net:27017,e-commerce-shard-00-01.jaz4g.mongodb.net:27017,e-commerce-shard-00-02.jaz4g.mongodb.net:27017/?authSource=admin&replicaSet=atlas-4klo11-shard-0&tls=true').then(() => {
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