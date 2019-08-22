export default {
    computed: {
        filteredBlogs: function(){
            return this.blogs.filter((blog) => {
                return blog.loanid.match(this.search);
            });
        }
    }
};