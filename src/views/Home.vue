<template>
  <div id="home">
    <Header>
      <div class="user">
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


// 默认作品
let user = ref({
  coins: 15950,
  gems: 2683,
  level: 25,
  username: "小临",
  avatarUrl: "/static/experiments/images/6779/f4/d8/826568de4e986a53/0.jpg!block",
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
      ID: "6779f4d8826568de4e986a53",
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
      NickName: "小临",
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

onMounted(async () => {
  window.$message.loading("正在连接请稍候", { duration: 3e3 });
  const loginResponse = await login(null, null);
  const _user = loginResponse.Data.User;
  user.value = {
    coins: _user.Gold,
    gems: _user.Diamond,
    level: _user.Level,
    username: _user.Nickname || "点击登录",
    avatarUrl: computed(() => {
      if (_user.Avatar === 0)
        return "/src/assets/user/default-avatar.png"; //默认头像
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
});
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
</style>
