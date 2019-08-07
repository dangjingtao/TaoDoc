import Directory from '../mongodb/directory';
import Document from '../mongodb/document';
import {checkRequired, setResponseData, saveDate, hasData, removeById, removeMany,updateById} from '../utils/utils';
import {SUCCESS_CODE, SUCCESS_MSG, ERROR_CODE, ERROR_MSG} from '../utils/constant';

// 创建文件夹
export const queryCms= async (ctx, next) => {
    const type=4;
    const pageNum = 1
    const pageSize = 1000;
    const total = await await Directory.countDocuments({type});

    const list = await Directory.find({type})

    for(let i=0;i<list.length;i++){
        let blogs= await Document.find({directoryId:list[i].id});
        list[i].blogs=blogs;
    }

    //     // .skip((pageNum - 1) * pageSize)
    //     // .limit(pageSize)
    //     // .sort('-createAt');
    // console.log(_list)
    ctx.body = setResponseData(SUCCESS_CODE, SUCCESS_MSG, list, {
        total,
        pageSize,
        pageNum
    });
}