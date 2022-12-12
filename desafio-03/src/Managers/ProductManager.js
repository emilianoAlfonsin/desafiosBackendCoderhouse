import fs from "fs"
import { NotFoundError, ValidationError } from "../utils/index.js"

export class ProductManager {
    constructor(path) {
        this.path = path
        this.#init()
    }

    #init() {
        try {
            const existFile = fs.existsSync(this.path)
            if (existFile) return

            fs.writeFileSync(this.path, JSON.stringify([]))
        }
        catch (error ) {
            console.log(error)
        }
    }

    #writeFile(data) {
        return fs.promises.writeFile(this.path, JSON.stringify(data, null, 3))
    }

    async getProducts() {
        const response = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(response)
    }

    async getProductByID(id) {
        const productsList = await this.getProducts()
        const productByID = productsList.find(prod => prod,id === id)

        return productByID 
    }

    async addProduct ({title, description, price, stock, code}) {
        const newProduct = {title, description, price, stock, code}
        const productsList = await this.getProducts()

        const existCode = productsList.some((product) => product.code === code)

        if (existCode) {
            throw new ValidationError("El código no pude repetirse")
        }

        newProduct.id = !productsList.length ? 1 : productsList[productsList.length - 1].id + 1

        productsList.push(newProduct)

        await this.#writeFile(productsList)
    }

    async update(id, newData) {
        const products = await this.getProducts()

        const productIdx = products.findIndex(prod => prod.id === id)

        if (productIdx === -1) throw new NotFoundError  ("El producto no fue encontrado")

        const product = products[productIdx]

        products[productIdx] = {...product, ...newData}

        await this.#writeFile(products)
    }

    async delete (id) {
        const products = await this.getProducts()

        const productIdx = products.findIndex(prod => prod.id === id)

        if (productIdx === -1) throw new NotFoundError  ("El producto no fue encontrado")

        const deletedProducts = products.splice(productIdx, 1)

        await this.#writeFile(products)

        return deletedProducts[0]
    }

}