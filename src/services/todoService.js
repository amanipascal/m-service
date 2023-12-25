const { todoReqpository } = require("../database");
const { FormateData } = require("../utils/utilitaires");
const { APIError } = require('../utils/app-errors');

// All Business logic will be here
class TodoService {

    constructor(){
        this.repository = new todoReqpository();
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
    //         const result = await this.repository.getMany(queryObj);
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

    async GetOne(id) {
        try{
            const result = await this.repository.getOne(id);
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

module.exports = TodoService;