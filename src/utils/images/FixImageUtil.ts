import EXIF from "exif-js/exif";
import {MegaPixImage} from "./MegapixImage";
import {IS_ANDROID} from "../BrowserUtils";
import {JPEGEncoder} from "./jpegEncoderBasic";
import {isFunction} from "util";

const encoder = new JPEGEncoder();

/**
 * 修复图片
 *
 * 使用exif-js处理ios等使用base64上传图片时出现角度转换的问题
 * git: https://github.com/exif-js/exif-js
 *
 * @author wxup
 * @create 2018-09-18 18:43
 * @param img
 * @param quality
 * @param imageType
 * @return Promise<string>
 **/
export function fixImage(img: HTMLImageElement, quality: number = 0.4, imageType: string = "image/jpeg",): Promise<string> {

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
                mpImg.render(canvas, {
                    maxWidth: img.width,
                    maxHeight: img.height,
                    quality,
                    orientation: orientation
                });
                let base64 = canvas.toDataURL(imageType, quality,);
                // console.log(base64);
                resolve(base64);
            });
        }

    })

}
