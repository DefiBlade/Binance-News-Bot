const { SnippingDetail } = require('../models');

module.exports = {

    snipping(req, res) {

        SnippingDetail.findAll({})
        .then(transactions => res.status(201).json({
            error: false,
            data : transactions
        }))
        .catch(error => res.json({
            error: true,
            message: error
        }));
    
    }

}