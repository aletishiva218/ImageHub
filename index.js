import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const port = 4000;

const app = express();

const upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            return cb(null,"uploads");
        },
        filename:(req,file,cb)=>{
            return cb(null,file.originalname.split(".")[0]+"-"+Date.now()+path.extname(file.originalname))
        }
    })
})

app.post("/api/upload",upload.single("picture"),(req,res)=>{
    console.log("req.file: ",req.file.path);
    res.status(201).json({
        status:"success",
        message:"file upload successfully"
    })
})

const _dirname = path.resolve();
const uploadFolder = path.join(_dirname,"uploads");


app.get("/api",(req,res)=>{
    console.log(uploadFolder)
    let pictures = fs.readdirSync(uploadFolder);
    let picturesPath = [];
    for(let picture of pictures) picturesPath.push(path.join(uploadFolder,picture))
    res.status(200).json({picturesPath});
})

app.listen(port,()=>{
    console.log(`Server is started at port ${port}`)
})