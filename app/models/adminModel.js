const { Op, DataTypes } = require("sequelize");
const db = require("./index.js")

// Define your model
let sequelize = db.sequelize;
const User = sequelize.define('user_details', {
  user_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  display_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile_no: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const user_master = sequelize.define('user_masters', {
  user_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fk_role_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Define the association between the tables
User.hasMany(user_master, { foreignKey: 'user_code' });
user_master.belongsTo(User, { foreignKey: 'user_code' });



var adminModel = module.exports = {
  // Create a prepared statement using Sequelize
  createUserDetails: async function (params) {

    /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
    const query = 'INSERT INTO user_details (user_code, display_name,email_id,mobile_no,address,profile_photo,created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';

    try {
      const [results] = await sequelize.query(query, {
        replacements: [params.user_codes, params.displayName, params.emailId, params.mobileNo, params.address, 'profilePhoto' in params ? params.profilePhoto : null, params.createdBy] // Provide values for the placeholders
      });
      console.log(results); // Display the query results
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  createUserDetailsMaster: async function (params) {
    try {
      let query2 = "SELECT SHA2(CONCAT(?,'#','password'),256) AS encodePassword";
      try {
        const [result] = await sequelize.query(query2, {
          replacements: [params.userId]
        })
        console.log(result[0].encodePassword);
        const query = 'INSERT INTO user_masters (user_code,user_name,password,fk_role_code,created_by) VALUES (?, ?, ?, ?, ?)';
        const [resultData] = await sequelize.query(query, {
          replacements: [params.user_codes, params.userId, result[0].encodePassword, params.roleCode, params.createdBy]
        })
        console.log(resultData);
        return resultData;
      } catch (error) {
        console.log('error', error);
      }

    } catch (error) {
      console.log('error', error);
    }
  },

  validatedUser: async function (params) {
    console.log('signin Data', params);
    try {
      let result = await user_master.findOne({
        where: {
          user_name: {
            [Op.eq]: sequelize.literal('?'),
          },
          password: {
            [Op.eq]: sequelize.literal('?'),
          },
        },
        replacements: [params.userName, params.password],
        attributes: [
          [sequelize.literal('1'), 'result'],
        ],
      });

      console.log('validateeeeee', result);
      if (result != null) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      sequelize.close();
    }
  },

  getAllUserList: async function (params) {
    console.log(params);
    try {
      // const limit = 10;  // The number of records to fetch
      // const offset = 20; // The number of records to skip

      // const resultData = await User.findAll({
      //   attributes: ['user_code', 'display_name','email_id','mobile_no','address','profile_photo'],
      //   limit: sequelize.literal('?'),
      //   offset: sequelize.literal('?'),
      //   replacements: [params.start, params.length],
      // });

      let st = ((params.start - 1) * params.length);
      let query = 'SELECT u.user_code,u.display_name,u.email_id,u.mobile_no,u.address,u.profile_photo,um.user_name,um.fk_role_code AS role_code,rms.role_name AS role_name FROM user_details u INNER JOIN user_masters um ON (u.user_code=um.user_code) INNER JOIN role_masters rms on (rms.role_code=um.fk_role_code) ';
      query += 'ORDER BY u.id DESC LIMIT ? OFFSET ? ';

      console.log('queryyyy', query);
      const [resultData] = await sequelize.query(query, {
        replacements: [params.length, st]
      })

      //console.log(result)
      return resultData;
    } catch (err) {
      console.log(err);
    }
  },

  getUserData: async function (params) {
    console.log(params);
    try {
      // const resultData = await User.findOne({
      //   include: [
      //     {
      //         model: user_master,
      //         on: {
      //             col1: sequelize.where(sequelize.col("user.params.userName"), "=", sequelize.col("user_master.params.userName"))
      //         },
      //         attributes: ['fk_role_code'] // empty array means that no column from ModelB will be returned
      //     }
      // ],
      //   where:{email_id:{
      //     [Op.eq]: sequelize.literal('?'),
      //   }},
      //   attributes: ['user_code', 'display_name','email_id','mobile_no','address','profile_photo'],
      //   replacements: [params.userName,params.userName],
      // });

      //const query = 'SELECT u.user_code,u.display_name,u.email_id,u.mobile_no,u.address,u.profile_photo,um.fk_role_code AS role_code FROM user_details u INNER JOIN user_masters um ON (u.user_code=um.user_code) WHERE u.=?';
      const query = 'SELECT user_code,fk_role_code AS role_code FROM user_masters WHERE user_name=?'
      const [resultData] = await sequelize.query(query, {
        replacements: [params.userName]
      })

      console.log(resultData)
      return resultData;
    } catch (err) {
      console.log(err);
    }
  },

  UserUpdateDetails: async function (params) {

    /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
    if (params.profilePhoto == "") {
      params.profilePhoto = null
    }
    const query = 'UPDATE user_details SET email_id=?,mobile_no=?,profile_photo=?,address=?,updated_by=? Where user_code=?';

    try {
      const [results] = await sequelize.query(query, {
        replacements: [params.emailId, params.mobileNo, params.profilePhoto, params.address, params.updatedBy, params.userCode] // Provide values for the placeholders
      });
      console.log(results); // Display the query results
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  getAllRoles: async function (params) {
    try {
      const query = 'SELECT role_code,role_name from role_masters where record_status=1 order by id DESC';
      const [resultData] = await sequelize.query(query)
      return resultData;
    } catch (err) {
      console.log(err);
    }
  },

  createRoleDetails: async function (params) {

    /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
    const query = 'INSERT INTO role_masters (role_code, role_name,created_by) VALUES (?, ?, ?)';

    try {
      const [results] = await sequelize.query(query, {
        replacements: [params.role_code, params.role_name, params.createdBy] // Provide values for the placeholders
      });
      console.log(results); // Display the query results
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  updateRoleDetails: async function (params) {

    /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
    const query = 'UPDATE role_masters SET role_name=?, updated_by=? Where role_code=?';

    try {
      const [results] = await sequelize.query(query, {
        replacements: [params.role_name, params.updatedBy, params.role_code] // Provide values for the placeholders
      });
      console.log(results); // Display the query results
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  getTotalCount: async function (params) {

    /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
    const query = 'SELECT COUNT(*) AS totalRecords FROM user_details';

    try {
      const [results] = await sequelize.query(query, {
        // Provide values for the placeholders
      });
      console.log(results); // Display the query results
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },



}