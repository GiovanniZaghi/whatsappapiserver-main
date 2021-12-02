module.exports = {
   
    //Postgres
    /*dialect: 'postgres',
    host: '127.0.0.1',
    username: 'postgres',
    password: 'admin',
    database: 'whatsapi',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },*/
    //MYSQL
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'whatsapi',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};