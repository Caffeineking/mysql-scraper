        
module.exports = function (sequelize, DataTypes) {
    var timeOutScrape = sequelize.define("timeOutScrape", {
        title: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING,
        },
        summary: {
            type: DataTypes.STRING,
        },
        readMoreLink: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.STRING,
        }
    },
        {
        timestamps: false
        });
    return timeOutScrape;
}