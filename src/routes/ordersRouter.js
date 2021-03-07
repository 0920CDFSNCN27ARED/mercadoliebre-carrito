// ************ Require's ************
const express = require("express");
const router = express.Router();
const { Product, Sequelize, Order } = require("../database/models");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: ACCESS_TOKEN,
});

router.get("/mercadopago/success/:id", async (req, res) => {
    const paymentId = req.query.payment_id;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    order.orderNumber = paymentId;
    await order.save();
    res.send("EXITO, TU COMPRA FUE REALIZADA");
});

router.get("/mercadopago/success/:id", (req, res) => {
    res.send("FALLO, VOLVE A INTENTAR COMPRAR MÁS TARDE");
});

module.exports = router;
