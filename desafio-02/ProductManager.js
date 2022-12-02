const fs = require('fs')

class ProductManager {

    constructor (path) {
        this.path = path
    }

    //Método para verificar que existe el archivo de this.path o si no exixste crearlo
    read = () => fs.existsSync(this.path)
                ? fs.promises.readFile(this.path).then(result => JSON.parse(result))
                : []

    write = list => fs.promises.writeFile(this.path, JSON.stringify(list))

    //Método que lee el archivo y retorna el array de productos
    getProducts = async () => {
            const list =  await this.read()
            return list
    }

    addProduct = async (product) => {
        const list = await this.read()
        product.id = !list.length ? 1 : list[list.length - 1].id + 1

        list.push(product)

        await this.write(list)
    }

    getProductByID = async (id) => {
        const list = await this.read()
        const productById = list.find(prod => prod.id == id)

        productById 
        ? console.log(productById)
        : console.log("No se encuentra el producto seleccionado")
    }

    updateProduct = async (id, product) =>{
        product.id = id
        const list = await this.read()

        const index = list.findIndex(prod => prod.id == id)

        if (index >= 0) {
            list[index] = product
            await this.write(list)
        }
    }

    deleteProduct = async (id) => {
        const list = await this.read()
        const index = list.findIndex(prod => prod.id == id)

        if (index >= 0) {
            list.splice(index, 1)
        } else {
            console.log("El ID seleccionado no corresponde a ningún producto")
        }

        await this.write(list)
    }
}

module.exports = ProductManager