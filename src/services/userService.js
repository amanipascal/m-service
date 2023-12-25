const { userReqpository } = require("../database");
const { FormateData } = require("../utils/utilitaires");
const { APIError } = require('../utils/app-errors');

// All Business logic will be here
class UserService {

    constructor(){
        this.repository = new userReqpository();
    }

    async Create(payload){
        try{
            const result = await this.repository.create(payload)
            return FormateData(result);
        }catch(err){
            throw new APIError('Data Not found')
        }
    }
    
    // async GetMany(queryObj){
    //     try{
    //         const result = await this.userReqpository.getMany(queryObj);
    //         return FormateData(result)
    //     }catch(err){
    //         throw new APIError('Data Not found')
    //     }
    // }

    async GetAll() {
        try{
            const result = await this.repository.getAll();
            return FormateData(result)
        }catch(err){
            throw new APIError('Data Not found')
        }
    }

    async GetOneById(id) {
        try{
            const result = await this.repository.getOneById(id);
            console.log('GetOne result: ', result)
            return FormateData(result)
        }catch(err){
            throw new APIError('Data Not found')
        }
    }

    async GetOneByEmail(email) {
        try{
            const result = await this.repository.getOneByEmail(email);
            console.log('GetOne result: ', result)
            return FormateData(result)
        }catch(err){
            throw new APIError('Data Not found')
        }
    }

    async Update(payload, id) {
        try{
            const result = await this.repository.update(payload, id);
            return FormateData(result)
        }catch(err){
            throw new APIError('Data Not found')
        }
    }

    async remove(id) {
        try{
            const result = await this.repository.remove(id);
            return FormateData(result)
        }catch(err){
            throw new APIError('Data Not found')
        }
    }


     
}

module.exports = UserService;