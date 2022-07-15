const jwt = require('jsonwebtoken')
const JWT_TOKEN = "Thisisbetter&farbetterthen&me";
const fetchuser = (req,res,next)=>{
    //get the user from the jwt token
    const token = req.header('auth-token')
    if(!token){
        res.status(401).sned({error : "Please Authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_TOKEN);
    req.user = data.user;
    next();
    } catch (error) {
        res.status(401).sned({error : "Please Authenticate using a valid token"})
    }
}

module.exports = fetchuser;