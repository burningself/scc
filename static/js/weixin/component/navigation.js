const navigation = {
    template: `
        <div class="navigation nav">
            <div class="weui-header"> 
                <div class="weui-header-left"> <a class="icon icon-109 f-white" @click="index_back"></a>  </div>
                <h1>{{title}}</h1>
            </div>
        </div>
    `,
    props: ['title', 'address'],
    methods: {
        index_back() {
            // if (this.$route.name == "add_diary") {
            //     axios.delete("/projects/rest/Records/" + this.$route.query.val.split('|')[1].split('_')[1] + "/")
            //         .then(res => {
            //             var datalist = JSON.parse(localStorage.getItem('data_list'));
            //             datalist.splice(datalist.length - 1, 1);
            //             this.$router.push({ path: this.address });
            //         })
            // } else {
            this.$router.push({ path: this.address });
            // }

        }
    }
}