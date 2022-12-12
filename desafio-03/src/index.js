import express from "express";
import productsRouter from './routers/products.router.js'


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products', productsRouter)

const PORT = 8080;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
