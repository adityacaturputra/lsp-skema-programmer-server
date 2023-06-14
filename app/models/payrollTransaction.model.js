"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PayrollTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PayrollTransaction.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      generated_at: {
        type: "TIMESTAMP",
        allowNull: false,
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bonus: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pph: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, 
    {
      sequelize,
      modelName: "PayrollTransaction",
      tableName: "lsp_generated_payrolls",
      timestamps: false,
      paranoid: false,
    }
  );
  return PayrollTransaction;
};