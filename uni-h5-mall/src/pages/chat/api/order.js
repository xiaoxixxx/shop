import request from '../../../../comm/request.ts';
import { isEmpty } from '../../../../comm/useGoods.js';

const OrderApi = {
  // 计算订单信息
  settlementOrder: (data) => {
    const data2 = {
      ...data,
    };
    // 移除多余字段
    if (!(data.couponId > 0)) {
      delete data2.couponId;
    }
    if (!(data.addressId > 0)) {
      delete data2.addressId;
    }
    if (!(data.pickUpStoreId > 0)) {
      delete data2.pickUpStoreId;
    }
    if (isEmpty(data.receiverName)) {
      delete data2.receiverName;
    }
    if (isEmpty(data.receiverMobile)) {
      delete data2.receiverMobile;
    }
    if (!(data.combinationActivityId > 0)) {
      delete data2.combinationActivityId;
    }
    if (!(data.combinationHeadId > 0)) {
      delete data2.combinationHeadId;
    }
    if (!(data.seckillActivityId > 0)) {
      delete data2.seckillActivityId;
    }
    if (!(data.pointActivityId > 0)) {
      delete data2.pointActivityId;
    }
    // 解决 SpringMVC 接受 List<Item> 参数的问题
    delete data2.items;

    for (let i = 0; i < data.items.length; i++) {
      data2[encodeURIComponent('items[' + i + '' + '].skuId')] = data.items[i].skuId + '';
      data2[encodeURIComponent('items[' + i + '' + '].count')] = data.items[i].count + '';
      if (data.items[i].cartId) {
        data2[encodeURIComponent('items[' + i + '' + '].cartId')] = data.items[i].cartId + '';
      }
    }

    const queryString = Object.keys(data2)
      .map((key) => key + '=' + data2[key])
      .join('&');
    console.log(data2)
    return request({
      url: `/app-api/trade/order/settlement?${queryString}`,
      methods: 'GET',
      custom: {
        showError: true,
        showLoading: true,
      },
    });
  },
  // 获得商品结算信息
  getSettlementProduct: (spuIds) => {
    return request({
      url: '/app-api/trade/order/settlement-product',
      methods: 'GET',
      params: { spuIds },
      custom: {
        showLoading: false,
        showError: false,
      },
    });
  },
  // 创建订单
  createOrder: (data) => {
    return request({
      url: `/app-api/trade/order/create`,
      methods: 'POST',
      data,
    });
  },
  // 获得订单详细：sync 是可选参数
  getOrderDetail: (id, sync) => {
    return request({
      url: `/app-api/trade/order/get-detail`,
      methods: 'GET',
      params: {
        id,
        sync,
      },
      custom: {
        showLoading: false,
      },
    });
  },
  // 订单列表
  getOrderPage: (params) => {
    return request({
      url: `/app-api/trade/order/page`,
      method: 'GET',
      data: { ...params },
      custom: {
        showLoading: false,
      },
    });
  },
  // 确认收货
  receiveOrder: (id) => {
    return request({
      url: `/app-api/trade/order/receive`,
      methods: 'PUT',
      params: {
        id,
      },
    });
  },
  // 取消订单
  cancelOrder: (id) => {
    return request({
      url: `/app-api/trade/order/cancel`,
      methods: 'DELETE',
      params: {
        id,
      },
    });
  },
  // 删除订单
  deleteOrder: (id) => {
    return request({
      url: `/app-api/trade/order/delete`,
      methods: 'DELETE',
      params: {
        id,
      },
    });
  },
  // 获得交易订单的物流轨迹
  getOrderExpressTrackList: (id) => {
    return request({
      url: `/app-api/trade/order/get-express-track-list`,
      methods: 'GET',
      params: {
        id,
      },
    });
  },
  // 获得交易订单数量
  getOrderCount: () => {
    return request({
      url: '/app-api/trade/order/get-count',
      methods: 'GET',
      custom: {
        showLoading: false,
        auth: true,
      },
    });
  },
  // 创建单个评论
  createOrderItemComment: (data) => {
    return request({
      url: `/app-api/trade/order/item/create-comment`,
      methods: 'POST',
      data,
    });
  },
};

export default OrderApi;
