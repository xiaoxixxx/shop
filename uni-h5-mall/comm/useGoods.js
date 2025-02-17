
import dayjs from 'dayjs';
/**
 * 从商品 SKU 数组中，转换出商品属性的数组
 *
 * 类似结构：[{
 *    id: // 属性的编号
 *    name: // 属性的名字
 *    values: [{
 *      id: // 属性值的编号
 *      name: // 属性值的名字
 *    }]
 * }]
 *
 * @param skus 商品 SKU 数组
 */
export function convertProductPropertyList(skus) {
  let result = [];
  for (const sku of skus) {
    if (!sku.properties) {
      continue;
    }
    for (const property of sku.properties) {
      // ① 先处理属性
      let resultProperty = result.find((item) => item.id === property.propertyId);
      if (!resultProperty) {
        resultProperty = {
          id: property.propertyId,
          name: property.propertyName,
		 
          values: [],
        };
        result.push(resultProperty);
      }
      // ② 再处理属性值
      let resultValue = resultProperty.values.find((item) => item.id === property.valueId);
      if (!resultValue) {
        resultProperty.values.push({
          id: property.valueId,
          name: property.valueName,
			valueId: property.valueId,
        });
      }
    }
  }
  return result;
}
/**
 * 将分转成元
 *
 * @param price 分，例如说 100 分
 * @returns {string} 元，例如说 1.00 元
 */
export function fen2yuan(price) {
  return (price / 100.0).toFixed(2);
}


export function handleTree(data, id = 'id', parentId = 'parentId', children = 'children', rootId = 0) {
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData !== '' ? treeData : data;
}



/**
 * @description 格式化时间
 * @param {String|Number} dateTime 需要格式化的时间戳
 * @param {String} fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
 * @returns {string} 返回格式化后的字符串
 */
export function timeFormat(dateTime = null, formatStr = 'yyyy-mm-dd') {
  let date;
  // 若传入时间为假值，则取当前时间
  if (!dateTime) {
    date = new Date();
  }
  // 若为unix秒时间戳，则转为毫秒时间戳（逻辑有点奇怪，但不敢改，以保证历史兼容）
  else if (/^\d{10}$/.test(dateTime?.toString().trim())) {
    date = new Date(dateTime * 1000);
  }
  // 若用户传入字符串格式时间戳，new Date无法解析，需做兼容
  else if (typeof dateTime === 'string' && /^\d+$/.test(dateTime.trim())) {
    date = new Date(Number(dateTime));
  }
  // 其他都认为符合 RFC 2822 规范
  else {
    // 处理平台性差异，在Safari/Webkit中，new Date仅支持/作为分割符的字符串时间
    date = new Date(typeof dateTime === 'string' ? dateTime.replace(/-/g, '/') : dateTime);
  }

  const timeSource = {
    y: date.getFullYear().toString(), // 年
    m: (date.getMonth() + 1).toString().padStart(2, '0'), // 月
    d: date.getDate().toString().padStart(2, '0'), // 日
    h: date.getHours().toString().padStart(2, '0'), // 时
    M: date.getMinutes().toString().padStart(2, '0'), // 分
    s: date.getSeconds().toString().padStart(2, '0'), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };

  for (const key in timeSource) {
    const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
    if (ret) {
      // 年可能只需展示两位
      const beginIndex = key === 'y' && ret.length === 2 ? 2 : 0;
      formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
    }
  }

  return formatStr;
}



/**
 * 格式化订单状态的颜色
 *
 * @param order 订单
 * @return {string} 颜色的 class 名称
 */
export function formatOrderColor(order) {
  if (order.status === 0) {
    return 'info-color';
  }
  if (order.status === 10 || order.status === 20 || (order.status === 30 && !order.commentStatus)) {
    return 'warning-color';
  }
  if (order.status === 30 && order.commentStatus) {
    return 'success-color';
  }
  return 'danger-color';
}

/**
 * 格式化订单状态
 *
 * @param order 订单
 */
export function formatOrderStatus(order) {
  if (order.status === 0) {
    return 'obligation';
  }
  if (order.status === 10 && order.deliveryType === 1) {
    return 'Pending shipment';
  }
  if (order.status === 10 && order.deliveryType === 2) {
    return 'Pending verification';
  }
  if (order.status === 20) {
    return 'Pending receipt of goods';
  }
  if (order.status === 30 && !order.commentStatus) {
    return 'To be evaluated';
  }
  if (order.status === 30 && order.commentStatus) {
    return 'Completed';
  }
  return 'CLOSED';
}


export function isEmpty(value) {
  if (value === '' || value === undefined || value === null) {
    return true;
  }
  if (isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false
}
export function isArray(value) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 时间日期转换
 * @param {dayjs.ConfigType} date 当前时间，new Date() 格式
 * @param {string} format 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
 * @description format 季度："YYYY-mm-dd HH:MM:SS QQQQ"
 * @description format 星期："YYYY-mm-dd HH:MM:SS WWW"
 * @description format 几周："YYYY-mm-dd HH:MM:SS ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
 * @returns {string} 返回拼接后的时间字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  // 日期不存在，则返回空
  if (!date) {
    return ''
  }
  // 日期存在，则进行格式化
  if (format === undefined) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  return dayjs(date).format(format)
}


/**
 * 将值复制到目标对象，且以目标对象属性为准，例：target: {a:1} source:{a:2,b:3} 结果为：{a:2}
 * @param target 目标对象
 * @param source 源对象
 */
export const copyValueToTarget = (target, source) => {
  const newObj = Object.assign({}, target, source)
  // 删除多余属性
  Object.keys(newObj).forEach((key) => {
    // 如果不是target中的属性则删除
    if (Object.keys(target).indexOf(key) === -1) {
      delete newObj[key]
    }
  })
  // 更新目标对象值
  Object.assign(target, newObj)
}


  /**
   * 单个擅闯图片
   * @param file 目标对象
   */
export const uploadFile  =  (file,fileName)=>{
	uni.showLoading({
	  title: 'Uploading',
	});
	return new Promise((resolve, reject) => {
	  uni.uploadFile({
	   url: import.meta.env.SHOPRO_DEV_BASE_URL  +'/admin-api/infra/file/upload',
	    filePath: file,
		fileName:fileName,
	    name: 'file',
	    header: {
	      Accept: '*/*',
	      'tenant-id': '1',
	    },
	    success: (uploadFileRes) => {
	      let result = JSON.parse(uploadFileRes.data);
	      if (result.error === 1) {
	        uni.showToast({
	          icon: 'none',
	          title: result.msg,
	        });
	      } else {
	        return resolve(result);
	      }
	    },
	    fail: (error) => {
	      return resolve(false);
	    },
	    complete: () => {
	      uni.hideLoading();
	    },
	  });
	});
}