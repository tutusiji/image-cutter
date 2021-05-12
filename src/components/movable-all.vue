<template>
    <view>
        <movable-area>
            <movable-view :style="_style" :x="x" :y="y" direction="all" @change="onChange">
                <slot></slot>
            </movable-view>
        </movable-area>
    </view>
</template>

<script>
  export default {
    name: 'movableAll',
    props:{
      _style:{
        type: Object/String,
        default:{}
      }
    },
    data () {
      return {
        old: {
          x: 0,
          y: 0
        }
      }
    },
    methods: {
      onChange: function (e) {
        this.old.x = e.detail.x
        this.old.y = e.detail.y
      }
    }
  };
</script>


<style lang="scss" scoped>
    movable-area {
        // @extend .fixed;
        position: fixed;
        z-index: 19;
        pointer-events: none;
        display: inline-block;

        movable-view {
            width: 100rpx;
            height: 100rpx;
            pointer-events: auto;
            top: initial;
            left: initial;
            bottom: 100rpx;
            right: 20rpx;
            z-index: 1;
        }
    }
</style>
