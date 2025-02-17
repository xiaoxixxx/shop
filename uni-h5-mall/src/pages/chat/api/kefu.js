import request from '../../../../comm/request.ts';

const KeFuApi = {
  sendKefuMessage: (data) => {
    return request({
      url: '/app-api/promotion/kefu-message/send',
      methods: 'POST',
      data,
      custom: {
        auth: true,
        showLoading: true,
        loadingMsg: 'Sending',
        showSuccess: true,
        successMsg: 'Send successfully',
      },
    });
  },
  getKefuMessagePage: (params) => {
    return request({
      url: '/app-api/promotion/kefu-message/page',
      methods: 'GET',
      data: { ...params },

    });
  },
};

export default KeFuApi;
