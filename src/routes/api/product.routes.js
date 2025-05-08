import { Router } from "express";
import fs from 'fs';

const productsRoutes = Router();


let idAutoincremental = 1;

const getProducts = async () => {
    try{
        const products = await fs.promises.readFile('src/db/products.json', 'utf-8'); 
        const productsConverted = JSON.parse(products); 
        return productsConverted;
    } catch (error) {
        return []; 

    }
}

const saveProducts = async (products) => {
    console.log({products}); 
    try{ 
        const pasedProducts = JSON.stringify(products);
        await fs.promises.writeFile ('src/db/products.json', pasedProducts, 'utf-8');
        return true;
    }catch (error) {
        console.log({error});
        return false;
    }
}

const getSingleProductById = async (pId) => {
    const products = await getProducts();
    const product = products.find(p => p.id === pId)
    return product
}

productsRoutes.get('/', async (req, res) => { 
    const limit = +req.query.limit; 
    const products = await getProducts();
    if(isNaN(limit) || !limit){ 
        return res.send({products}); 
    }


    const productLimited = products.slice(0, limit) 
    res.send({product: productLimited}).status(200);
});


 productsRoutes.get('/:pid', async (req, res) =>{
    const pId = +req.params.pid;
    const product = await getSingleProductById(pId)
    if (!product){
        return res.status(404).send({status: 'Error', message: 'Producto not found'});
    }
    res.send({product});
 });


productsRoutes.post('/', async (req, res) => {
    const product = req.body;  

    product.id = Math.floor(Math.random() * 10000);

    if(!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category){
        return res.status(400).send({status:'error', message: 'Product incomleted'}); 
    }
    const products = await getProducts();

    
    products.push(product); 

    const isOK = await saveProducts(products);
    if(!isOK){ 
        return res.send({status: 'Error', message: 'Product could not add'});
    }
    console.log({products});
    res.status(201).send({status: 'Ok', message: 'Product added', product: product});

}); 


productsRoutes.delete('/:pid', async (req, res) => {
    const id = +req.params.pid;
    const product = await getSingleProductById(id);
    if(!product){
        return res.status(404).send({status: 'Error', message: 'Product not found'});
    }
    const products = await getProducts();
    const filterProducts = products.filter(p => p.id !== id);
    const isOK = await saveProducts(filterProducts);
    if(!isOK) {
        return res.status(400).send({status: 'Error', message: 'something went wrong'})
    }
    res.send({status: 'OK', message: 'Product deleted'})

});


productsRoutes.put('/:pid', async (req, res) => {
    const pId = +req.params.pid; 
    const productToUpdate = req.body; 
    const products = await getProducts(); 

    if (!productToUpdate.title || !productToUpdate.description || !productToUpdate.code || 
        !productToUpdate.price || !productToUpdate.status || !productToUpdate.stock || 
        !productToUpdate.category) {
        return res.status(400).send({ status: 'error', message: 'Product incomplete' });
    }


    const productIndex = products.findIndex(p => p.id === pId);

    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex], 
            ...productToUpdate,       
            id: pId                 
        };
        const isOK = await saveProducts(products); 
        if (!isOK) {
            return res.status(500).send({ status: 'error', message: 'Could not update product' });
        }
        return res.send({ status: 'OK', message: 'Product updated successfully', product: products[productIndex] });
    }

    const newProduct = {
        ...productToUpdate,
        id: pId 
    };
    products.push(newProduct); 

    const isOK = await saveProducts(products); 
    if (!isOK) {
        return res.status(500).send({ status: 'error', message: 'Could not create product' });
    }

    res.status(201).send({ status: 'OK', message: 'Product created successfully', product: newProduct });
});


export default productsRoutes;

