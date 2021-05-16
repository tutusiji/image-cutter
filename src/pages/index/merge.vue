<template>
  <view class="home">
    <view class="imglist">
      <view
        class="item"
        :style="{ backgroundImage: `url(${item.url})` }"
        v-for="(item, index) in list"
        :key="item.url"
        @click="showImg(item.url, index)"
      >
        <view class="num">{{ index + 1 }}</view>
      </view>
      <!-- <AppList :listData="list" @listChange="listChange"></AppList> -->

      <view class="footer">
        <view class="mod-btn plus" @click="chooseImg">
          <image class="img" src="../../static/icon-plus.svg" />
        </view>
        <view class="mod-btn combine" @click="mergeBtn" v-if="list.length > 0">
          合并
        </view>
      </view>
    </view>
    <view class="cvw">
      <canvas
        class="myCanvas"
        canvas-id="myCanvas"
        id="myCanvas"
        :style="{ width: `${cvsWidth}px`, height: `${cvsHeight}px` }"
      ></canvas>
    </view>
    <!-- @scrolltoupper="upper"
          @scrolltolower="lower" -->
    <view class="box" v-show="display">
      <div class="boxbd">
        <scroll-view
          id="scrollView"
          :scroll-top="scrollTop"
          scroll-y="true"
          show-scrollbar="false"
          class="scroll-Y"
          @scroll="scroll"
        >
          <image
            class="showImg"
            :src="showUrl"
            @click="showBigPhoto"
            :style="{
              width: `${showPhoto.width * 0.27}px`,
              height: `${showPhoto.height * 0.27}px`,
            }"
          />
        </scroll-view>
        <scroll-view
          id="cvsTop"
          :scroll-top="cvsTopVal"
          scroll-y="true"
          show-scrollbar="false"
          class="cvsTop"
          :style="{
            height: `${cutterVal}px`,
          }"
          @scroll="scroll"
        >
          <image
            class="showImg"
            :src="showUrl"
            @click="showBigPhoto"
            :style="{
              width: `${showPhoto.width * 0.27}px`,
              height: `${showPhoto.height * 0.27}px`,
            }"
          />
        </scroll-view>
        <scroll-view
          id="cvsBot"
          :scroll-top="cvsBotVal"
          scroll-y="true"
          show-scrollbar="false"
          class="cvsBot"
          :style="{
            height: `${scrollView.height - cutterVal}px`,
            top: `${cutterVal}px`,
          }"
          @scroll="scroll"
        >
          <image
            class="showImg"
            :src="showUrl"
            @click="showBigPhoto"
            :style="{
              width: `${showPhoto.width * 0.27}px`,
              height: `${showPhoto.height * 0.27}px`,
            }"
          />
        </scroll-view>

        <!-- // 裁剪器 -->
        <movable-area class="cutter-area" v-show="cutShow">
          <movable-view
            class="cutter-view"
            :y="cutterVal"
            direction="vertical"
            @change="onChangeCutter"
          >
            <view class="cutter-scissor">
              <image class="img" src="../../static/cutter.svg" />
            </view>
          </movable-view>
        </movable-area>

        <!-- 滚动器 -->
        <movable-area class="cutter-area" v-show="cutShow">
          <movable-view
            class="cutter-view"
            :y="topY"
            direction="vertical"
            @change="onChangeHand"
          >
            <view class="cutter-hand">
              <image class="img" src="../../static/hand.svg" />
            </view>
          </movable-view>
        </movable-area>
      </div>
      <view class="close" @click="display = false">
        <image class="img" src="../../static/close1.svg" />
      </view>
      <view class="tool">
        <view class="mod-btn" @click="save" v-if="!cutShow"> 保存 </view>
        <view class="mod-btn" @click="cutShow = true" v-if="!cutShow">
          裁剪
        </view>
        <view class="mod-btn" @click="cutShow" v-if="cutShow"> 确定 </view>
        <view class="mod-btn" @click="cutShow" v-if="cutShow"> 取消 </view>
        <view class="desc" v-if="cutShow"
          >可以拖动左侧滚动条确定剪裁区域，再拖动右侧剪刀确定切割线，再拖动切割线上下区域的画布内容确定剪裁之后的内容,点击“确定”</view
        >
      </view>
    </view>
  </view>
