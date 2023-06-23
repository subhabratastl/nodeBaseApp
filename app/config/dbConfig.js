module.exports={
    HOST:"192.168.0.108",
    USER:"root",
    PASSWORD:"",
    DB:"admin_project",
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