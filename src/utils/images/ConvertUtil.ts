/**
 *
 * @author wxup
 * @create 2018-09-18 21:03
 **/


/**
 * DataURL转Blob对象
 * @param dataURL
 */
export function dataURLToBlob(dataURL: string): Blob {
    let arr = dataURL.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}


/**
 * Blob转canvas
 * @param data
 */
export function blobToCanvas(data: Blob): Promise<HTMLCanvasElement> {

    return fileOrBlobToDataURL(data).then(dataURLToCanvas);
}

/**
 * File/Blob对象转DataURL
 * @param data
 */
export function fileOrBlobToDataURL(data: File | Blob): Promise<string> {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(data);
    return new Promise<string>((resolve, reject) => {
        fileReader.onload = function (e: any) {
            resolve(e.target.result);
        };
        fileReader.onerror = function (ev: ProgressEvent) {
            reject(ev)
        }
    })
}

/**
 * DataURL转canvas
 * @param dataURL
 */
export function dataURLToCanvas(dataURL: string): Promise<HTMLCanvasElement> {

    const canvas: HTMLCanvasElement = document.createElement('CANVAS') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    return new Promise<HTMLCanvasElement>((resolve, reject) => {

        const img = new Image();

        img.onload = function (ev: ErrorEvent) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        };
        img.onerror = function (ev: ErrorEvent) {
            reject(ev);
        };
        img.src = dataURL;
    })

}
