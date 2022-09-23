const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    name: String,
    size: String,
    price: Number,
    quantity: Number,
    data: Number
});

const OrderModel = mongoose.model('Order', orderSchema);


module.exports = OrderModel;