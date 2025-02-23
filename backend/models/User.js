const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Импортируем sequelize

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

// Синхронизация модели с базой данных
const syncModel = async () => {
    try {
        await User.sync();
        console.log('Модель "Пользователь" синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели "Пользователь":', error);
    }
};

module.exports = {
    User,
    syncModel,
};
