const dbConfig = require("../config/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // dialectOptions: {
  //   useUTC: dbConfig.useUTC
  // },
  timezone:dbConfig.timezone,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

// Check connection status
async function checkConnection() {
    try {
      await sequelize.authenticate();

      console.log('Connection has been established successfully.');
      
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  
  // Usage
 //checkConnection();

  //module.exports=

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.users = require("./userModel.js")(sequelize, Sequelize);
module.exports = {
    sequelize,
    checkConnection,
  };
