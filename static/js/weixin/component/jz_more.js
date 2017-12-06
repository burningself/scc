const jzMore = {
    template: `
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <slot name="content"></slot>
            <success_msg :content="'没有更多数据'" ref="c1"></success_msg>
        </div>
    `,
    props: ['busy'],
    components: {
        success_msg
    },
    methods: {
        loadMore() {
            alert(111);
            this.$emit('loadMore');
        },
        noData() {
            this.$refs.c1.showMsg();
        }
    }
}