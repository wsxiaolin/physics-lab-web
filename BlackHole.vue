<template>
  <div id="blackhole">
    <Header>
      <h1>黑洞</h1>
    </Header>
    <!-- 高度：50px定值 -->
    <main>
      <div class="block-container">
        <div class="block" id="announcement" ref="announcementRef">
          <BlockAndActivity
            :projects="announcement"
            projectsName="物实公告"
            activityBackground="src/assets/mechanics.png"
            activityName="网页版讨论区"
            :activityProc="goToWebCommunity"
          ></BlockAndActivity>
        </div>

        <div class="block" id="featured">
          <BlockAndActivity
            :projects="featured"
            projectsName="黑洞区精选"
            activityBackground="https://dummyimage.com/300x80"
            activityName="参与开发"
          ></BlockAndActivity>
        </div>

        <div class="block" id="popular">
          <Block :data="popularItems" title="热门实验" blockType="experiments"></Block>
        </div>
        <div class="block" id="newest">
          <Block :data="newestItems" title="最新作品" blockType="experiments"></Block>
        </div>
        <div class="block" id="knowledge">
          <Block :data="knowledgeItems" title="黑洞知识库" blockType="experiments"></Block>
        </div>
        <div class="block" id="qa">
          <Block :data="qa" title="问与答" blockType="experiments"></Block>
        </div>
        <div class="block" id="academic" ref="academicRef">
          <Block :data="academic" title="学术讨论" blockType="experiments"></Block>
        </div>

        <div class="block" id="small" ref="smallRef">
          <Block :data="smallItems" title="小作品" blockType="experiments"></Block>
        </div>
      </div>
    </main>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import Header from "../components/utils/Header.vue";
import BlockAndActivity from "../components/BlockAndActivity.vue";
import Block from "../components/Block.vue";
import Footer from "../components/Footer.vue";
import { getData } from "../services/getData";
import type { Ref } from 'vue';

const goToWebCommunity = () => {
  window.open("https://pl.turtlesim.com");
};

// 默认作品
let announcement = ref(
  new Array(3).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);
let featured = ref(
  new Array(3).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);
let knowledgeItems = ref(
  new Array(5).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);

let popularItems = ref(
  new Array(5).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);
let newestItems = ref(
  new Array(5).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);
let smallItems = ref(
  new Array(5).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);
let qa = ref(
  new Array(5).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);

let academic = ref(
  new Array(3).fill({
    Tags: ["正在加载"],
    Subject: "Loading...",
    User: {
      ID: "6779f4d8826568de4e986a53",
      NickName: "小临",
    },
    ID: "6779f4d8826568de4e986a53",
    Category: "Discussion",
    Image: 0,
  })
);

// 是屎山，别动！！！！
const announcementRef: Ref<HTMLElement | null> = ref(null);
const smallRef: Ref<HTMLElement | null> = ref(null);
const academicRef: Ref<HTMLElement | null> = ref(null);

const updateBoxWidth = () => {
  if (announcementRef.value) {
    const width = announcementRef.value.getBoundingClientRect().width;
    // 更新样式
    if (smallRef.value) {
      smallRef.value.style.minWidth = `${width}px`;
      smallRef.value.style.maxWidth = `${width}px`;
    }
    if (academicRef.value) {
      academicRef.value.style.minWidth = `${width}px`;
      academicRef.value.style.maxWidth = `${width}px`;
    }
  }
};
onMounted(async () => {
  await nextTick();
  updateBoxWidth();
  window.addEventListener("resize", updateBoxWidth);
  window.$message.loading("正在加载...");
  const library = await getData("/Contents/GetLibrary", {
    Identifier: "Discussions",
    Language: "Chinese",
  });
  const blocks = library.Data.Blocks;
  announcement.value = blocks[0].Summaries.slice(0, 3);
  featured.value = blocks[1].Summaries.slice(0, 3);
  popularItems.value = blocks[2].Summaries.slice(0, 5);
  newestItems.value = blocks[3].Summaries.slice(0, 5);
  knowledgeItems.value = blocks[4].Summaries.slice(0, 5);
  qa.value = blocks[5].Summaries.slice(0, 5);
  academic.value = blocks[6].Summaries.slice(0, 5);
  smallItems.value = blocks[7].Summaries.slice(0, 5);
});
</script>

<style scoped>
main {
  width: 100%;
  margin-top: 30px;
}

#blackhole {
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
  height: auto;
}

#small {
  margin-right: auto;
}
</style>
