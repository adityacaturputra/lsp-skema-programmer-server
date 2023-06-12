require("dotenv").config();

const { DB_HOST, DB_PASSWORD, DB_USERNAME, DB_NAME, DB_PORT } = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    ssl: true,
    dialect: "postgres",
    dialectOptions: {
      multipleStatements: true,
      encrypt: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    ssl: true,
    dialect: "postgres",
    dialectOptions: {
      multipleStatements: true,
      encrypt: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    ssl: true,
    dialect: "postgres",
    dialectOptions: {
      multipleStatements: true,
      encrypt: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
