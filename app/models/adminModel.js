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
      //console.log(results); // Display the query results
      //return results;
      return { success: true, data: results };
    } catch (error) {
      console.error('Error executing query:', error);
      return { success: false, data: 'Data not inserted properly' };
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

        return { success: true, data: resultData };
      } catch (error) {
        console.log('error', error);
        return { success: false, data: 'Data not inserted properly' };
      }

    } catch (error) {
      console.log('error', error);
    }
  },

  validatedUser: async function (params) {
    console.log('signin Data', params.userName);
    try {
      let result = await user_master.findOne({
        where: {
          user_name: {
            [Op.eq]: sequelize.literal('?'),
          },
          password: {
            [Op.eq]: sequelize.literal('?'),
          },
          record_status:{
            [Op.eq]:1
          }
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
      let query = 'SELECT u.user_code,u.display_name,u.email_id,u.mobile_no,u.address,u.profile_photo,um.user_name,um.fk_role_code AS role_code,um.record_status,rms.role_name AS role_name FROM user_details u INNER JOIN user_masters um ON (u.user_code=um.user_code) INNER JOIN role_masters rms on (rms.role_code=um.fk_role_code) ';
      query += 'WHERE um.record_status NOT IN (2)';
      query += 'ORDER BY u.id DESC LIMIT ? OFFSET ? ';

      console.log('queryyyy', query);
      const [resultData] = await sequelize.query(query, {
        replacements: [params.length, st]
      })

      //console.log(result)
      return { success: true, data: resultData };
    } catch (err) {
      console.log(err);
      return { success: false, data: "User list not getting properly" };
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
    const query = 'UPDATE user_details ud JOIN user_masters um ON ud.user_code = um.user_code SET ud.display_name=?,ud.email_id=?,ud.mobile_no=?,ud.profile_photo=?,ud.address=?,ud.updated_by=?,um.fk_role_code=? Where ud.user_code=? AND um.user_code=?';

    try {
      const [results] = await sequelize.query(query, {
        replacements: [params.displayName,params.emailId, params.mobileNo, params.profilePhoto, params.address, params.updatedBy,params.roleCode, params.userCode,params.userCode] // Provide values for the placeholders
      });
      console.log(results); // Display the query results
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  getAllRoles: async function (params) {
    try {
      const query = 'SELECT role_code,role_name,record_status from role_masters where role_masters.record_status NOT IN (2)  order by id DESC';
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
    const query = 'SELECT COUNT(*) AS totalRecords FROM user_masters WHERE record_status NOT IN (2)';

    try {
      const [results] = await sequelize.query(query, {
        // Provide values for the placeholders
      });
      return { success: true, data: results };
    } catch (error) {
      console.error('Error executing query:', error);
      return { success: false, data: "User list not getting properly" };
    }
  },
  updateUserStatus:async function(params){
    try {
      const query = 'UPDATE user_details JOIN user_masters ON user_details.user_code = user_masters.user_code SET user_details.record_status = ?, user_masters.record_status = ?,user_details.updated_by=?,user_masters.updated_by=? WHERE user_details.user_code = ?';
      const [resultData] = await sequelize.query(query,{
        replacements:[params.statusCode,params.statusCode,params.updatedBy,params.updatedBy,params.userCode]
      })
      return resultData;
    } catch (err) {
      console.log(err);
    }
  },
    updateRoleStatus:async function(params){
      try {
        const query = 'UPDATE role_masters SET record_status = ?,updated_by=? WHERE role_code = ?';
        const [resultData] = await sequelize.query(query,{
          replacements:[params.statusCode,params.updatedBy,params.roleCode]
        })
        return resultData;
      } catch (err) {
        console.log(err);
      }
  },
  getUserCountModel:async function(){
    try{
      const query='SELECT COUNT(*) AS totalUsers,CAST(SUM(CASE WHEN record_status = 1 THEN 1 ELSE 0 END)AS SIGNED) AS activeUsers,CAST(SUM(CASE WHEN record_status = 0 THEN 1 ELSE 0 END)AS SIGNED) AS inActiveUsers FROM user_masters WHERE record_status NOT IN (2)';
      
      const [resultData] = await sequelize.query(query,{})
      //return { success: true, data: result };
      return resultData;
    }catch(err){
      console.log('get user count model...',err)
      //return { success: false, error: 'Sequelize query failed' };
      
    }
  },

  getGroupWiseUsersCountModel:async function(){
    try{
      const query='SELECT rm.role_name AS roleName,COUNT(*) AS totalCount FROM role_masters rm JOIN user_masters um ON rm.role_code = um.fk_role_code where rm.record_status NOT IN (2) GROUP BY rm.role_code ORDER BY rm.id';
      
      const [resultData] = await sequelize.query(query,{})
      return resultData;
    }catch(err){
      console.log('getGroupWiseUsersCountModel',err);
    }
  },

  createResourceModel: async function (params) {

    /* user_code,display_name,email_id,mobile_no,address,profile_photo,created_by*/
    const query = 'INSERT INTO resource_master (resource_code, resource_name,resource_link,is_maintenance,record_status,created_by) VALUES (?, ?, ?, ?, ?, ?)';
    try {
      const [results] = await sequelize.query(query, {
        replacements: [params.resourceCode,params.resourceName,params.resourceLink,params.isMaintenance,params.recordStatus,params.myUserCode] // Provide values for the placeholders
      });
      return { success: true,message:"Create Resource successfully", data: results };
    } catch (error) {
      console.error('Error executing query:', error);
      return { success: false,message:'Data not inserted properly' };
    }
  },
  getResourceModel:async function(params){
    try{
      const query="SELECT resource_code AS resourceCode, resource_name AS resourceName,resource_link AS resourceLink,is_maintenance isMaintenance,record_status AS recordStatus FROM resource_master WHERE record_status NOT IN (2) ORDER BY id DESC ";
      const [results] = await sequelize.query(query, {});
      return { success: true,message:"Data Fetch Successfully", data: results };
    }catch(err){
      console.error('Error executing query:', error);
      return { success: false,message:'Data not fetching due to server issue' };
    }
  },
  updateResouceModel:async function(params){
    try{
      const query="UPDATE resource_master SET resource_name=?,resource_link=?,is_maintenance=?,record_status=?,updated_by=? WHERE resource_code = ?";
      const [results] = await sequelize.query(query, {
        replacements:[params.resourceName,params.resourceLink,params.isMaintenance,params.recordStatus,params.myUserCode,params.resourceCode]
      });
      return { success: true,message:"Data Update Successfully"};
    }catch(err){
      console.error('Error executing query:', error);
      return { success: false,message:'Data do not updated due to server issue' };
    }
  }
}