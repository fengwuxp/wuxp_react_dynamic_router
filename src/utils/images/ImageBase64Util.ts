import {isFunction, isNullOrUndefined, isString} from "util";
import {IS_MOBILE} from "../BrowserUtils";
import {fixImage} from "./FixImageUtil";
import {dataURLToCanvas, fileOrBlobToDataURL} from "./ConvertUtil";


interface CompressionImageOptions {

    //压缩比例
    compression?: number,

    //目标大小
    targetSize?: number;

    //图片大小
    size?: number,


}

/**
 * 图片压缩
 * @param {string | Blob | File} data  图片数据
 * @param {CompressionImageOptions} options
 * @return {Promise<string>} 返回不带 data:image/jpg;base64, 前缀的base64编码的字符串
 */
export async function compressionImageToBase64(data: string | Blob | File | HTMLImageElement, options: CompressionImageOptions): Promise<string> {

    let {compression, targetSize, size} = options;

    if (isNullOrUndefined(compression)) {
        //计算压缩比例
        compression = compressionHelper(size, targetSize)
    }

    //图片 base64字符串数据
    let dataURL: string;
    if (isString(data)) {
        dataURL = data;
    } else if (data instanceof HTMLImageElement) {
        dataURL = data.src;
    } else {
        dataURL = await fileOrBlobToDataURL(data);
    }

    if (IS_MOBILE) {
        console.log("修复图片");
        //进行修复
        let img;
        if (data instanceof HTMLImageElement) {
            img = data;
        } else {
            img = new Image();
            // img.onload=function(){
            // }
            img.src = dataURL;
        }
        dataURL = await fixImage(img, compression);
    }


    //获取图片类型
    const array = dataURL.split(',');
    const type = array[0].match(/:(.*?);/)[1];

    return await new Promise<string>((resolve, reject) => {
        dataURLToCanvas(dataURL).then((canvas) => {
            let result: string;
            if (isFunction(canvas.toDataURL)) {
                console.log("图片压缩比例", compression);
                //支持 图片压缩
                result = canvas.toDataURL(type, compression);
            } else {
                //不支持图片压缩
                result = dataURL;
            }
            resolve(result)
        }).catch(reject);
    });

}


/**
 * 用于计算图片目标的压缩比例
 * @param imageSize  图片大小
 * @param targetSize 压缩的目标大小
 * @return compression ratio （压缩比例，范围为(0，1]，等于1是不处理）
 **/
function compressionHelper(imageSize, targetSize) {
    let compression = 1;

    if (targetSize > imageSize) {
        return compression;
    }

    let x = imageSize;

    while ((x = x / 1.1) > targetSize) {
        compression -= 0.05;
    }
    if (compression < 0.4) {
        return 0.4;
    }
    return compression;

}




