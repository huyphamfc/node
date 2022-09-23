const OrderModel = require('./model');


exports.getAllOrders = async (req, res) => {
    try {
        const result = await OrderModel.find();

        if (result.length === 0) throw 'Data is not exist.';

        res.status(200).json({
            status: 'success',
            results: result.length,
            data: result
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}


exports.getOrderStats = async (req, res) => {
    try {
        const stats = await OrderModel.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                    totalPrice: { $sum: "$price" },
                    avgPrice: { $avg: "$price" }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            stats
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}