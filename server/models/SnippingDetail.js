module.exports = function(sequelize, Sequalize) {
    var SnippingDetail = sequelize.define("SnippingDetail", {
        timestamp: Sequalize.STRING,
        title: Sequalize.STRING,
        coin: Sequalize.STRING,
        note: Sequalize.STRING,
        url: Sequalize.STRING,
    },{
        timestamps: false
    });
    SnippingDetail.associate = function(models) {
        // associations can be defined here
      };
    return SnippingDetail;
}