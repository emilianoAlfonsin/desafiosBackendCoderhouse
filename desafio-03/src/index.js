import express from "express";
import { ERRORS } from "./consts/errors.js";
import { productManager } from "./Managers/index.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = 8080;

app.get("/api/products", async(req, res) => {

    try{
        const { limit } = req.query

        const allProducts = await productManager.getProducts();
        
        if (!limit || limit < 1) {
            return res.send({success: true, products: allProducts})
        }

        const product = allProducts.slice( 0, limit )

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
            res.send({success: false, error: "Todas las variables son requeridas"})
        }
        
        const addedProduct = await productManager.addProduct({ title, description, price, code, stock })
        
        res.send({success: true, product: addedProduct})
        
    } catch (error) {
        console.log(error)
        
        if (error.name === ERRORS.VALIDATION_ERROR) {
            return res.send({
                success: false,
                error: `${error.name}: ${error.message}`
            })
        }

        res.send({success: false, error: "Ha ocurrido un error"})
    }

    app.put("/api/products/:id", async (req, res) => {
        try {
            const { id: paramId } = req.params

            const id = Number(paramId)

            if (Number.isNaN(id) || id < 0) {
                return res.send({success: false, error: "El id de ser un número válido"})
            }

            const {title, description, price, code, stock} = req.body
        
            const updatedproduct = await productManager.update(id, { title, description, price, code, stock })

            res.send({ success: true, product: updatedproduct })
        } catch (error) {
            console.log(error)

            if (error.name === ERRORS.NOT_FOUND_ERROR) {
                return res.send({
                    success: false,
                    error: `${error.name}: ${error.message}`
                })
            }

            res.send({success: false, error: "Ha ocurrido un error"})
        }
    })

    app.delete('/api/products/:id', async(req, res) => {
        try {
            const { id: paramId } = req.params

            const id = Number(paramId)

            if (Number.isNaN(id) || id < 0) {
                return res.send({success: false, error: "El id de ser un número válido"})
            }

            const deletedProduct = await productManager.delete(id)

            res.send({ succes: true, deleted: deletedProduct})
        } catch (error) {
            console.log(error)

            if (error.name === ERRORS.NOT_FOUND_ERROR) {
                return res.send({
                    success: false,
                    error: `${error.name}: ${error.message}`
                })
            }

            res.send({success: false, error: "Ha ocurrido un error"})
        }
    })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
