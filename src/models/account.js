module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define('account', {
    accountNumber: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true, 
      allowNull: false 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    balance: { 
      type: DataTypes.BIGINT, 
      allowNull: false, 
      defaultValue: 0 
    }
  },{timestamps:false});

  account.associate = function (models) {
    models.account.belongsTo(models.user, {
      foreignKey: 'id'
    });
  };

  return account;
}