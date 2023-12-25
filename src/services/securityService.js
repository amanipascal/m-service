const { FormateData } = require("../utils/utilitaires");
const { APIError } = require('../utils/app-errors');
const userService = require('./userService')
const { TmpUserModel, TokenModel } = require('../database/model')
const smsSender = require('../utils/sms/sendSMS');
const mailSender = require('../utils/email/sendEmail');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {genOtp } = require('../utils')
const expiresIn = process.env.TOKEN_EXPIRES_IN;

// All Business logic will be here
class SecurityService {

    constructor() {
        this.user = new userService();
    }

   
register = async (userData) => {

    const {email} = userData;

    const existingUser = await this.user.GetOneByEmail(email)

    if (existingUser) {
      return { status: 422, message: `Ce compte est déjà existant et actif`,  data:null } 
    }
  
    let tmpUser = await TmpUserModel.findOne({ email });
  
    if (tmpUser) {
      return {
        status: 422, 
        message: `Un processus de creation de compte est déjà en cours pour cet eMail ${email}. Veuillez patienter 10mn pour reprendre si nécéssaire. merci `,
        data: null
       }
    }
  
    try {
      const tmpUser = new TmpUserModel({ ...userData });
      const user = await tmpUser.save();
      const link = `${process.env.CLIENT_URL}/activation?token=${user.token}&id=${user._id}`;
      const payload = {name: user.name, otp: user.otp, link}
      let emailOrSmsResult;
      if (user.user_type == "WEB") {
          emailOrSmsResult = await this.sendVerificationEmail(user.email, "vérification et activation de compte", payload,  "./template/emailVerification.handlebars" )
      } else if (user.user_type == "MOBILE") {
          const smsPayload = {userid: user._id, phone_number: user.phone_number, sms_msg: `Ceci est votre code otp d\'activation: ${user.otp} `}
          emailOrSmsResult = await this.smsService(smsPayload)
      } 
      
      const {__v, is_active, is_verified, is_admin, otp, createdAt, token, password, ...rest} = user.toJSON()
      return { status: emailOrSmsResult.status, message: emailOrSmsResult.message, data: rest}
    
    } catch (error) {
      return {status: 422, message: error.message,  data:  null }
    }
  
  };

sendVerificationEmail = async (email, subject, payload, template)  => {
try {
    await mailSender(email, subject, { ...payload }, template );
    return { status:200, 
    message: `Un message d'activation à été envoyé à votre email ${email} cliquez sur lien ou utiliser le code OTP pour activer votre compte. merci`,
    data: null
    }
} catch (error) {
    return { status: 401, massage: error.message,  data: null }
}
}


smsService = async (payload) => {
    const {phone_number, sms_msg} = payload
    const data = await smsSender(phone_number, sms_msg)
        return {
        status: 200,
        message: data.message,
        data: null
    }
}


tokenBaseActivation = async (payload) => {
    const { token, userId } = payload;
     const user = await TmpUserModel.findOne({ _id: userId });
     if (!user) {
         return { status: 401, message: "Votre token d'activation a expiré", data: null  }
     }
 
     if (user && user.token !== token) {
         return { status: 401, message: "Votre token est invalide", data: null }
     }

     try {
         const {__v, otp, createdAt, token, ...rest} = user.toJSON()
         const newUser = await this.user.Create({...rest, is_active: true})
         return { status: 200, massage: "Votre compte est activé",  data: newUser }
         
     } catch (error) {
         return { status: 401, massage: error.message,  data: null }
     }
 
 }  


otpBaseActivation = async (payload) =>{
    const { email, otp: incomingOtp } = payload;
     const user = await TmpUserModel.findOne({email});
     if (!user) {
         return { status: 401, message: "Votre code d'activation a expiré", data:null  }
     }
     if (user && user.otp !== incomingOtp) {
         return { status: 401, message: "Code otp est invalide", data: null }
     }
     try {
         const {__v, otp, createdAt, token, ...rest} = user.toJSON()
         const newUser = await this.user.Create({...rest, is_active: true})
         return { status: 200, massage: "Votre compte est activé",  data: newUser }
     } catch (error) {
         return { status: 401, massage: error.message,  data: null }
     }
 
 }  

tokenRefreshService = async (refreshToken) => {
     const secretKey = process.env.JWT_SECRET;
     if (!refreshToken) {
       return {status: 401, message: 'Access refusé. pas de refresh fourni.', data: null }
     }
     try {
       const decoded = jwt.verify(refreshToken, secretKey);
       const accessToken = jwt.sign({userId: decoded.userId }, secretKey, { expiresIn });
       return {status: 200, message: "Token généré avec success.", data: accessToken}
     } catch (error) {
       return {status: 400, message: 'refresh token Invalide.',  data:  null }
     }
}

// password forgotten
resetPwdRequest = async (email) => {

    const userDoc = await this.user.GetOneByEmail(email)

    if (!userDoc) {
        return {status: 400, message: 'Email inconnu.',  data:  null }
    }

    const tokenDoc = await TokenModel.findOne({ userId: userDoc._id });
    if (tokenDoc) await TokenModel.deleteOne();
    
    let emailOrSmsResult;
    if (userDoc.user_type == "WEB") {
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));
        await new TokenModel({ userId: userDoc._id, token: hash, createdAt: Date.now(), }).save();
        const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${userDoc._id}`;
        const payload = {name: userDoc.name, link}
        emailOrSmsResult = await this.sendVerificationEmail(email, "Réinitialisation du mot de passe", payload,  "./template/requestResetPassword.handlebars" )
        return emailOrSmsResult;
    } else if (user.user_type == "MOBILE") {
        const otp = await genOtp()
        const otpHashed = await bcrypt.hash(otp, Number(process.env.BCRYPT_SALT));
        const newToken = await new TokenModel({ userId: userDoc._id, token: otpHashed, createdAt: Date.now(), }).save();
        const smsPayload = {userid: newToken.userId, phone_number: userDoc.phone_number, sms_msg: `Ceci est votre code otp d\'activation: ${otp} `}
        emailOrSmsResult = await this.smsService(smsPayload)
        return emailOrSmsResult;
    } 
    
};


