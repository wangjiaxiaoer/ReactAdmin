/**
 * 格式化时间
 */

export function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    let month,day,hours,minutes,seconds
    if (date.getMonth() < 9) {
        month = '0'+ (date.getMonth()+1)
    }else{
        month = date.getMonth() + 1;
    }
    if (date.getDate() < 9) {
        day = '0'+ (date.getDate())
    }else{
        day = (date.getDate()+1)
    }
    if (date.getHours() < 9) {
        hours = '0'+ (date.getHours())
    }else{
        hours = (date.getHours())
    }
    if (date.getMinutes() < 9) {
        minutes = '0'+ (date.getMinutes())
    }else{
        minutes = (date.getMinutes())
    }
    if (date.getSeconds() < 9) {
        seconds = '0'+ (date.getSeconds())
    }else{
        seconds = (date.getSeconds())
    }
    return date.getFullYear() + '-' + (month) + '-' + (day) + ' ' + hours + ':' + minutes + ':' + seconds;    
}