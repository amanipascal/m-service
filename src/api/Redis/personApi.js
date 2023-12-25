const {  RedisPersonService } = require('../../services')
const { API_PREFIX } = require('../../config')

module.exports = (app) => {

    const service = new RedisPersonService()

    app.post(`${API_PREFIX}/redis/person`, async (req, res) => {
        const result = await service.Create(req.body)
        console.log('result: ', result)
        res.status(result.status).json(result.data)
    })

    app.get(`${API_PREFIX}/redis/person/:id`, async (req, res) => {
        const result = await service.GetOne(req.params.id)
        res.status(result.status).json(result.data)
    })

    app.get(`${API_PREFIX}/redis/persons`, async (req, res) => {
        const result = await service.GetAll()
        res.status(result.status).json(result.data)
    })

    app.put(`${API_PREFIX}/redis/person/:id`, async (req, res) => {
        const result = await service.Update(req.body, req.params.id)
        res.status(result.status).json(result.data)
    })

    app.delete(`${API_PREFIX}/redis/person/:id`, async (req, res) => {
        const result = await service.remove(req.params.id)
        res.status(result.status).json(result.data)
    })


}