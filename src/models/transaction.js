const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      allowNull: false 
    },
    transactionDate: { 
				allowNull: false,
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW
			},
		transactionAmount: {
      type: DataTypes.BIGINT, 
      allowNull: false 
    },
		balance: {type: DataTypes.BIGINT, 
      allowNull: false, 
      defaultValue: 0
    },
		transactionType: {
      type: DataTypes.TINYINT, 
      allowNull: false
    },
		briefs: {
      type: DataTypes.STRING, 
      allowNull: false, 
      defaultValue: ""
    },
  },{timestamps:false});

  transaction.associate = function (models) {
    models.transaction.belongsTo(models.account, {
      foreignKey: {
        name: "accountNumber", 
        allowNull:false
      },
      onUpdate: 'CASCADE'
    });
  };

  return transaction;
}