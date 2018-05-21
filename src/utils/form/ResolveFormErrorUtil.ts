/*
 * 解析表单验证失败的错误
 */

interface FormError {

    readonly [key: string]: {
        readonly   errors: Array<{
            readonly field: string,
            readonly message: string
        }>
    }
}

export function resolveFormErrorMessage(error: FormError): string {

    const key = Object.keys(error)[0];
    return error[key].errors[0].message
}
