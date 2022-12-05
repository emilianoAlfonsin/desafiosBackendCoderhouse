import fs from "fs"

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

        const existCode = productsList.some(product => product.code = code)

        if (existCode) {
            throw new Error("El código no pude repetirse")
        }

        newProduct.id = !productsList.length ? 1 : productsList[productsList.length - 1].id + 1

        productsList.push(newProduct)

        await fs.promises.writeFile(this.path, JSON.stringify(productsList, null, 3))
    }

}