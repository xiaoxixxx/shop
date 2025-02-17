<script setup>

defineProps({
  showCuLoading: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="maskBox center animate__animated animate__fadeIn animate__delay-.5s" v-if="showCuLoading">
    <!-- SPINNING SQUARES -->
    <div class="spinner-box">
      <div class="configure-border-1">
        <div class="configure-core"></div>
      </div>
      <div class="configure-border-2">
        <div class="configure-core"></div>
      </div>
    </div>
  </div>

</template>



<style lang="scss" scoped>
.maskBox {
  position: fixed;
  height: 100vh;
  overflow: hidden;
  left: 0;
  top: 0;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999 !important;
}
@keyframes configure-xclockwise {
  0% {
    transform: rotate(45deg);
  }
  25% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(-135deg);
  }
  75% {
    transform: rotate(-225deg);
  }
  100% {
    transform: rotate(-315deg);
  }
}

@keyframes configure-clockwise {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.spinner-box {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.configure-border-1 {
  width: 80px;
  height: 80px;
  padding: 3px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fb5b53;
  animation: configure-clockwise 3s ease-in-out 0s infinite alternate;
}

.configure-border-2 {
  width: 80px;
  height: 80px;
  padding: 3px;
  left: -80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(63, 249, 220);
  transform: rotate(45deg);
  animation: configure-xclockwise 3s ease-in-out 0s infinite alternate;
}

.configure-core {
  width: 100%;
  height: 100%;
  background-color: #1d2630;
}
</style>