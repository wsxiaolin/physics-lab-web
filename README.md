# physics-lab-web

## 使用

### 关于本地开发

克隆仓库到本地后，执行 `npm install` 安装依赖，运行 `npm run dev` 启动本地服务器。注意，由于开发环境没有后端（笑），所以我们使用的是代理方案解决跨域问题，这也导致 `npm run build` 的结果无法直接运行（且开发时网路请求 url 与实际 url 不一致）（即使你开了跨域插件）

常见问题：

1. build 之后出现一个代码体积过大的 warn：我们在 MessageList 里面加入了巨大无比的富文本解析引擎，已经通过预加载缓解
2. install 之后报错一个包（kateX）有跨站脚本攻击的风险：我们进行了防护，逻辑位于./services/advancedParser.ts

### 关于上线

### 我的方案
我还会死觉得最好使用一些规范的方式，改 host 挺担心会不会出什么奇奇怪怪的问题，所以我使用了环境变量，当然我也不知道最终会怎样，只是一个小小的尝试，解决了 API 的问题，本地和 src 依然使用/api（没动static），构建的时候读取别的环境变量，例如，构建后会：
```JavaScript
B$="http://physics-api-cn.turtlesim.com:80";
function F$(e){return e.replace(/\/api/g,B$)}
```
而开发时则是：
```JavaScript
const apiUrl = import.meta.env.VITE_API_URL; // apiUrl = "/api" 
export default function (path: string) {
  return path.replace(/\/api/g, apiUrl);
}
```

### 遇到的问题和尝试

- 路由：在实际路径加一个404.html重定向确实可以解决问题，不过emmm会不会有点不合适，每开一个页面都要跳转到一个html
- 路径：因为我选择了公共资源放到src/assests，所以构建后的本地资源Url会指向 /src/assests/

## 参与开发

### 贡献指南

1. 创建新页面，页面作为一个组件放在./views 下，并且在 vue-router 下配置路由（如果页面内容要传参，如渲染某 id 的作品，使用动态路由）
2. 创建组件，可以把组件挂到一个临时的测试页面，**推荐使用对象传参**，e.g：使用 user 对象而不是 user_id,user_Nickname 等。
3. js 组件使用模块化语法，放在./services，最好做成纯函数
4. 很好的矢量图标库：https://icomoon.io/app/#/select
5. 很好的组件库：https://www.naiveui.com/zh-CN/os-theme/components/t

### LocalStrage 中维护的变量：

- token & authcode
- isLogin
- nickName: 用于存储离谱的{User}渲染
- userID: 用于好友界面
- userIDAndAvartarIDMap : {userid:[avartar<第几张>,存储时间]} 真是一个糟糕的变量名，搜索这个名称可以在附近查看到缓存时间

### native-ui

1. 为了 tree-shaking 优化，native-ui 不再全局整体注册，只是注册了几个常用组件，位于 main.ts
2. 也可以在单个组件内引入或者添加到全局注册

### ts 的使用

1. 不强求使用 ts（用 ts 的朋友也别太花哨了 2333），不过你书写 js 的时候可以获得不错的智能提示
2. 如果遇到响应式数据报错未定义，可以禁用插件 volar 使用别的插件（真有效。。。）
3. 有些错误提示可能本身并不存在，可试着刷新（格式化）文档，或者运行 npm run build，后者不报错就是没错误

### 数据渲染

1. 渲染函数位于./services，markdown 和 unity 文本的渲染均在此
2. 渲染出的 span 元素的样式统一定义于 index.html，涉及交互的元素，请在其父元素（上一级组件）上使用事件委托

### 待办

1. 作品列表（注意支持 tag,sort,day 天内作品 user）的筛选参数
2. 发布评论的组件
3. 用户信息的卡片
4. brief 作品的跳转
5. 富文本渲染还需要完善
6. 缓存优化（离线模式）：如 API 失败则默认返回上一次成功的 API 的结果
7. 好友界面
