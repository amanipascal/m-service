import { personRepository } from "../../Redis_database/models/persons";
import { EntityId } from "redis-om";
// All Business logic will be here
class Redis_PersonService {

    constructor() {
        this.repository = personRepository;
    }

    async Create(payload) {
        console.log('payload: ', payload)
        try {
            const createdData = await this.repository.save({...payload})
            console.log('created Data : ', createdData)
            return {
                status: 200, 
                message: "Success.",
                data: {Id: createdData[EntityId], ...createdData }
            }
        } catch (error) {
            return {status: 400, message: 'error.',  data:  null }
        }
    }
    

    async GetAll() {
        await personRepository.createIndex();
        try {
            const persons = await this.repository.search().returnAll();
            return {
                status: 200, 
                message: "Success.",
                data: {list: [...persons.map(obj => { return {id: obj[EntityId], ...obj} })]}
            }
        } catch (error) {
            return {status: 400, message: 'error.',  data:  null }
        } 
    }

    async GetOne(id) {
        try {
            const person = await this.repository.fetch(id)
            return {status: 200, message: "Success.", data: {id: person[EntityId], ...person}}
        } catch (error) {
            return {status: 400, message: 'error.',  data:  null }
        }
    }

    async Update(payload, id) {
        try {
            const uPerson = await this.repository.save(id, payload)
            return {status: 200, message: "Success.", data: {id: uPerson[EntityId], ...uPerson}}
        } catch (error) {
            return {status: 400, message: 'error.',  data:  null }
        }
       
    }

    async remove(id) {
        console.log('person id: ', id)
        try {
            const deleted = await this.repository.remove(id)
            console.log('deleted: ', deleted)
            return {status: 200, message: "Success.", data: { id }}
        } catch (error) {
            return {status: 400, message: 'error.',  data:  null }
        }
    }
     
}

module.exports = Redis_PersonService;