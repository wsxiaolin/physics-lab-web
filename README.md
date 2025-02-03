# physics-lab-web

## 使用

克隆仓库到本地后，执行 `npm install` 安装依赖，运行 `npm run dev` 启动本地服务器。注意，由于开发环境没有后端（笑），所以我们使用的是代理方案解决跨域问题，这也导致 `npm run build` 的结果无法直接运行（且开发时网路请求url与实际url不一致）（即使你开了跨域插件）

## 参与开发

### 贡献指南

1. 创建新页面，页面作为一个组件放在./views 下，并且在 vue-router 下配置路由（如果页面内容要传参，如渲染某 id 的作品，使用动态路由）
2. 创建组件，可以把组件挂到一个临时的测试页面，**推荐使用数组传参**，e.g：使用 user 对象而不是 user_id,user_Nickname 等。
3. js 组件使用模块化语法，放在./services，最好做成纯函数
4. 很好的矢量图标库：https://icomoon.io/app/#/select  
5. 很好的组件库：https://www.naiveui.com/zh-CN/os-theme/components/t


### LocalStrage 中维护的变量：

- token & authcode
- isLogin
- nickName: 用于存储离谱的{User}渲染
- userIDAndAvartarIDMap : {userid:[avartar<第几张>,存储时间]} 真是一个糟糕的变量名，搜索这个名称可以在附近查看到缓存时间


### native-ui

1. 为了tree-shaking优化，native-ui不再全局整体注册，只是注册了几个常用组件，位于main.ts
2. 也可以在单个组件内引入或者添加到全局注册

### ts的使用

1. 不强求使用ts（用ts的朋友也别太花哨了2333），不过你书写js的时候可以获得不错的智能提示
2. 如果遇到响应式数据报错未定义，可以禁用插件volar使用别的插件（真有效。。。）
3. 有些错误提示可能本身并不存在，可试着刷新（格式化）文档，或者运行npm run build，后者不报错就是没错误

### 数据渲染

1. 渲染函数位于./services，maekdown和unity文本的渲染均在此
2. 渲染出的span元素的样式统一定义于index.html，涉及交互的元素，请在其父元素（上一级组件）上使用事件委托

### 代办
1. 作品列表（注意支持tag,sort,day天内作品user）的筛选参数
2. 发布评论的组件
3. 用户信息的卡片
4. brief作品的跳转
5. 富文本渲染还需要完善
6. 缓存优化（离线模式）：如API失败则默认返回上一次成功的API的结果
7. 好友界面