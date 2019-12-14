import Vue from 'vue'
import {
  Container, Header, Aside, Main, Footer,
  Submenu, Menu, Message, MenuItem, Breadcrumb,
  BreadcrumbItem, Card, Row, Col, Input,
  Button, Table, TableColumn, Pagination, Dialog,
  Form, FormItem, Avatar, Upload, Divider,
  Tabs, TabPane, Tag, Cascader, MessageBox,
  Select, Option, Tree
}
from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Avatar)
Vue.use(Upload)
Vue.use(Divider)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Tag)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)

Vue.component(Message)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox