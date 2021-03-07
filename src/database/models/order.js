"use strict";
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        "Order",
        {
            orderNumber: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
        },
        {
            tableName: "orders",
        }
    );
    Order.associate = function (models) {
        Order.belongsTo(models.User, {
            as: "user",
            foreignKey: "userId",
        });

        Order.hasMany(models.Item, {
            as: "items",
            foreignKey: "cartId",
        });
    };
    return Order;
};
