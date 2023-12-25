const { SecurityService } = require('../services')
const { API_PREFIX } = require('../config')
const { validationResult } = require('express-validator')
const authenticate = require('../middlewares/authenticate')
const jwt = require('jsonwebtoken')

module.exports = (app) => {

    const service = new SecurityService()

    // app.post(`${API_PREFIX}/auth/login`, async (req, res) => {})
    app.post(`${API_PREFIX}/auth/login`, async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const result = await service.login(req.body);
        if (result.data) {
            const {accessToken, refreshToken} = result.data;
            return res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }).header('Authorization', accessToken)
            .json({message: result.message, data: result.data});
        }
        return res.status(result.status).json({message: result.message})

    })

    app.post(`${API_PREFIX}/auth/register`, async (req, res) => {
        const {email, name, password, phone_number, user_type} = req.body;
        const result = service.register({email, name, password, phone_number, user_type})
        return res.status((await result).status).json({message: (await result).message, data: (await result).data});
    })

    app.post(`${API_PREFIX}/auth/otpActivation`, async (req, res) => {
        const {otp, email } = req.body
        const result = await service.otpBaseActivation({otp, email });
        return res.status(result.status).json({message: result.message, data: result.data});
    })

    app.post(`${API_PREFIX}/auth/tokenActivation`, async (req, res) => {
        const {token, userId } = req.body
        const result = await service.tokenBaseActivation({token, userId });
        return res.status(result.status).json({message: result.message, data: result.data});
    })

    app.post(`${API_PREFIX}/auth/changePassword`, async (req, res) => {
        const accessToken = req.headers['authorization'];
        const {oldPassword, newPassword} = req.body;
        if (!oldPassword) {  return res.status(400).json({error: 'Invalid old password.'}) }
        if (!newPassword) {  return res.status(400).json({error: 'Invalid new password.'}) }
        if (!accessToken) { return res.status(400).json({error: 'token is not defined'})  }
        const result = await service.changePassword({oldPassword, newPassword, accessToken});
        return res.status(result.status).json({message: result.message, data: result.data})
    })

    app.post(`${API_PREFIX}/auth/resetPasswordRequest`, async (req, res) => {
        const {email} = req.body
        const result = await service.resetPwdRequest(email);
        return res.status(result.status).json({message: result.message, data: result.data});
    })

    app.post(`${API_PREFIX}/auth/resetPassword`, async (req, res) => {
        const result = await service.resetPassword(req.body);
        return res.status(result.status).json({message: result.message, data: result.data});
    })

    app.post(`${API_PREFIX}/auth/refreshtoken`, async (req, res) => {
        const refreshToken = req.cookies['refreshToken'];
        const result = await service.tokenRefreshService(refreshToken) 
        return res.status(result.status).header('Authorization', result.data).send({accessToken: result.data})
    })

    app.post(`${API_PREFIX}/auth/logout`, authenticate, async (req, res) => {
        const SECRET = 'qqefkuhio3k2rjkofn2mbikbkwjhnkk'
        const accessToken = jwt.sign({userId: req.user}, SECRET, {expiresIn: 1});
        const refreshToken = jwt.sign({userId: req.user}, SECRET, {expiresIn: 1});
        return res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }).header('Authorization', "")
            .json({message: 'vous êtes déconnectés', data: {accessToken, refreshToken} });
    

    })

    app.get(`${API_PREFIX}/users/me`, authenticate, async (req, res) => {

        try {
            const user = await UserModel.findById(req.user)
            if(!user){
                return res.status(404).json({message: 'Utilisateur inconnu'});
            }
            const {__v, is_active, is_verified, is_admin, createdAt, updatedAt, password, ...rest} = user.toJSON()
            res.status(200).json(rest);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    })



}