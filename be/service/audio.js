import Audios from '../mongodb/audios';
import { checkRequired, setResponseData, saveDate, hasData, removeById, removeMany, updateById } from '../utils/utils';
import { SUCCESS_CODE, SUCCESS_MSG, ERROR_CODE, ERROR_MSG } from '../utils/constant';

import fs from 'fs';
import fse from 'fs-extra'
import unzip from 'node-unzip-2';
// import path from 'path';
var readline = require('readline');
var os = require('os');
import {mkdir, rmdir, readdir, unzipFile,rm,readFiles} from '../utils/fs'
import mongoose from '../utils/mongoose';

// 上传zip文件
export const uploadAudio = async (ctx, next) => {
    // 获取上传文件
    let file = ctx.req.file; 
  
    // 解压地址
    const _root = `audios/${new Date().getTime()}`;

    // 流操作完毕后
    const unzipRes = await unzipFile(file.path, _root);

    if(unzipRes.success){
        // 删除解压包
        await rm(file.path);
        let root = `${_root}/${file.originalname.split('.')[0]}`;

        var pa =await readFiles(root);
        console.log('pa',pa)
        // 需要存进数据库的信息：
        let body={
            title:file.originalname.split('.')[0].split('-')[1],
            like:0,
            dislike:0,
            singer:file.originalname.split('.')[0].split('-')[0],
        }
        
        // 循环遍历当前的文件以及文件夹
        for (let i = 0; i < pa.length; i++) {
            let ele = pa[i];
            let url = root + "/" + ele;
            var info = fs.statSync(url);
            
            if (!info.isDirectory()) {     
                let format = ele.split('.')[1];
                
                switch (format) {
                    case 'mp3':
                        // console.log('mp3', url)
                        body.resource_url=url;
                        break;
                    case 'png'||'jpg'|'jpeg':
                        console.log('img', url)
                        body.cover_url=url;
                        break;
                    case 'txt':
                        console.log('txt', url);
                        // console.log(info);
                        let data = fs.readFileSync(url,'utf-8');
                        body.lrc=data;
                    default:
                        break;
                }
            } 
        }

        await new Audios(body).save();
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    }else{
       
        ctx.body = setResponseData(ERROR_CODE, '解压失败');
    }
}

// 查询列表
export const getAudioList=async (ctx,next)=>{
    const list = await Audios.find().sort('-createAt');
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, {data:list});    
}


// 删除单条歌曲
export const removeAudio=async (ctx,next)=>{
    const {id}=ctx.request.body;
    const audio=await Audios.find({_id:id});
    const path=audio[0].resource_url.split('/')[0]+'/'+audio[0].resource_url.split('/')[1]

    const remove = await removeById(Audios, id);
    if (remove.success) {
        // 删除文件
        await rmdir(path);
        ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG);
    } else {
        ctx.body = setResponseData(ERROR_CODE, ERROR_MSG);
    }
}