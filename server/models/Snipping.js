'use strict';
module.exports = function(sequelize, Sequalize) {
    var Snipping = sequelize.define("Snipping", {
        status: Sequalize.STRING,
        api: Sequalize.STRING,
        secret: Sequalize.STRING,
    },{
        timestamps: false
    });
    Snipping.associate = function(models) {
        // associations can be defined here
      };
    return Snipping;
}