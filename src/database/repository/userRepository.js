const { UserModel } = require('../model')


class UserRepository {

    async create(data) {
        try {
            const instance = new UserModel(data);
            const created = await instance.save()
            return created
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async update(data, id) {
        try {
    
            // const updated = await TodoModel.findByIdAndUpdate(id, {...data});
            await UserModel.findByIdAndUpdate(id, {...data});
            const updated = await UserModel.findById(id);
            return updated
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async getOneById(id) {
        try {
            const item = await UserModel.findById(id);
            return item;
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async getOneByEmail(email) {
        try {
            const item = await UserModel.findOne({email});
            return item;
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async getMany(queryObj) {
        try {
            const list = await UserModel.find(queryObj);
            return list
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async getAll() {
        try {
            const list = await UserModel.find({});

            return list
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

    async remove(id) {
        try {
            const updated = await UserModel.findByIdAndDelete(id);
            return updated
        } catch (error) {
            console.log('Error  : ', error)
        }
    }

}

module.exports = UserRepository