<template>
  <div id="home">
    <Header :user="user" />
    <!-- 高度：50px定值 -->
    <main>
      <div class="block-container">
        <div class="block" id="actions">
          <Actions></Actions>
        </div>
        <div class="block" id="featured-and-activities">
          <BlockAndActivity :featured="featured"></BlockAndActivity>
        </div>
        <div class="block" id="knowledge">
          <Block :data="knowledgeItems" title="热门实验" type="experiments"></Block>
        </div>
        <div class="block" id="knowledge">
          <Block :data="knowledgeItems" title="知识库" type="experiments"></Block>
        </div>
        <div class="block" id="knowledge">
          <Block :data="knowledgeItems" title="最新作品" type="experiments"></Block>
        </div>
        <div class="block" id="knowledge">
          <Block :data="knowledgeItems" title="小作品" type="experiments"></Block>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Actions from "../components/Actions.vue";
import Header from "../components/headers/HomeHeader.vue";
import BlockAndActivity from "../components/BlockAndActivity.vue";
import Block from "../components/Block.vue";

const user = ref({
  coins: 15950,
  gems: 2683,
  level: 25,
  username: "小临",
  avatarUrl: "/static/experiments/images/6779/f4/d8/826568de4e986a53/0.jpg!block",
});

const featured = ref(
  new Array(3).fill({
    title: "WRS Predictor",
    author: "Aircrafter",
    date: "11/03",
    id: "6778a98d826568de4e9854d6",
  })
);

const knowledgeItems = ref(
  new Array(5).fill({
    tags: ["申请精选", "初中"],
    title: "RRR: 椭圆运算介绍",
    author: "帅气的作者作者",
    id: "6779f4d8826568de4e986a53",
  })
);
</script>

<style>
main {
  width: 100%;
  margin-top: 30px;
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
  min-width: max(150px,30%);
  max-width: 400px;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  height: 360px;
}
</style>