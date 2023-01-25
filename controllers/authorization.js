const jwt = require("jsonwebtoken");

const authZtin = async(req,res,next)=>{
    try {
        const authToken = req.header.authorization;
        if(!authToken){
            res.status(400).json({
                message: "Not authorized"
            })
        }else{
            const token = authToken.split(" ")[1];
            if(token){
                await jwt.verify(token, process.env.JWT_SECRET, (err,payLoad)=>{
                    if(err){
                        res.status(400).json({
                            message: err.message
                        })
                    }else{
                        res.user = payLoad
                        next()
                    }
                })
            }else{
                res.status(400)
            }

        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

module.exports = authZtin;