</template>
<script>
import AppList from "../../components/AppList.vue";
import merge from "../mixins/merge";
// import { uniGrid } from "@dcloudio/uni-ui";
//import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue' //也可使用此方式引入组件
export default {
  onShareAppMessage() {
    return {
      title: "图片处理小程序",
      path: "/pages/index/index",
    };
  },
  onShareTimeline() {
    return {
      title: "图片处理小程序",
      path: "/pages/index/index",
    };
  },
  mixins: [merge],
  data() {
    return {
      list: [],
      cvsWidth: 1120,
      cvsHeight: 0,
      showUrl: "",
      showPhoto: null,
      display: true,
      cutShow: false,
      y2: 250,
      topY: 0,
      scrollTop: 0,
      scrollView: null,
      scrollScale: 0,
      cutterVal: 200,
      tempVal: 0,
    };
  },
  components: {
    AppList,
  },
  created() {
    //  this.$watch(
    //     "tempVal",
    //     this.debounce((newSearchText) => {
    //      this.setTop(newSearchText)
    //     }, 500)
    //   );
  },
  mounted() {
    this.init();
    this.initX();
  },
  methods: {
    init() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#scrollView")
        .boundingClientRect((data) => {
          console.log(data);
          this.scrollView = data;
        })
        .exec();
    },
    listChange(option) {
      console.log("listChange", option);
    },
    chooseImg() {
      this.list = [];

      this.showUrl = "";
      this.showPhoto = null;
      const that = this;
      let arr = [];
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ["compressed"], //可以指定是原图还是压缩图，默认二者都有 "original",
        sourceType: ["album", "camera "], //从相册选择
        success: async function(res) {
          console.log(res.tempFilePaths);
          // arr.push(JSON.stringify(res.tempFilePaths))
          // arr.push(...res.tempFilePaths)
          const promiseArr = res.tempFilePaths.map(
            (item) =>
              new Promise((resolve) => {
                uni.getImageInfo({
                  src: item,
                  success: function(image) {
                    // console.log(image)
                    resolve({
                      url: item,
                      w: image.width,
                      h: image.height,
                    });
                  },
                });
              })
          );
          for (let i = 0; i < promiseArr.length; i++) {
            const result = await promiseArr[i];
            arr.push(result);
          }
          that.list.push(...arr);
          that.cvsHeight = 0; //初始化画布高度
          console.log(that.list);
        },
        complete: function() {},
      });
    },
    showImg(path, index) {
      const arr = [];
      this.list.filter((item) => {
        arr.push(item.url);
      });
      // 预览图片
      uni.previewImage({
        urls: arr,
        current: index,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function(data) {
            console.log(
              "选中了第" +
                (data.tapIndex + 1) +
                "个按钮,第" +
                (data.index + 1) +
                "张图片"
            );
          },
          fail: function(err) {
            console.log(err.errMsg);
          },
        },
      });
    },
    showBigPhoto() {
      uni.previewImage({
        urls: [this.showUrl],
      });
    },
    mergeBtn() {
      uni.showLoading({
        title: "合成中...",
      });
      this.showUrl = "";
      this.showPhoto = null;
      const ctx = uni.createCanvasContext("myCanvas");
      let cx = 0;
      let cy = 0;
      let cw = this.cvsWidth;
      let ch = 0;
      let itemH = 0;
      this.list.forEach((item, index) => {
        itemH = (item.h * cw) / item.w;
        let prevItem = index ? this.list[index - 1] : this.list[0];
        let prevH = (prevItem.h * cw) / prevItem.w;
        cy = index ? cy + prevH : 0;
        ch = itemH;
        this.cvsHeight += itemH;
        ctx.drawImage(item.url, cx, cy, cw, ch);

        console.log(cx, cy, cw, ch, this.cvsHeight);
      });
      setTimeout(() => {
        ctx.draw(false, () => {
          const that = this;
          console.log("===4===");
          uni.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: this.cvsWidth,
            height: this.cvsHeight,
            destWidth: this.cvsWidth,
            destHeight: this.cvsHeight,
            canvasId: "myCanvas",
            fileType: "jpg",
            success: function(res) {
              // 在H5平台下，tempFilePath 为 base64
              console.log("11", res.tempFilePath);
              that.showUrl = res.tempFilePath;
              uni.getImageInfo({
                src: res.tempFilePath,
                success: function(image) {
                  that.showPhoto = image;
                  that.scrollScale =
                    (image.height * 0.27 - that.scrollView.height + 20) /
                    that.scrollView.height;
                  console.log(image, that.scrollScale);
                },
              });
            },
          });
        });
        uni.hideLoading();
        this.display = true;
      }, 1000);
      //   requestAnimationFrame
    },
    scroll(e) {
      console.log("scroll", e.detail.scrollTop);
    },
    onChangeCutter: function(e) {
      console.log("cutter", e.detail.y);
      this.tempVal = e.detail.y + 10;
      // this.debounce(this.setTop(),500)
      // this.cutterVal = this.tempVal;
      setTimeout(() => {
        this.cutterVal = this.tempVal;
      }, 1000);
      // this.debounce(this.setTop(), 1000, true);
    },
    onChangeHand: function(e) {
      console.log("onChangeHand", e.detail.y);
      this.scrollTop = e.detail.y * this.scrollScale;
    },
    setTop(newSearchText) {
      console.log("setTop", this.tempVal);
      this.cutterVal = this.tempVal;
    },
    save() {
      uni.saveImageToPhotosAlbum({
        filePath: this.showUrl,
        success: function() {
          console.log("save success");
          uni.showToast({
            title: "保存成功",
            duration: 1500,
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.footer {
  width: 100vw;
  display: flex;

  .combine {
    margin-left: 20px;
  }
}

.tool {
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  // justify-content: center;
  background-color: #fff;
  margin: 10px 0 0 10px;
  width: 90vw;

  .mod-btn {
    width: 40px;
    height: 40px;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 10px;
    font-size: 14px;
  }

  .desc {
    margin-left: 10px;
    font-size: 10px;
  }
}

.mod-btn {
  white-space: nowrap;
  display: inline-block;

  margin-left: 0;
  width: 60px;
  height: 60px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  .img {
    width: 30px;
    height: 30px;
  }

  &:active {
    background-color: #bebebe;
  }
}

.imglist {
  padding: 20px 0 20px 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.item {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid #000;
  background-color: #fff;

  .num {
    position: absolute;
    top: -15px;
    left: 46%;
    font-size: 10px;
  }
}

.myCanvas {
  position: absolute;
  left: 10000px;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  // width: 80%;
  // height: 2000px;
  margin: 0 auto;
  border: 1px solid #000;
}

.showImg {
  display: block;
  width: 80%;
  margin: 0 auto;
}

.cvw {
  width: 0;
  height: 0;
  overflow: hidden;
}

.box {
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
}

.boxbd {
  position: relative;
  border-top: 1px solid #000;
  position: relative;
  margin: 10px 0 0 10px;
  width: 90vw;
  height: 79vh;
  //   border: 1px dashed #fff;
  background-color: rgba(255, 255, 255, 0.95);
  overflow: hidden;
}

.cutter-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cutter-view {
  width: 100%;
  height: 20px;
  pointer-events: auto;
}

.cutter-scissor {
  width: 100%;
  height: 20px;
  position: relative;

  .img {
    position: absolute;
    right: -26px;
    top: -14px;
    width: 60px;
    height: 60px;
  }

  &:after {
    position: absolute;
    content: "";
    height: 1px;
    top: 10px;
    right: 0;
    width: 100%;
    border-top: 2px dashed #000;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.7);
  }
}

.cutter-hand {
  width: 60px;
  height: 20px;
  position: relative;

  .img {
    position: absolute;
    left: -12px;
    top: -14px;
    width: 60px;
    height: 60px;
    transform: rotate(40deg);
  }
}

.scroll-Y {
  margin: 8px 0 0 7px;
  width: 86vw;
  border: 1px dashed #000;
  height: 76vh;
  background: linear-gradient(
    -45deg,
    rgba(207, 207, 207, 0.03) 0,
    rgba(206, 206, 206, 0.03) 25%,
    #ffffff 25%,
    #ffffff 50%,
    rgba(207, 207, 207, 0.03) 50%,
    rgba(206, 206, 206, 0.03) 75%,
    #ffffff 75%,
    #ffffff
  );
  background-size: 50px 50px;
}

.scroll-view-item_H {
  height: 500px;
}

.close {
  position: absolute;
  right: -7px;
  top: 10px;
  width: 30px;
  height: 30px;

  .img {
    width: 20px;
    height: 20px;
    color: #fff;
  }
}

.cvsTop {
  margin: 8px 0 0 0;
  position: absolute;
  left: 7px;
  top: 0;
  width: 86vw;
  border: 1px solid #f00;
}

.cvsBot {
  margin: 8px 0 0 0;
  position: absolute;
  left: 7px;
  top: 0;
  width: 86vw;
  border: 1px solid rgb(32, 36, 243);
}
</style>
