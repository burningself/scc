const success_msg = {
    template: `
        <transition name="fade">
            <p class="show" v-if="tC"> {{content}} </p>
        </transition>
    `,
    data() {
        return {
            tC: false,
        }
    },
    props: ['content'],
    methods: {
        showMsg() {
            const that = this;
            this.tC = true;
            setTimeout(() => {
                that.tC = false;
            }, 1000)
        }
    }
}