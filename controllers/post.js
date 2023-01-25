const modelName = require("../models").post;
const fs = require("fs")
const cloudinary = require("../helpers/cloudinary");

const bagPost = async(req,res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const createPost = {
            title: req.body.title,
            desc: req.body.desc,
            image: req.file.path,
            cloudUrl: result.secure_url,
            cloudId: result.public_id,
        };
        const created = await modelName.create(createPost);
        if(!created){
            res.status(400).json({
                message: "unable to create"
            })
        }
        res.status(201).json({
            message: "Successfully posted a bag",
            data: created
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
};

const allPost = async(req,res)=>{
    try {
        const all = await modelName.findAll();
        if(all.length === 0 ){
            res.status(404).json({
                message: "Database is currently empty"
            })
        }else{
            res.status(200).json({
                data: all
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        }) 
    }
};

const onePost = async(req,res)=>{
    try {
        const id = req.params.id;
        const single = await modelName.findAll({where:{id:id}});
        if(single.length === 1){
            res.status(200).json({
                message: "Heres the post..",
                data: single
            })
        }else{
            res.status(404).json({
                message: "Post with this id not found"
            })
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        }) 
    }
};

const updPost = async(req,res)=>{
    try {
        let id = req.params.id
        const result = await cloudinary.uploader.upload(req.file.path);
        const updatePost = {
            title: req.body.title,
            desc: req.body.desc,
            image: req.file.path,
            cloudUrl: result.secure_url,
            cloudId: result.public_id,
        };
        const updated = await modelName.update(updatePost, {where: {id:id}});
        if(updated === 1){
            res.status(201).json({
                message: "Successfully posted a bag",
                data: updated
            }) 
        }else{
            res.status(400).json({
                message: "Cannot update this post"
            })
        }
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        }) 
    } 
};

const delPost = async(req,res)=>{
    try {
        const id = req.params.id;
        const single = await modelName.findAll({where:{id:id}});
        await fs.unlinkSync(single[0].image);
        await cloudinary.uploader.destroy(single[0].image)
        const remove = await modelName.destroy({where: {id}})
        if(remove === 1){
            res.status(200).json({
                message: "Successfully deleted..."
            }) 
        }else{
            res.status(404).json({
                message: `No post with this id: ${id}`
            })
        }
        
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        }) 
    }
}

module.exports = {
    bagPost,
    allPost,
    onePost,
    updPost,
    delPost
}