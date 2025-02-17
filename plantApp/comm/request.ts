import { showToast } from "vant";




const config = {
	"authorization": uni.getStorageSync("token"),
	"lang": uni.getStorageSync("language"),
	"Authorization":""
}


export default function request(options: any) {

	// 语言包
	let token = uni.getStorageSync("token");

	// 忽略标识
	// config.ignore.token.forEach((e) => {
	// 	if (options.url.includes(e)) {
	// 		Authorization = "";
	// 	}
	// });

	return new Promise(async (resolve, reject) => {
		// 继续请求
		function next() {
			uni.request({
				...options,

				header: {
					Authorization:uni.getStorageSync('token') || "",
					'tenant-id': 1,
					'content-type':'application/json;charset=UTF-8'
					
				},
				method: options.methods,
				url: 'https://dev.waisj.com:3003' + options.url,
				// url: 'http://192.168.1.13:48080' + options.url,
				success(res: any) {
					const { code, data, msg } = res.data;
					// // 无权限
					if (res.statusCode === 401) {
						uni.clearStorageSync()
						uni.navigateTo({
							url: '/pages/login/login'
						})
						return
					}
					// 服务异常
					if (res.statusCode === 502) {
						return reject({
							message: "Abnormal service",
						});
					}

					// 未找到
					if (res.statusCode === 404) {
						return reject({
							message: `[404] ${options.url}`,
						});
					}
					// 成功
					if (res.statusCode === 200) {
						switch (code) {
							case 0:
								resolve(data);
								break;
							case 401:
									// 如果没有token 那么 就去登陆页面 有token 和refrensh-token  就刷新令牌
									refreshToken(config)
								reject({ msg, code })
								break;
							default:
								showToast(msg)
								uni.hideLoading()
								reject({ msg, code });
						}
					}
				},
				fail(err) {
					showToast('Request fail')
					reject({ message: err.errMsg });
				},
			});
		}

		next();
	});
}



// Axios 无感知刷新令牌，参考 https://www.dashingdog.cn/article/11 与 https://segmentfault.com/a/1190000020210980 实现
let requestList = []; // 请求队列
let isRefreshToken = false; // 是否正在刷新中
const refreshToken = async (config) => {
  

  // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
    isRefreshToken = true;
    // 1. 如果获取不到刷新令牌，则只能执行登出操作
    const refreshToken = getRefreshToken();
    
    // 2. 进行刷新访问令牌
    try {
    await request({
		  url:'/app-api/member/auth/refresh-token?refreshToken='+refreshToken,
		  methods:'POST'
	  }).then((res:Object)=>{
		
		  uni.setStorageSync('token',res.accessToken)
		  uni.setStorageSync('refresh-token',res.refreshToken)
		  return reload()
	  })
    
	
    } catch (e) {
      // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
      // 2.2 刷新失败，只回放队列的请求
      requestList.forEach((cb) => {
        cb();
      });
      // 提示是否要登出。即不回放当前请求！不然会形成递归
      return true;
    } finally {
      requestList = [];
      isRefreshToken = false;
    }
};

function reload() {
        // 页面重载
        const pages = getCurrentPages()
        // 声明一个pages使用getCurrentPages方法
        const curPage = pages[pages.length - 1]
        // 声明一个当前页面
        curPage.onLoad(curPage.options) // 传入参数
        curPage.onShow()
        curPage.onReady()
        // 执行刷新
    }

/** 获得访问令牌 */
export const getAccessToken = () => {
  return uni.getStorageSync('token');
};

/** 获得刷新令牌 */
export const getRefreshToken = () => {
  return uni.getStorageSync('refresh-token');
};

 //  request({
	// 	method:'GET',
	// 	url:'/product/browse-history/page',
		
	// }).then(res=>{
	// 	console.log(res)
	// }).catch(e=>{
	// 	console.log(e)
	// })