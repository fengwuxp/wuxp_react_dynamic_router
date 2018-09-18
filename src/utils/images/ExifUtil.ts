import EXIF from "exif-js/exif";
import {MegaPixImage} from "./MegapixImage";

/**
 * 处理ios等使用base64上传图片是出现角度转换的问题
 * @author wxup
 * @create 2018-09-18 18:43
 * @param img
 * @param quality
 * @return Promise<string>
 **/
export function guaranteedAngle(img: HTMLImageElement, quality: number): Promise<string> {

    const canvas: HTMLCanvasElement = document.createElement('CANVAS') as HTMLCanvasElement;

    return new Promise<string>((resolve, reject) => {
        EXIF.getData(img.src, function () {
            //图片方向角
            EXIF.getAllTags(this);
            let orientation = EXIF.getTag(this, 'Orientation');

            let mpImg = new MegaPixImage(img);
            // console.log("img",img.width,img.height,quality);
            mpImg.render(canvas, {
                maxWidth: img.width,
                maxHeight: img.height,
                quality: quality || 0.4,
                orientation: orientation
            });
            let base64 = canvas.toDataURL("", quality || 0.4);
            resolve(base64);
        });
    })

}
