const { Op, DataTypes } = require("sequelize");
const db = require("./index.js")

// Define your model
let sequelize = db.sequelize;

var menuModel=module.exports ={
    menuCreateModel:async function(params){
        try {
            console.log('menu modellll', params);
            const query = 'INSERT INTO menu_master (menu_name, resource_code,parent_id,menu_order, has_child,icon_class,access_type,created_by) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
            const [results] = await sequelize.query(query, {
                replacements: [params.menuName,params.resourceCode,params.parentId,params.menuOrder, params.hasChild,params.iconClass,params.accessType,params.myUserCode]
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
            let query = "select a.*,ifnull(b.menu_name,'#') as parent_name from menu_master a left join (select menu_name,id from menu_master  WHERE parent_id='#') b on b.id=a.parent_id and a.parent_id!='#' ORDER BY a.menu_order";
            if(('start' in params) && ('length' in params)){
                ofset = ((params.start - 1) * params.length);
                query += ' LIMIT ? OFFSET ?';
            }
            const [results] = await sequelize.query(query, {
                replacements: [params.length, ofset]
            });
            console.log('model....',results);
            return { success: true,message:"get ALL menu.", data: results };
        }catch(err){
            console.error('Error executing query:', err);
            return { success: false,message:'Data not get properly' };
        }
    }

}