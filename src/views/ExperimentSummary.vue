<template>
  <div style="position: absolute; width: 100%; height: 100%; overflow: hidden;">
    <!-- 封面与文字简介的比例也许还可以调一下？我现在没尺子 -->
    <div class="cover">
      <img :src="coverUrl" onerror="this.src='/src/assets/icons/white.png'" style="width: 100%; height: 100%;">
      <img src="/src/assets/library/Navigation-Return.png" style="position: absolute; top: 5px; left: 5px;"></img>
      <h2 style="position: absolute; top: 15%; left: 15%;">{{ data.Subject }}</h2>
      <!-- 这个按钮丑死了，相信故事一定有办法拯救的2333 -->
      <button disabled
        style="position: absolute; left: 10%; background-color: #007bff; bottom: 10%; height: 5%; width: 80%; border-radius: 10px;">
        进入实验
      </button>
      <!-- [故事查看后可删除] 已经有查看评论的ui了，就没必要再做一个查看评论的按钮了 -->
    </div>
    <n-tabs class="context" v-model:value="selectedTab" type="segment">
      <n-tab-pane name="Intro" tab="简介">
        <div style="position: absolute; width: 94%; left: 3%; height: 100%;">
          <div style="display: flex; flex-direction: column; width: 100%; height: 100%;">
            <div style="display: flex; height: 65px; background-color: white; border-radius: 10px;">
              <img :src="avatarUrl" style="margin-left: 1%; height: 90%; border-radius: 50%;">
              <div style="margin-left: 10px; text-align: left;">
                <p style="color: #007bff; margin: 5%; width: 100%;">{{ data.User.Nickname }}</p>
                <p style="color: gray; margin: 5%; width: 100%;">{{ data.User.Signature }}</p>
              </div>
            </div>
            <div style="flex-grow: 1; margin-top: 3%; background-color: white; border-radius: 10px;">
              <h2 style="color: #007bff; text-align: left; margin-left: 5px; margin-top: 2px; margin-bottom: 2px;">实验介绍</h2>
              <div style="position: absolute; left: 3%; width: 94%; height: 90%;">
                <p style="text-align: left;" v-for="(item, index) in data.Description" :key="index">{{ item }}</p>
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Comment" :tab="`评论(${data.Comments})`">
        <!-- 听说故事已经把消息渲染做好了 -->
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getData } from '../services/getData';
import { NTabs, NTabPane } from "naive-ui";

const selectedTab = ref("Intro");

const route = useRoute();

const coverUrl = computed(
  () =>
    `/static/experiments/images/${route.params.id.slice(0, 4)}/${route.params.id.slice(
      4,
      6
    )}/${route.params.id.slice(6, 8)}/${route.params.id.slice(8, 24)}/${route.params.image}.jpg!block`
);

const avatarUrl = computed(
  () =>
    `/static/users/avatars/${data.value.User.ID.slice(0, 4)}/${data.value.User.ID.slice(
      4,
      6
    )}/${data.value.User.ID.slice(6, 8)}/${data.value.User.ID.slice(8, 24)}/${data.value.User.Avatar}.jpg!small.round`
);

const data = ref({
    Type: 0,
    ParentID: null,
    ParentName: null,
    ParentCategory: null,
    ContentID: 'b12dfc441cea2f2d493340a1',
    Editor: null,
    Coauthors: [],
    Description: [
        'physicsLab目前是我主要在维护的一个Python Package，你可以使用该命令来下载：',
        'pip install physicsLab',
        '当然，你也可以直接从我的仓库拉取代码：',
        'git clone https://gitee.com/script2000/physicsLab.git',
        '',
        '正如封面所见，physicsLab的核心功能就是提供用Python在物实做实验的api。',
        '',
        '核心原理是修改存档与调用物实网络api。',
        '',
        '（鉴于我已经在gitee上写了很多东西，所以推荐大家到我的gitee仓库上去看：',
        'https://gitee.com/script2000/physicsLab/tree/master',
        '）',
        '',
        '未来可能会为这个讨论添加更多的东西',
        '',
        '同时欢迎有能力的各位使用physicsLab，提issue，甚至成为contributor！',
        '',
        '<a>听说你想注入?</a>',
        '<b>粗体</b>',
        '<i>斜体</i>',
        '<color=#ff0000>颜色字</color>',
    ],
    LocalizedDescription: null,
    Tags: ['Type-0', '交流', '禁止改编'],
    Visits: 832,
    Stars: 21,
    Supports: 10,
    Remixes: 0,
    Comments: 66,
    Price: 0,
    Popularity: 2072,
    ID: '642cf37a494746375aae306a',
    Category: 'Discussion',
    Subject: 'physicsLab：用Python在物实做实验',
    LocalizedSubject: null,
    Image: 0,
    ImageRegion: 0,
    User: {
        ID: '62d3fd092f3a2a60cc8ccc9e',
        Nickname: 'Arendelle',
        Signature: '@goodenough 是我大号',
        Avatar: 7,
        AvatarRegion: 0,
        Decoration: 0,
        Verification: 'Volunteer'
    },
    Visibility: 0,
    Settings: {},
    Multilingual: false
});

onMounted(async () => {
  try {
    data.value = await getData(`/Contents/GetSummary`, {
      ContentID: route.params.id,
      Category: route.params.category,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  if (data.value.Status != 200) {
    console.error('Error fetching data:', error);
  }
  data.value = data.value.Data;
});

</script>

<style>

.cover {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}

.context {
  position: absolute;
  bottom: 0;
  right: 0;
  object-fit: cover;
  background-color: lightgray;
}

/* width > height
 */
@media (min-aspect-ratio: 1/1) {
  .cover {
    width: 50%;
    height: 100vh;
  }

  .context {
    width: 50%;
    height: 100vh;
  }
}

/* width < height
 */
@media (max-aspect-ratio: 1/1) {
  .cover {
    width: 100vw;
    height: 50vh;
  }

  .context {
    width: 100vw;
    height: 50vh;
  }
}

</style>
