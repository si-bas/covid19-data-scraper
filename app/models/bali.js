const {
    Sequelize,
    sequelize
} = require('./../../config/database');

const model = sequelize.define('bali', {
    // Attributes
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: Sequelize.DATEONLY
    },
    kabupaten: Sequelize.STRING,
    pp: Sequelize.INTEGER,
    otg: Sequelize.INTEGER,
    odp: Sequelize.INTEGER,
    pdp: Sequelize.INTEGER,
    lainnya: Sequelize.INTEGER,
    positif: Sequelize.INTEGER,
    sembuh: Sequelize.INTEGER,
    meninggal: Sequelize.INTEGER,
    positif_luar: Sequelize.INTEGER,
    positif_lokal: Sequelize.INTEGER,
    positif_dalam: Sequelize.INTEGER,
    positif_lainnya: Sequelize.INTEGER
}, {
    tableName: 'bali'
});

const updateOrCreate = (values, condition) => {
    return model
        .findOne({
            where: condition
        })
        .then(function (obj) {
            // update
            if (obj)
                return obj.update(values);
            // insert
            return model.create(values);
        });
}

module.exports = {
    model,
    updateOrCreate
}