resetPassword = async (body) => {

    const {userId, token, password} = body;

    // const existingUser = await UserModel.findOne({ _id: userId });
    const existingUser = await this.user.GetOneById(userId);
  
    if (!existingUser) {
      return {status: 400, message: 'Email inconnu',  data:  null }
    } 
    let passwordResetToken = await TokenModel.findOne({ userId: existingUser._id });

    if (!passwordResetToken) {
      return {status: 401, message: 'Token ou OTP expiré',  data:  null }
    }

    let emailOrSmsResult;
    if (existingUser.user_type == "WEB") {
        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
          return {status: 401, message: 'token invalid ou expiré',  data:  null }
        }
        const updatedUser = await this.user.Update({password}, userId);
        const payload = {name: updatedUser.name}
        emailOrSmsResult = await this.sendVerificationEmail(updatedUser.email, "Password Reset Successfully", payload,  "./template/resetPassword.handlebars" )
        return emailOrSmsResult;
    } else if (existingUser.user_type == "MOBILE") {
      const isValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isValid) {
        return {status: 401, message: "OTP invalid ou expiré",  data:  null }
      }

      const smsPayload = {userid: existingUser._id, phone_number: existingUser.phone_number, sms_msg: `Votre mot de passe a été re-initialisé avec success. `}
      emailOrSmsResult = await this.smsService(smsPayload)
      return emailOrSmsResult;

    }
  
};


changePassword = async (payload) => {
    const secretKey = process.env.JWT_SECRET;
    const {oldPassword, newPassword, accessToken} = payload;
  
    // try {
      let decoded;
      try {
        decoded = jwt.verify(accessToken, secretKey);
        
      } catch (error) {
          return {status: 400, message: 'token invalide', data: null }
      } 
      
      const {userId} = decoded;
      const user = await this.user.GetOneById(userId)
      if (!user) {
        return { status: 401, message: "Compte utilisateur introuvable ", data:null }
      }
      //check if password matches
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) { 
          return { status: 401, message: "Ancien mot de pase invalide", data: null } 
      }
  
      try {
        const newPassword_crypte = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT));
        await this.user.Update({password: newPassword_crypte}, user.id)
        return {status: 200, message: 'Password modifié avec success !', data: null }
      } catch (error) {
        return {status: 500, message: `Server error : ${error.message}`, data: null }
      }
    
  
}


login = async (credentials) => {
    const SECRET = process.env.JWT_SECRET;
  
    const {email, password} = credentials;

    try {
         // check if the user already exists
       const user = await this.user.GetOneByEmail(email)
      //  console.log('user : ', user)
       if(!user) {
        return {status: 401,  message: "Invalid credentials, unknown user",  data: null   }
       }
       //check if password matches
       const isPasswordValid = await bcrypt.compare(password, user.password);
      //  console.log('isPasswordValid : ', isPasswordValid)
       if (!isPasswordValid) {
           return { status: 401, message: "Invalid credentials, password invalid ",  data:null }
       }
       //generate access token
       const accessToken = jwt.sign({userId: user._id}, SECRET, {expiresIn});
       //generate access token
       const refreshToken = jwt.sign({userId: user._id}, SECRET, {expiresIn: '7d'});

       return {status: 200,  message: 'vous êtes connectés', data: {accessToken, refreshToken}  }
        
    } catch (error) {
        return { status:500, message: 'Server error', data: null }
    }
  
}
  
  



     
}

module.exports = SecurityService;