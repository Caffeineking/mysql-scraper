module.exports = function (sequelize, DataTypes) {
    var activeKidsScrape = sequelize.define("activeKidsScrape", {
        title: {
            type: DataTypes.STRING
        },
        link: {
            type: DataTypes.STRING,
        },
    },
        {
        timestamps: false
        });
    return activeKidsScrape;
}