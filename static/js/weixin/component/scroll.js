var scroll = {
    template: `
        <div ref="wrapper">
            <slot></slot>
        </div>
    `,
    data() {
        return {

        }
    },
    props: {
        probeType: { //在什么时候触发滚动事件
            type: Number,
            default: 1
        },
        click: { //  是否阻止浏览器原生click事件，默认是false阻止
            type: Boolean,
            default: true,
        },
        data: { //动态数据,如果数据更新需要重新refresh一下，不然会导致滚动条滚不动的情况
            type: Array,
            default: null
        },
        /**
         * 是否派发滚动到底部的事件，用于上拉加载
         */
        pullup: {
            type: Boolean,
            default: false
        },
        scrollX: {
            type: Boolean,
            default: false,
        },
        scrollY: {
            type: Boolean,
            default: true,
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
    },
    mounted() {
        setTimeout(() => { //防止dom未渲染
            this._initScroll()
        }, 20)
    },
    methods: {
        _initScroll() { //初始化滚动
            if (!this.$refs.wrapper) { //如果初始化的时候，wrapper还是个undefined
                return;
            }
            this.scroll = new this.$BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: true,
                scrollY: this.scrollY,
            })

            // 是否派发滚动到底部事件，用于上拉加载
            if (this.pullup) {
                this.scroll.on('scrollEnd', () => {
                    // 滚动到底部
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }
                })
            }
            this.scroll.on('scroll', (pos) => {
                var inp = document.getElementsByTagName('input');
                var textarea = document.getElementsByTagName('textarea');
                if (inp && inp.length != 0) {
                    var arr = Array.prototype.slice.apply(inp);
                    var textarea = Array.prototype.slice.apply(textarea);
                    textarea.forEach(value => {
                        console.log(value);
                        value.blur();
                    })
                    arr.forEach(value => {
                        console.log(value);
                        value.blur();
                    })
                }
            })
        },
        enable() { //默认启动better-scroll
            this.scroll && this.scroll.enable();
        },
        disable() { //禁用better-scroll
            this.scroll && this.scroll.disable();
        },
        refresh() { //刷新数据结构，重新计算滚动高度
            this.scroll && this.scroll.refresh();
        },
        destroy() {
            this.scroll && this.scroll.destroy();
        },
        enable() {
            this.scroll && this.scroll.enable();
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this.refresh();
            }, 20)
        },
    }
}