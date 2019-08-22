<template>
    <div id="show-blogs">
        <h1>All Blog Articles</h1>
        <input type="text" v-model="search" placeholder="search blogs" />
        <div v-for="blog in filteredBlogs" class="single-blog">
            <router-link v-bind:to="'/blog/' + blog.loanid"><h2>{{ blog.loanid }}</h2></router-link>
            <article>{{ blog.StartDate }}</article>
        </div>
        <br><br>
        <button v-on:click.prevent="post">Load Loans</button>
    </div>
</template>

<script>
// Imports
import searchMixin from '../mixins/searchMixin';
import axios from "axios";

export default {
    data () {
        return {
            blogs: [],
            search: ''
        }
    },

    methods: {
        load: function(){
            var token;
            token = localStorage.getItem("token");

            let res = axios.get('http://localhost:3000/loadloan');
            let data = res.data;
            console.log(data);


            //alert(token);
            axios.get(`http://localhost:3000/loadloan`, {
                headers: {
                "x-access-token": token
                }
            })
            .then(res => {
                alert('Load Data 21');
                console.log(JSON.stringify(res.data));
            });

            alert('Load Data 22');

        },


        post: function(){
            //alert('true 2');   
           
            const formData = new FormData();
            formData.append("title", JSON.stringify('Hacklehead'));
            formData.append("content", JSON.stringify('sa'))
            
            axios.post("http://localhost:3000/loadloans", formData).then(res => {
          
          this.loading = "";
          
          if (res.data.status == true) {
            //alert('true!');   
            console.log(res.data.status);
            //console.log(res.data.rows);
            var result=res.data.rows;
            
            var blogsArray = [];
            var jsonData = JSON.parse(result);
            /*
            for (var i = 0; i < jsonData.length; i++) {
                var counter = jsonData[i];
                blogsArray.push(counter.loanid);
                //this.blogs.push(counter.loanid);
                //blogsArray.push(counter);
                //alert(counter.loanid);
                }
            */
            for (let key in jsonData){
                var counter = jsonData[key];
                //alert(counter.StartDate);
                jsonData[key].loanid = counter.loanid;
                blogsArray.push(jsonData[key]);
            }

            this.blogs = blogsArray;
            console.log(this.blogs);

            //console.log(result);
            /*
            var blogsArray = [];
            for (let key in result){
                result[key].loanid = key;
                blogsArray.push(result[key]);
            }
            this.blogs = blogsArray;
            */
            // store the data in localStorage
                                    

            // now send the user to the next route
            
          } else {
            this.status = res.data.message;
            alert('Hoo!');
          }
        });
         
        },
    },    
    created() {
        this.$http.get('https://nn-vue-playlist.firebaseio.com/posts.json').then(function(data){
            return data.json()
        }).then(function(data){
            var blogsArray = [];
            for (let key in data){
                data[key].id = key;
                blogsArray.push(data[key]);
            }
            this.blogs = blogsArray;
            //console.log(this.blogs);
        });
    },
    mixins: [searchMixin]
}
</script>

<style scoped>
#show-blogs{
    max-width: 800px;
    margin: 0px auto;
}
.single-blog{
    padding: 20px;
    margin: 20px 0;
    box-sizing: border-box;
    background: #eee;
    border: 1px dotted #aaa;
}
#show-blogs a{
    color: #444;
    text-decoration: none;
}
input[type="text"]{
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
}
</style>