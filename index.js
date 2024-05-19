import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const port = 4000;

const _dirname = path.resolve();
const uploadFolder = path.join(_dirname,"uploads");
fs.mkdirSync(uploadFolder,{recursive:true})

const app = express();
app.use(express.static(uploadFolder))

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

app.get("/",(req,res)=>{
    res.json({hostname:req.headers.host,route:req.url}    )
})


app.get("/api",(req,res)=>{
    console.log(uploadFolder)
    let pictures = fs.readdirSync(uploadFolder);
    let picturesPath = [];
    for(let picture of pictures) picturesPath.push(req.headers.host+"/"+picture)
    res.status(200).json({picturesPath});
})

app.post("/api/upload",upload.single("picture"),(req,res)=>{
    res.status(201).json({
        status:"success",
        message:"file upload successfully",
        path:req.headers.host+"/"+req.file.path.split("/")[1]
    })
})



app.listen(port,()=>{
    console.log(`Server is started at port ${port}`)
})