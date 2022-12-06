import express from "express";
import { productManager } from "./Managers/index.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = 8080;

app.get("/api/products", async(req, res) => {

    try{
        const { limit, skip } = req.query

        const allProducts = await productManager.getProducts();
        
        if (!limit || limit < 1) {
            return res.send({success: true, products: allProducts})
        }

        const product = allProducts.slice(skip ?? 0, limit + skip)

        res.send({success: true, products: allProducts})
    }
    catch (error) {
        console.log(error)

        res.send({success: false, error: "Ha ocurrido un error"})
    }
})

app.get("/api/products/:id", async (req, res) => {
    try {
        const { id: paramId } = req.params

        const id = Number(paramId)

        if (Number.isNaN(id) || id < 0) {
            return res.send({success: false, error: "El id de ser un número válido"})
        }
        
        const product = await productManager.getProductByID(id)
        
        if(!product) {
            return res.send({success: false, error: "Producto no encotrado"})
        }

        res.send({success: true, product})

    } catch (error) {
        console.log(error)

        res.send({success: false, error: "Ha ocurrido un error"})
    }
})

app.post("/api/products", async(req, res) => {
    try {
        const {title, description, price, code, stock} = req.body

        if (!title || !description|| !price|| !code|| !stock) {
            res.send({success: true, error: "Todas las variables son requeridas"})
        }

        const savedProduct = await productManager.addProduct({ title, description, price, code, stock })

        res.send({success: true, product: savedProduct})

    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
