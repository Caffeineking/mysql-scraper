module.exports = function (sequelize, DataTypes) {
    var eyespyla = sequelize.define("eyespyla", {
        title: {
            type: DataTypes.STRING
        },

        // date: {
        //     type: DataTypes.STRING
        // },
        // description:{
        //     type:DataTypes.TEXT
        // },
        // details:{
        //     type:DataTypes.TEXT
        // },
        link:{
            type:DataTypes.STRING
        }
    },
        {
        timestamps: false
        });
    return eyespyla;
}