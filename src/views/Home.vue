<template>
  <div id="home">
    <Header>
      <div class="user" @click="showModalFn">
        <img class="avatar" :src="user.avatarUrl" alt="Avatar" />
        <div class="user-info">
          <div class="username">{{ user.username }}</div>
          <div class="level">Level {{ user.level }}</div>
        </div>
        <div class="resources">
          <div class="resource">
            <img class="icon" src="/src/assets/icons/coins.png" alt="Coins" />
            <span>{{ user.coins }}</span>
          </div>
          <div class="resource">
            <img class="icon" src="/src/assets/icons/gems.png" alt="Gems" />
            <span>{{ user.gems }}</span>
          </div>
        </div>
      </div>
    </Header>
    <!-- 高度：50px定值 -->
    <main>
      <div class="block-container">
        <div class="block" id="actions">
          <Actions></Actions>
        </div>
        <div class="block">
          <BlockAndActivity
            :projects="featured"
            projectsName="精选实验"
            activityBackground="src/assets/support.png"
            activityName="每日活动"
          ></BlockAndActivity>
        </div>
        <div class="block">
          <Block :data="popularItems" title="热门实验" blockType="experiments"></Block>
        </div>
        <div class="block">
          <Block :data="knowledgeItems" title="知识库" blockType="experiments"></Block>
        </div>
        <div class="block">
          <Block :data="newestItems" title="最新作品" blockType="experiments"></Block>
        </div>
        <div class="block">
          <Block :data="smallItems" title="小作品" blockType="experiments"></Block>
          <!-- 紫兰斋的翻译确实是small -->
        </div>
      </div>
    </main>
    <n-modal v-model:show="showModal" style="border-radius: 10px">
      <n-card style="width: 400px">
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="登录">
            <n-form :show-label="false">
              <n-form-item-row>
                <n-input
                  v-model:value="username"
                  class="inputArea"
                  placeholder="邮箱 / 手机"
                  clearable
                >
                  <template #suffix>
                    <img src="/src/assets/login/icon-login.png" width="15px" />
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  v-model:value="password"
                  show-password-on="click"
                  class="inputArea"
                  placeholder="密码 6~20 位"
                  type="password"
                  clearable
                >
                </n-input>
              </n-form-item-row>
              <input type="checkbox" v-model="memoryMe" />
              <label>记住我</label>
              <p style="color: red; font-size: small" v-if="memoryMe">
                注意：您的密码将会明文存储在本地浏览器中
              </p>
            </n-form>
            <n-button type="primary" class="loginButton" @click="userLogin"> 确认 </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <h3 align="center">暂不开放注册功能</h3>
            <n-form>
              <n-form-item-row label="用户名">
                <n-input />
              </n-form-item-row>
              <n-form-item-row label="密码">
                <n-input />
              </n-form-item-row>
              <n-form-item-row label="重复密码">
                <n-input />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong disabled> 注册 </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-modal>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Actions from "../components/Actions.vue";
import Header from "../components/utils/Header.vue";
import BlockAndActivity from "../components/BlockAndActivity.vue";
import Block from "../components/Block.vue";
import { login } from "../services/getData";
import Footer from "../components/Footer.vue";
import { NButton, NModal, NForm, NInput } from "naive-ui";

let showModal = ref(false);

// 默认配置
let user = ref({
  coins: 12345,
  gems: 12345,
  level: 12,
  username: "点击登录",
  avatarUrl: "/src/assets/user/default-avatar.png",
});
let featured = ref(
  new Array(3).fill({
    Tags: ["申请精选", "初中"],
    Subject: "RRR: 椭圆运算介绍",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
  })
);
let knowledgeItems = ref(
  new Array(5).fill({
    Tags: ["申请精选", "初中"],
    Subject: "RRR: 椭圆运算介绍",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
  })
);
let popularItems = ref(
  new Array(5).fill({
    Tags: ["申请精选", "初中"],
    Subject: "RRR: 椭圆运算介绍",
    User: {
      ID: "6779f4d8826566de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
  })
);
let newestItems = ref(
  new Array(5).fill({
    Tags: ["申请精选", "初中"],
    Subject: "RRR: 椭圆运算介绍",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小小",
    },
    ID: "6779f4d8826568de4e986a53",
  })
);
let smallItems = ref(
  new Array(5).fill({
    Tags: ["申请精选", "初中"],
    Subject: "RRR: 椭圆运算介绍",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
  })
);

// 是屎山，慎改！_login为登录操作，userlogin为用户发出的登录操作，login为默认的登录操作
async function _login(u, p) {
  const loginResponse = await login(u, p);
  if (loginResponse.Status != 200) {
    window.$message.error(loginResponse.Message);
    localStorage.setItem("loginStatus", false);
    await _login(null, null);
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    return;
  }
  if (memoryMe.value == false) {
    // 可行
    localStorage.removeItem("username");
    localStorage.removeItem("password");  
    localStorage.setItem("loginStatus", false);
  }
  const _user = loginResponse.Data.User;
  user.value = {
    coins: _user.Gold,
    gems: _user.Diamond,
    level: _user.Level,
    username: _user.Nickname || "点击登录",
    avatarUrl: computed(() => {
      if (_user.Avatar === 0) return "/src/assets/user/default-avatar.png"; //默认头像
      return `/static/users/avatars/${_user.ID.slice(0, 4)}/${_user.ID.slice(
        4,
        6
      )}/${_user.ID.slice(6, 8)}/${_user.ID.slice(8, 24)}/${_user.Avatar}.jpg!small.round`;
    }),
  };

  const blocks = loginResponse.Data.Library.Blocks;
  featured.value = blocks[1].Summaries.slice(0, 3);
  popularItems.value = blocks[2].Summaries.slice(0, 5);
  knowledgeItems.value = blocks[3].Summaries.slice(0, 5);
  newestItems.value = blocks[4].Summaries.slice(0, 5);
  smallItems.value = blocks[5].Summaries.slice(0, 5);
}
onMounted(async () => {
  if (localStorage.getItem("loginStatus") != null) window.$message.loading("正在连接，可能需要一些时间");
  await _login(localStorage.getItem("username") || null, localStorage.getItem("password") || null);
});

function showModalFn() {
  localStorage.getItem("loginStatus") != "true" && (showModal.value = true);
}

const username = ref("");
const password = ref("");

async function userLogin() {
  window.$message.loading("正在登录请稍候", { duration: 3e3 });
  await _login(username.value, password.value);
  showModal.value = false;
}

const memoryMe = ref(false);
</script>

<style scoped>
main {
  width: 100%;
  margin-top: 30px;
}

#home {
  margin-bottom: 70px;
  /* 防止底部导航栏覆盖 */
}

.block-container {
  padding-top: 30px;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  gap: 20px;
  justify-content: space-between;
  height: auto;
  margin: 4vw;
}

.block {
  flex: 1 1 200px;
  min-width: max(150px, 30%);
  max-width: 400px;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  height: 360px;
}

.user {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  flex-grow: 1;
  padding-left: 10px;
}

.username {
  white-space: nowrap;
  text-align: center;
}

.level {
  color: #777;
  white-space: nowrap;
}

.resources {
  display: flex;
  align-items: center;
}

.resource {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-left: 5px;
}

.inputArea {
  margin: 1%;
  padding: 0;
  border-radius: 10px;
}

.loginButton {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 10px;
}
</style>
