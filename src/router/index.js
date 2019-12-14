import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import User from '../views/user/User.vue'
import Sort from '../views/sort/Sort.vue'
import Tag from '../views/sort/Tag.vue'
import ArticleList from '../views/article/ArticleList.vue'
import WriteBlog from '../views/article/WriteArticle.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/sorts', component: Sort },
      { path: '/tags', component: Tag },
      { path: '/articlelist', component: ArticleList },
      { path: 'writeblog', component: WriteBlog }
    ] 
  }
]

const router = new VueRouter({
  routes
})

export default router
