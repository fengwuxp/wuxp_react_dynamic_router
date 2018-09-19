import EXIF from "exif-js/exif";
import {MegaPixImage} from "./MegapixImage";
import {IS_ANDROID} from "../BrowserUtils";
import {JPEGEncoder} from "./jpegEncoderBasic";
import {isFunction} from "util";
import {IMAGE_TYPE_JPEG} from "./Const";

const encoder = new JPEGEncoder();

/**
 * 修复图片
 *
 * 使用exif-js处理ios等使用base64上传图片时出现角度转换的问题
 * git: https://github.com/exif-js/exif-js
 *
 * @author wxup
 * @create 2018-09-18 18:43
 * @param data
 * @param quality 默认为0.4

 * @return Promise<string>
 **/
export async function fixImage(data: HTMLImageElement | string, quality = 0.4): Promise<string> {

    const img = await convertImage(data);

    const canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;

    const context = canvas.getContext('2d');

    return new Promise<string>((resolve, reject) => {

        if (IS_ANDROID) {
            //安卓则进行图片修复
            if (img.complete) {
                actionFn(resolve, encoder);
            } else {
                let oldLoad = img.onload;
                img.onload = function (event) {
                    if (isFunction(oldLoad)) {
                        oldLoad.apply(img, event as any);
                    }
                    actionFn(resolve, encoder);
                }
            }

            function actionFn(resolve, encoder) {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                //进行图片修复，压缩
                resolve(encoder.encode(canvas.getContext('2d').getImageData(0, 0, img.width, img.height), quality * 100));
            }


        } else {
            // console.log("ios修复图片角度")
            EXIF.getData(img as any, function () {
                //图片方向角
                EXIF.getAllTags(this);
                let orientation = EXIF.getTag(this, 'Orientation');

                let mpImg = new MegaPixImage(img);
                // console.log("img",img.width,img.height,quality);
                //将图片render到canvas中
                mpImg.render(canvas, {
                    maxWidth: img.width,
                    maxHeight: img.height,
                    quality,
                    orientation: orientation
                });
                let base64 = canvas.toDataURL(IMAGE_TYPE_JPEG, quality,);
                // console.log(base64);
                resolve(base64);
            });
        }

    })

}


async function convertImage(data: HTMLImageElement | string): Promise<HTMLImageElement> {
    let image: HTMLImageElement;
    if (typeof data === "string") {
        image = new Image();
        image.src = data;
    } else {
        image = data;
    }

    if (!image.complete) {
        //等待图片加载完成
        image = await new Promise<HTMLImageElement>((resolve, reject) => {
            let oldLoad = image.onload;
            image.onload = function (event) {
                if (isFunction(oldLoad)) {
                    oldLoad.apply(image, event as any);
                }
                resolve(image)
            };
        });

    }
    return image
}

/**
 * 旋转图片角度并压缩图片
 * @param data
 * @param quality 压缩比例 0-1
 */
// export async function rotateAndCompressImage(data: HTMLImageElement | string, quality: number): Promise<string> {
//
//     let image;
//     if (typeof data === "string") {
//         image = new Image();
//         image.src = data;
//     } else {
//         image = data;
//     }
//
//     if (image.complete) {
//         return await _rotateAndCompressImage(image, quality);
//     } else {
//         //等待图片加载完成
//         image = await new Promise((resolve, reject) => {
//             let oldLoad = image.onload;
//             image.onload = function (event) {
//                 if (isFunction(oldLoad)) {
//                     oldLoad.apply(image, event as any);
//                 }
//                 resolve(image)
//             };
//         });
//
//         return await _rotateAndCompressImage(image, quality);
//     }
//
// }
//
// function _rotateAndCompressImage(image: HTMLImageElement, quality: number): Promise<string> {
//
//     let canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
//
//
//     return new Promise<string>((resolve, reject) => {
//         //旋转图片操作
//         EXIF.getData(image as any, function () {
//
//                 let orientation = EXIF.getTag(this, 'Orientation');
//                 console.log('orientation:' + orientation);
//                 let mpImg = new MegaPixImage(image);
//                 // console.log("img",img.width,img.height,quality);
//                 //将图片render到canvas中
//                 mpImg.render(canvas, {
//                     maxWidth: image.width,
//                     maxHeight: image.height,
//                     quality: 1,
//                     orientation: orientation
//                 }, function () {
//                     let base64 = canvas.toDataURL(IMAGE_TYPE_JPEG, quality);
//                     resolve(base64)
//                 });
//
//             }
//         );
//     })
//
// }


/**
 * 压缩图片
 * @param image
 * @param quality 图片质量  范围：0<quality<=1 根据实际需求调正
 * @return string
 */
// export function compressImage(image: HTMLImageElement, quality: number): string {
//
//     let canvas = document.createElement('canvas');
//     let ctx = canvas.getContext('2d');
//
//     let imageLength = image.src.length;
//     let width = image.width;
//     let height = image.height;
//
//     canvas.width = width;
//     canvas.height = height;
//
//     ctx.drawImage(image, 0, 0, width, height);
//
//     //压缩操作
//     let imageData = canvas.toDataURL(IMAGE_TYPE_JPEG, quality);
//
//     console.log("压缩前：" + imageLength);
//     console.log("压缩后：" + imageData.length);
//     console.log("压缩率：" + ~~(100 * (imageLength - imageData.length) / imageLength) + "%");
//     return imageData;
// }
