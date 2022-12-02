const ProductManager = require('./ProductManager')

const manager = new ProductManager('products.json');

( async () => {
    await manager.addProduct({
        name: 'apple',
        price: 10
    })  

    await manager.addProduct({
        name: 'apple',
        price: 10
    })
    
    console.log(await manager.getProducts())
    
    await manager.updateProduct(1, {
        name: 'apple',
        price: 5
    }) 
    
    console.log(await manager.getProducts())
    
    await manager.deleteProduct(1)
    
    console.log(await manager.getProducts())
})()