/**
 * 音乐文件管理
 */

import mongoose from '../utils/mongoose'

const fileSchema = new mongoose.Schema({
    type :String , // 保留字段，文件分类
    title :String , // 文件名称
    size:Number , // 保留字段，文件大小
    resource_url :String , // 文件在项目服务器的存储路径
    cover_url :String , // 封面文件在项目服务器的存储路径
    lrc :String , // 文件在项目服务器的存储路径
    singer:String,//歌手
    createAt: { // 上传时间
        type: Date,
        default: Date.now()
    },
})


export default mongoose.model("Audio", fileSchema)