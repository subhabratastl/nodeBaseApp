module.exports={
    HOST:"localhost",
    USER:"subhabrata",
    PASSWORD:"Stlmysql#1234",
    DB:"stl_node_db",
    dialect: "mysql",
    //dialectOptions:{useUTC:false},
    timezone:"+05:30",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}