import request from '../../../../comm/request.ts';

const SpuHistoryApi = {
  // 删除商品浏览记录
  deleteBrowseHistory: (spuIds) => {
    return request({
      url: '/app-api/product/browse-history/delete',
      methods: 'DELETE',
      data: { spuIds },
      custom: {
        showSuccess: true,
        successMsg: 'Deleted successfully',
      },
    });
  },
  // 清空商品浏览记录
  cleanBrowseHistory: () => {
    return request({
      url: '/app-api/product/browse-history/clean',
      methods: 'DELETE',
      custom: {
        showSuccess: true,
        successMsg: 'Cleared successfully',
      },
    });
  },
  // 获得商品浏览记录分页
  getBrowseHistoryPage: (data) => {
    return request({
      url: '/app-api/product/browse-history/page',
      methods: 'GET',
      data,
      custom: {
        showLoading: false
      },
    });
  },
};
export default SpuHistoryApi;
