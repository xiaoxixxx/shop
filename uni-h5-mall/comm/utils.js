/**  
 * 防抖函数  
 * @param func 需要防抖的函数  
 * @param limit 时间间隔，单位毫秒  
 * @returns {Function}  
 */  
export  function debounce(func, wait, immediate) {  
    let timeout;  
  
    return function() {  
        const context = this, args = arguments;  
  
        const later = function() {  
            timeout = null;  
            if (!immediate) func.apply(context, args);  
        };  
  
        const callNow = immediate && !timeout;  
  
        clearTimeout(timeout);  
        timeout = setTimeout(later, wait);  
  
        if (callNow) func.apply(context, args);  
    };  
}



/**  
 * 节流函数  
 * @param func 需要节流的函数  
 * @param limit 时间间隔，单位毫秒  
 * @returns {Function}  
 */  
export function throttle(func, limit) {  
    let inThrottle;  
  
    return function() {  
        const args = arguments;  
        const context = this;  
  
        if (!inThrottle) {  
            func.apply(context, args);  
            inThrottle = true;  
            setTimeout(() => {  
                inThrottle = false;  
            }, limit);  
        }  
    };  
}