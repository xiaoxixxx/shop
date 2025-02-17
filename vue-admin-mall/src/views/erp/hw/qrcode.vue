<template>
  <Dialog title=" " v-model="dialogVisible" v-loading="formLoading">

    <div class="contentBox" id="imgNode">
      <div class="title">{{ values }}</div>
      <div>
        <img :src="qrCodeBase64" class="qrcodeCode" />
      </div>
    </div>
    <div class="btns" @click="downLoadHandle">
      <img src="@/assets/imgs/icons/download.png" class="downIcon" /> 下载
    </div>
  </Dialog>
</template>


<script setup>
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
const dialogVisible = ref(false)
const values = ref("8-1")

const showQrCode = async () => {
  try {
    // 生成二维码
    qrCodeBase64.value = await QRCode.toDataURL(values.value);
  } catch (error) {
    console.error('生成二维码失败:', error);
  }
}
const qrCodeBase64 = ref("")
const initData = (data) => {
  values.value = data
  showQrCode()
  dialogVisible.value = true
}
const downLoadHandle = () => {
  const downloadFile = (fileName, content) => {
    // let aLink = document.createElement('a');
    // let blob = base64ToBlob(content); //new Blob([content]);

    // let evt = document.createEvent("HTMLEvents");
    // evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    // aLink.download = fileName;
    // aLink.href = URL.createObjectURL(blob);

    // // aLink.dispatchEvent(evt);
    // aLink.click()

    html2canvas(document.querySelector('#imgNode')).then(canvas => {
      // 创建一个图片元素
      var img = canvas.toDataURL("image/png");
      // 创建一个链接元素
      var a = document.createElement('a');
      a.href = img;
      // 指定下载的文件名
      a.download = fileName + '.png';
      // 模拟点击触发下载
      a.click();
    });
  }
  //base64转blob
  const base64ToBlob = (code) => {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
      type: contentType
    });
  }
  downloadFile(values.value, qrCodeBase64.value)
}
defineExpose({ initData }) 
</script>

<style lang="scss" scoped>
.contentBox {
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
  .title {
    font-size: 22px;
    font-weight: bold;
  }
  .qrcodeCode {
    width: 220px;
    height: 220px;
  }
}

.btns {
  margin: 0 auto;
  width: 160px;
  height: 40px;
  background: #3178fc;
  border-radius: 48px 48px 48px 48px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 40px;
  color: #fff;
  cursor: pointer;
  .downIcon {
    width: 25px;
    height: 25px;
    margin-right: 8px;
  }
}
</style>