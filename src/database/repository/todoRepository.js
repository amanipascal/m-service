const { TodoModel } = require('../model')


class TodoRepository {

    async create(data) {
        try {
            const instance = new TodoModel(data);
            const created = await instance.save()
            return created
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async update(data, id) {
        try {
            await TodoModel.findByIdAndUpdate(id, {...data});
            const updated = await TodoModel.findById(id);
            return updated
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async getOne(id) {
        try {
            const item = await TodoModel.findById(id);
            return item;
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async getMany(queryObj) {
        try {
            const list = await TodoModel.find(queryObj);
            return list
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async getAll() {
        try {
            const list = await TodoModel.find({});
            return list
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async remove(id) {
        try {
            const updated = await TodoModel.findByIdAndDelete(id);
            return updated
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

}

module.exports = TodoRepository