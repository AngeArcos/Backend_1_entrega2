import { Router } from "express";

import fs from "fs";

const cartsRoutes = Router();

const getCarts = async () => {
    try {
        const carts = await fs.promises.readFile("src/db/carts.json", "utf-8");
        return JSON.parse(carts);
    } catch (error) {
        return [];
    }
};

const saveCarts = async (carts) => {
    try {
        await fs.promises.writeFile("src/db/carts.json", JSON.stringify(carts, null, 2), "utf-8");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

cartsRoutes.post("/", async (req, res) => {
    const carts = await getCarts();
    const newCart = {
        id: generateUniqueId(),
        products: []
    };

    carts.push(newCart);
    const isSaved = await saveCarts(carts);

    if (!isSaved) {
        return res.status(500).send({ status: "Error", message: "Failed to create cart" });
    }

    res.status(201).send({ status: "OK", message: "Cart created successfully", cart: newCart });
});


cartsRoutes.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const carts = await getCarts();
    const cart = carts.find((cart) => cart.id === cid);

    if (!cart) {
        return res.status(404).send({ status: "Error", message: "Cart not found" });
    }

    res.send({ status: "OK", products: cart.products });
});

cartsRoutes.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await getCarts();
    const cart = carts.find((cart) => cart.id === cid);

    if (!cart) {
        return res.status(404).send({ status: "Error", message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex((product) => product.product === pid);

    if (productIndex === -1) {
        cart.products.push({ product: pid });
    } else {
        cart.products[productIndex].quantity = (cart.products[productIndex].quantity || 1) + 1;
    }

    const isSaved = await saveCarts(carts);

    if (!isSaved) {
        return res.status(500).send({ status: "Error", message: "Failed to add product to cart" });
    }

    res.status(201).send({ status: "OK", message: "Product added to cart", cart });
});


export default cartsRoutes;