// ************ Require's ************
const express = require("express");
const router = express.Router();
const { Product, Sequelize, Order } = require("../../database/models");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: ACCESS_TOKEN,
});

router.post("/checkout", async (req, res) => {
    const userId = req.body.userId;
    const cart = req.body.cart;

    let total = 0;

    for (const cartProd of cart) {
        cartProd.fullProd = await Product.findByPk(cartProd.id);
        total += cartProd.fullProd.price * cartProd.quantity;
    }

    const order = await Order.create({ userId, total, orderNumber: 0 });

    const preference = {
        items: cart.map((cartProd) => {
            return {
                title: cartProd.fullProd.name,
                unit_price: Number(cartProd.fullProd.price),
                quantity: cartProd.quantity,
            };
        }),
        back_urls: {
            success: `${process.env.HOST}/orders/mercadopago/success/${order.id}`,
            pending: `${process.env.HOST}/orders/mercadopago/pending/${order.id}`,
            failure: `${process.env.HOST}/orders/mercadopago/failure/${order.id}`,
        },
    };

    const result = await mercadopago.preferences.create(preference);
    console.log(result);

    res.send({ init_url: result.body.init_point });
});

module.exports = router;
