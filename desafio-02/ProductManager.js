const fs = require('fs')
const { json } = require('stream/consumers')

class ProductManager {

    constructor (path) {
        this.path = path
        this.init //Invoca el método al crear la instancia
    }

    //Método para verificar que existe el archivo de this.path o si no exixste crearlo
    init() {
        try {
            const existFile = fs.existsSync(this.path)
            if (existFile) {
                fs.writeFileSync(this.path, JSON.stringify([]))
            } 
        }
        catch (error) {
            console.log(error)
        }
    }

    //Método que lee el archivo y retorna el array de productos
    async getProducts() {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(response)
        }
        catch (error) {
            console.log(error)
        }
    }

    // getProductByID = (id) => {
    //     const prodById = this.products.find((prod) => prod.id == id)
    //     prodById 
    //     ? console.log(prodById) 
    //     : console.log("No se encuentra el producto seleccionado")
    // }

    async addProduct ({title, description, price, tumbnail, code, stock}) {
        try{
            if (!title || !description || !price || !tumbnail || !code || !stock) {
                return console.log("Por favor verifique que todos los campos del producto se encuentren completos")
            }
    
            const codeControl = products.find((prod) => prod.code == code )
            if (codeControl) {
                return console.log("El código del producto ingresado ya se encuentra en uso")
            } 
    
            const product = {
                title,
                description,
                price,
                tumbnail,
                code,
                stock
            }
    
            const products = await this.getProducts();
            
            product.id = !products.length
            ? 1
            : products[products.length - 1].id + 1
    
            products.push(product)
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3))
    
            return product
        }
        catch (error) {
            console.log(error)
        }
    }

}

const manager = new ProductManager("./db-products.json")
manager.getProducts()
console.log(manager.products)
manager.addProduct( "producto prueba", "Este es un producto prueba", 200, "Sin imágen", "abc123", 25)
manager.getProducts()
console.log(manager.products)
manager.addProduct( "producto prueba", "Este es un producto prueba", 200, "Sin imágen", "abc123", 25)
manager.getProducts()
console.log(manager.products)
// manager.getProductByID(1)
