const important_pro = {
    template: `
    <div class="marpad_info">
        <div class="graphic_check">
                <gxbk :comeData="comeData"></gxbk> 
        </div>
    </div>
    `,
    data() {
        return {
            comeData: "",
        }
    },
    components: {
        searchPro,
        gxbk
    },
    methods: {
        changeData(value) {
            console.log(value);
            this.comeData = value;
        }
    }
}