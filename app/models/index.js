/* eslint-disable node/no-path-concat */
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/db.config")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL);
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
    console.log("Koneksi ke database berhasil");
    console.log(config);
  }
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
      Sequelize.Model,
      Sequelize.QueryTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.passAttributes = (attributes) =>
  attributes instanceof Array
    ? { attributes }
    : attributes
    ? { attributes: [attributes] }
    : {};
db.likeValues = (value, ...fields) => {
  const whereOptions = {};
  fields.forEach((e) => {
    whereOptions[e] = { [Sequelize.Op.like]: `%${value}%` };
  });

  return whereOptions;
};
db.selectQuery = (rawQuery, replacements, options) =>
  sequelize.query(rawQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: (() => {
      if (!replacements) return {};

      const nonNullObject = {};
      Object.keys(replacements).forEach((objName) => {
        if (replacements[objName] || replacements[objName] === 0) {
          nonNullObject[objName] = replacements[objName];
        }
      });

      return nonNullObject;
    })(),
    ...options,
  });

module.exports = db;
