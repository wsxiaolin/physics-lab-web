<template>
  <div class="container">
    <div
      class="cover"
      :style="{
        backgroundImage: `url(${coverUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }"
    >
      <div style="text-align: left">
        <img src="/src/assets/library/Navigation-Return.png" style="width: 2.7em" @click="goBack" />
        <div style="color: white; font-size: 1.6em; text-align: left">{{ data.Subject }}</div>
        <Tag :tag="route.params.category" style="color: aquamarine; font-weight: bold"></Tag>
        <Tag v-for="(tag, index) in data.Tags" :key="index" :tag="tag"></Tag>
      </div>
      <div style="margin-top: auto">
        <div id="gap"></div>
        <!-- 占位符 -->
        <!-- <div>收藏</div>
        <div>支持</div> -->

        <div
          class="btns"
          style="display: flex; justify-content: center; justify-content: space-around"
        >
          <n-button type="info" strong round disabled style="padding: 10px 10%; width: 80%">
            进入实验
          </n-button>
        </div>
      </div>
    </div>

    <div style="text-align: center" class="context">
      <n-tabs v-model:value="selectedTab" type="segment">
        <n-tab-pane name="Intro" tab="简介">
          <div style="width: 94%; margin: 0 auto 20px auto; height: 100%">
            <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
              <div
                style="display: flex; height: 65px; background-color: white; border-radius: 10px"
              >
                <img :src="avatarUrl" style="margin: auto 10px; height: 90%; border-radius: 50%" onerror="this.src='/src/assets/user/default-avatar.png'"/>
                <div style="text-align: left">
                  <p style="color: #007bff; margin: 5%; width: 100%">{{ data.User.Nickname }}</p>
                  <p style="color: gray; margin: 5%; width: 100%">{{ data.User.Signature }}</p>
                </div>
              </div>
              <div
                style="
                  flex-grow: 1;
                  margin-top: 3%;
                  background-color: white;
                  border-radius: 10px;
                  padding: 10px;
                "
              >
                <h2 style="color: #007bff; text-align: left; margin-top: 2px; margin-bottom: 2px">
                  实验介绍
                </h2>
                <div style="left: 3%; width: 94%; height: 90%">
                  <p
                    style="text-align: left"
                    v-for="(item, index) in data.Description"
                    :key="index"
                    v-html="parse(item)"
                    @click="handleLinkClick"
                  ></p>
                  <div style="font-weight: bold; text-align: left">字数统计：自己数</div>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="Comment" :tab="`评论(${data.Comments})`">
          <div>
            <MessageList
              :ID="route.params.id"
              :Category="route.params.category"
              :upDate="upDate"
              @msgClick="handleMsgClick"
            ></MessageList>
            <div class="sendComment">
              <n-input
                v-model:value="comment"
                style="text-align: left;"
                type="text"
                placeholder="发布一条友善的言论"
                show-count
                :maxlength="40"
                @keyup.enter="handleEnter"
                :loading="isLoading"
              />
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getData } from "../services/getData";
import { NTabs, NTabPane } from "naive-ui";
import Tag from "../components/utils/TagLarger.vue";
import MessageList from "../components/messages/MessageList.vue";
import parse from "../services/richTextParser";

let comment = ref("");
let isLoading = ref(false); // 新增 loading 状态
let upDate = ref(1);
let replyID = "";

const selectedTab = ref("Intro");

const route = useRoute();

const coverUrl = computed(
  () =>
    `/static/experiments/images/${route.params.id.slice(0, 4)}/${route.params.id.slice(
      4,
      6
    )}/${route.params.id.slice(6, 8)}/${route.params.id.slice(8, 24)}/${data.Image || 0}.jpg!full`
);

const avatarUrl = computed(
  () =>
    `/static/users/avatars/${data.value.User.ID.slice(0, 4)}/${data.value.User.ID.slice(
      4,
      6
    )}/${data.value.User.ID.slice(6, 8)}/${data.value.User.ID.slice(8, 24)}/${
      data.value.User.Avatar
    }.jpg!small.round`
);

const data = ref({
  Type: 0,
  ParentID: null,
  ParentName: null,
  ParentCategory: null,
  ContentID: "b12dfc441cea2f2d493340a1",
  Editor: null,
  Coauthors: [],
  Description: [
    "physicsLab目前是我主要在维护的一个Python Package，你可以使用该命令来下载：",
    "pip install physicsLab",
    "当然，你也可以直接从我的仓库拉取代码：",
    "git clone https://gitee.com/script2000/physicsLab.git",
    "",
    "正如封面所见，physicsLab的核心功能就是提供用Python在物实做实验的api。",
    "",
    "核心原理是修改存档与调用物实网络api。",
    "",
    "（鉴于我已经在gitee上写了很多东西，所以推荐大家到我的gitee仓库上去看：",
    "https://gitee.com/script2000/physicsLab/tree/master",
    "）",
    "",
    "未来可能会为这个讨论添加更多的东西",
    "",
    "同时欢迎有能力的各位使用physicsLab，提issue，甚至成为contributor！",
    "",
    "<a>听说你想注入?</a>",
    "<b>粗体</b>",
    "<i>斜体</i>",
    "<color=#ff0000>颜色字</color>",
  ],
  LocalizedDescription: null,
  Tags: ["Type-0", "交流", "禁止改编"],
  Visits: 832,
  Stars: 21,
  Supports: 10,
  Remixes: 0,
  Comments: 66,
  Price: 0,
  Popularity: 2072,
  ID: "642cf37a494746375aae306a",
  Category: "Discussion",
  Subject: "physicsLab：用Python在物实做实验",
  LocalizedSubject: null,
  Image: 0,
  ImageRegion: 0,
  User: {
    ID: "62d3fd092f3a2a60cc8ccc9e",
    Nickname: "Arendelle",
    Signature: "@goodenough 是我大号",
    Avatar: 7,
    AvatarRegion: 0,
    Decoration: 0,
    Verification: "Volunteer",
  },
  Visibility: 0,
  Settings: {},
  Multilingual: false,
});

onMounted(async () => {
  try {
    data.value = await getData(`/Contents/GetSummary`, {
      ContentID: route.params.id,
      Category: route.params.category,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  if (data.value.Status != 200) {
    console.error("Error fetching data:", error);
  }
  data.value = data.value.Data;
});

function handleMsgClick(item) {
  replyID = item.userID;
  comment.value = `回复@${item.msg_title}: `;
}
// 新增方法：处理回车键按下事件
const handleEnter = async () => {
  isLoading.value = true; // 设置 loading 状态为 true
  const sendCommentResponse = await getData("/Messages/PostComment", {
    TargetID: route.params.id,
    TargetType: route.params.category,
    Content: comment.value || "",
    ReplyID: replyID || "",
    Language: "from web",
    Special: null,
  });
  if (sendCommentResponse.Status == 200) {
    comment.value = "";
    upDate.value = Math.random();
  } else {
    window.$message.error(sendCommentResponse.Message);
  }
  isLoading.value = false;
};

// 新增方法：返回上一页
const goBack = () => {
  window.history.back();
};
</script>

<style>
.container {
  height: 100dvh;
  width: 100dvw;
  display: flex;
  box-sizing: border-box;
}

.cover {
  object-fit: cover;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.context {
  overflow: scroll;
  background-color: lightgray;
  flex: 1;
  box-sizing: border-box;
}

/* width > height
 */
@media (min-aspect-ratio: 1/1) {
  .cover {
    /* width: 50%; */
    height: 100%;
  }
  .context {
    /* width: 50%; */
    height: 100%;
  }
  .container {
    flex-direction: row;
  }
  .sendComment {
    width: 50%;
  }
  #gap {
    height: 20vh;
  }
}

/* width < height
 */
@media (max-aspect-ratio: 1/1) {
  .cover {
    /* height: 30vh; */
    flex: 1;
  }
  #gap {
    height: 5vh;
  }
  .context {
    /* height: 60%; */
    flex: 2;
  }
  .container {
    flex-direction: column;
  }
  .sendComment {
    width: 100dvw;
  }
}

.sendComment {
  height: 40px;
  position: absolute;
  background-color: #ddd;
  bottom: 0;
  box-sizing: border-box;
  padding: 2px 20px;
}
</style>