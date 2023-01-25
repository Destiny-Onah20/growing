const modelName = require("../models").admin;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const v = require("fastest-validator")

const signUp = async(req,res)=>{
    try {
        const {name, email, password } = req.body;
        const checkEmail = await modelName.findOne({
            where: {email: email}
        })
        if(checkEmail){
            res.status(400).json({
                message: "Email already exist.."
            })
        }else{
            const saltPasswrd = await bcrypt.genSalt(5);
            const hassPasswrd = await bcrypt.hash(password, saltPasswrd);
            const genToken = await jwt.sign({
                name,
                email,
                password
            }, process.env.JWT_SECRET,{expiresIn: "1h"})
            const adminCreate = {
                name,
                email,
                password: hassPasswrd,
                token: genToken
            };
            const schema = {
                name: {type: "string", optional: false},
                email: {type: "email", optional: false},
                password: {type: "string", optional: false},
                token: {type: "string", optional: false},
            };
            const valid = new v();
            const validator = valid.validate(adminCreate, schema);
            if(validator === true){
                const created = await modelName.create(adminCreate);
                res.status(200).json({
                    data: created
                })
            }else{
                res.status(400).json({
                    message: validator[0].message
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

const logIn = async(req,res)=>{
    try {
        const { email, password} = req.body;
        const checkEmail = await modelName.findOne({
            where: {email: email}
        })
        if(!checkEmail){
            res.status(400).json({
                message: "Email does not exist.."
            })
        }else{
            const checkPasswrd = await bcrypt.compare(password, checkEmail.password);
            if(!checkPasswrd){
                res.status(400).json({
                    message: "Email or password is not correct.."
                })
            }else{
                const genToken = await jwt.sign({
                    email,
                    password
                }, process.env.JWT_SECRET,{expiresIn: "1h"})
                checkEmail.token = genToken;
                await checkEmail.save();
                res.status(200).json({
                    data: checkEmail
                })
            }
        } 
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

const updateAdmin = async(req,res)=>{
    try {
        let id = req.params.id;
        const {name, email, password} = req.body;
        const saltPasswrd = await bcrypt.genSalt(5);
            const hassPasswrd = await bcrypt.hash(password, saltPasswrd);
            const adminUpdate = {
                name,
                email,
                password: hassPasswrd,
            };
            const schema = {
                name: {type: "string", optional: false},
                email: {type: "email", optional: true},
                password: {type: "string", optional: true},
            };
            const valid = new v();
            const validator = valid.validate(adminUpdate, schema);
            if(validator === true){
                const updated = await modelName.update(adminUpdate, {where:{id:id}});
                res.status(200).json({
                    data: updated
                })
            }else{
                res.status(400).json({
                    message: validator[0].message
                })
            }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};


module.exports = {
    signUp,
    logIn,
    updateAdmin
}