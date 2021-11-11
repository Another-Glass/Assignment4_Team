module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: { 
      type: DataTypes.STRING, 
      primaryKey: true, 
      allowNull: false 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    salt: { 
      type: DataTypes.STRING, 
      allowNull: false 
    }
  },{timestamps:false});

  return user;
};