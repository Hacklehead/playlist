<template>
    <div id="add-test">
        <h2>Test Post</h2>
        <form @submit.prevent="connect">
            <label>Blog Title:</label>
            <input type="text" v-model.lazy="blog.title" required />
            <label>Blog Content:</label>
            <textarea v-model.lazy.trim="blog.content"></textarea>
            <div id="checkboxes">
                <p>Blog Categories:</p>
                <label>Ninjas</label>
                <input type="checkbox" value="ninjas" v-model="blog.categories" />
                <label>Wizards</label>
                <input type="checkbox" value="wizards" v-model="blog.categories" />
                <label>Mario</label>
                <input type="checkbox" value="mario" v-model="blog.categories" />
                <label>Cheese</label>
                <input type="checkbox" value="cheese" v-model="blog.categories" />
            </div>
            <label>Author:</label>
            <select v-model="blog.author">
                <option v-for="author in authors">{{ author }}</option>
            </select>
            <hr />
            <button v-on:click.prevent="post">Add Blog</button>
        </form>
        
    </div>
</template>

<script>
import axios from "axios";
// Imports
export default {
    data () {
        return {
            blog: {
                title: '',
                content: '',
                categories: [],
                author: ''
            },
            authors: ['The Net Ninja', 'The Angular Avenger', 'The Vue Vindicator'],
            submitted: false
        }
    },
    methods: {
        post: function(){
            const formData = new FormData();
            formData.append("title", JSON.stringify(this.blog.title));
            formData.append("content", JSON.stringify(this.blog.content))
            
            //alert(JSON.stringify(this.blog.title));

             axios.post("http://localhost:3000/connect", formData).then(res => {
          // Post a status message
          this.loading = "";
          
          //alert('Boo!');
          //alert(res.JSON.stringify(res.data));
          if (res.data.status == true) {
            alert('true!');   
            console.log(res.data.status);
            console.log(res.data.message);
            console.log('token=' + res.data.token);
            // store the data in localStorage
            
            //localStorage.setItem("title", res.data.token);
            //localStorage.setItem("content", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("title", res.data.title);
            localStorage.setItem("content", JSON.stringify(res.data.content));

            // now send the user to the next route
            
          } else {
            this.status = res.data.message;
            alert('Hoo!');
          }
        });
          //alert('Ha Ha!');        
          /*
            this.$http.post('https://nn-vue-playlist.firebaseio.com/posts.json', this.blog).then(function(data){
                console.log(data);
                this.submitted = true;
            });
            */
        },
        connect(){
            //alert("Connect!");
        }

    }
}
</script>

<style scoped>
#add-test *{
    box-sizing: border-box;
}
#add-test{
    margin: 20px auto;
    max-width: 600px;
    padding: 20px;
}
label{
    display: block;
    margin: 20px 0 10px;
}
input[type="text"], textarea, select{
    display: block;
    width: 100%;
    padding: 8px;
}
textarea{
    height:200px;
}
#preview{
    padding: 10px 20px;
    border: 1px dotted #ccc;
    margin: 30px 0;
}
h3{
    margin-top: 10px;
}
#checkboxes input{
    display: inline-block;
    margin-right: 10px;
}
#checkboxes label{
    display: inline-block;
    margin-top: 0;
}
hr{
    display: none;
}
button{
    display: block;
    margin: 20px 0;
    background: crimson;
    color: #fff;
    border: 0;
    padding: 14px;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
}
</style>