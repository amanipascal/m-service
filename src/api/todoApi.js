const { TodoService } = require('../services')
const { API_PREFIX } = require('../config')

module.exports = (app) => {

    const service = new TodoService()

    app.post(`${API_PREFIX}/todo`, async (req, res, next) => {
        try {
            const { data } =  await service.Create({ ...req.body });
            return res.json(data);
            
        } catch (err) {
            console.log(err)
            next(err)    
        }
    })

    app.get(`${API_PREFIX}/todo/:id`, async (req, res, next) => {
        try {
            const id = req.params.id;
            const { data } =  await service.GetOne(id);
            return res.json(data);
            
        } catch (err) {
            next(err)    
        }
    })

    app.get(`${API_PREFIX}/todos`, async (req, res, next) => {
        try {
            const { data } =  await service.GetAll();
            return res.json(data);
            
        } catch (err) {
            console.log(err)
            next(err)    
        }
    })

    app.put(`${API_PREFIX}/todo/:id`, async (req, res, next) => {
        try {
            const id = req.params.id;
            const payload = req.body;
            const { data } =  await service.Update(payload, id);
            return res.json(data);
        } catch (err) {
            next(err)    
        }
    })

    app.delete(`${API_PREFIX}/todo/:id`, async (req, res, next) => {
        try {
            const id = req.params.id;
            const { data } =  await service.remove(id);
            return res.json(data);
        } catch (err) {
            next(err)    
        }
    })


}