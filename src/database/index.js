import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../models/User';

const models = [User];

class Database{
    constructor(){
        this.init();
    }

    init(){
        //Conexao com os models
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models));
    }
}

export default new Database();