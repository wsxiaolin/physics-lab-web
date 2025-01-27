vue3 + vue-router

很好的矢量图标库：https://icomoon.io/app/#/select  
很好的组件库：https://www.naiveui.com/zh-CN/os-theme/components/t

### 贡献指南

1. 创建新页面，页面作为一个组件放在./views 下，并且在 vue-router 下配置路由（如果页面内容要传参，如渲染某 id 的作品，使用动态路由）
2. 创建组件，可以把组件挂到一个临时的测试页面，**推荐使用数组传参**，e.g：使用 user 对象而不是 user_id,user_Nickname 等。
3. js 组件使用模块化语法，放在./services，最好做成纯函数

### LocalStrage 中维护的变量：

- token & authcode
- isLogin
- nickName: 用于存储离谱的{User}渲染
- userIDAndAvartarIDMap : {userid:[avartar<第几张>,存储时间]} 真是一个糟糕的变量名，搜索这个名称可以在附近查看到缓存时间


### ts的使用

1，不强求使用ts（用ts的朋友也别太花哨了2333），不过你书写js的时候可以获得不错的智能提示
2，如果遇到响应式数据报错未定义，可以禁用插件volar使用别的插件（真有效。。。）