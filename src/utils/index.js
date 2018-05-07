/*
包含n个工具函数的模块
 */
/*
注册Boss--> /Bossinfo
注册JobSeeker--> /JobSeekeinfo
登陆Boss --> /Bossinfo 或者 /Boss
登陆JobSeeker --> /JobSeekeinfo 或者 /JobSeeke
 */
export function getRedirectTo(type, header) {
    let path = '';
    if(type === 'Boss') {
        path = '/boss'
    } else {
        path = '/jobseeker'
    }
    if(!header) {
        path += 'info'
    }
    return path
}