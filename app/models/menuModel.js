const { Op, DataTypes } = require("sequelize");
const db = require("./index.js")

// Define your model
let sequelize = db.sequelize;

var menuModel=module.exports ={
    menuCreateModel:async function(params){
        try {
            
            const query = 'INSERT INTO menu_master (menu_name, resource_code,parent_id,menu_order, has_child,icon_class,created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [results] = await sequelize.query(query, {
                replacements: [params.menuName,params.resourceCode,params.parentId,params.menuOrder, params.hasChild,params.iconClass,params.myUserCode]
            });
            return { success: true,message:"Added New menu.", data: results };
        } catch (error) {
            console.error('Error executing query:', error);
            return { success: false,message:'Data not inserted properly' };
        }
    },

    menuGetAllModel:async function(params){
        try{
            
            //console.log('menu modellll', params);
            let ofset;
            let query = "select a.*,rm.resource_name,(select COUNT(*) FROM menu_master WHERE record_status NOT IN (?)) AS total_count,ifnull(b.menu_name,0) as parent_name from menu_master a left join (select menu_name,id from menu_master  WHERE parent_id=0) b on b.id=a.parent_id and a.parent_id!=0 left join resource_master rm ON (rm.resource_code=a.resource_code) WHERE a.record_status NOT IN (?) ORDER BY a.menu_order";
            if(('start' in params) && ('length' in params)){
                ofset = ((params.start - 1) * params.length);
                query += ' LIMIT ? OFFSET ?';
            }
            const [results] = await sequelize.query(query, {
                replacements: [2,2,params.length, ofset]
            });
            console.log('model....',results);
            return { success: true,message:"get ALL menu.", data: results };
        }catch(err){
            console.error('Error executing query:', err);
            return { success: false,message:'Data not get properly' };
        }
    },
    menuUpdateModel:async function(params){
        try {
            let query = "UPDATE menu_master SET menu_name=?, resource_code=?,parent_id=?,menu_order=?, has_child=?,icon_class=?,updated_by=?,record_status=? WHERE id = ?";
            const [results] = await sequelize.query(query, {
              replacements: [params.menuName,params.resourceCode,params.parentId,params.menuOrder, params.hasChild,params.iconClass,params.myUserCode,params.recordStatus,params.menuId]
            });
            return { success: true, message: "Data Update Successfully" };
          } catch (err) {
            console.error('Error executing query:', err);
            return { success: false, message: 'Data do not updated due to server issue' };
          }
    },
    getMenuDataForDropdownModel:async function(){
        try{
            let replacementsData=[];
            let query = "SELECT id AS menuId,menu_name AS menuName FROM menu_master WHERE record_status NOT IN (?,?)";
            replacementsData=[...replacementsData,2,0];
            const [results] = await sequelize.query(query, {
                replacements:replacementsData
            });
            return { success: true, message: "Data fetch Successfully",data:results };
        }catch(err){
            console.error('Error executing query:', err);
            return { success: false, message: 'Data do not fetch successfully due to server issue' };
        }
    }
}