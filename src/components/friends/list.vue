<template>
  <div class="user-list">
    <n-infinite-scroll style="height: 500px" :distance="0" @load="handleLoad">
      <n-grid :cols="cols || 2">
        <n-gi v-for="user in relations" :key="user.User.ID">
          <UserItem :user="user.User" />
        </n-gi>
      </n-grid>
    </n-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import UserItem from "./item.vue";
import { NInfiniteScroll, NGrid, NGi } from "naive-ui";
import { ref } from "vue";
import { getData } from "../../services/getData";

const { userid, type } = defineProps({
  userid: String,
  type: String,
  cols: Number,
});

let relations = ref<any>([]);

let skip = 0;
let isLoadEnd = false;

async function handleLoad() {
  if (isLoadEnd) {
    window.$message.warning("没有更多了");
    return;
  }
  const getRelationsRes = await getData("/Users/GetRelations", {
    UserID: userid,
    DisplayType: type,
    Skip: skip,
    Take: 24,
    Query: "",
  });
  if (getRelationsRes.Data.$values.length < 24) {
    isLoadEnd = true;
  }
  console.log(getRelationsRes.Data);
  skip += 24;
  relations.value.push(...getRelationsRes.Data.$values);
}

handleLoad();
</script>

<style scoped>
.user-list {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #ccc3;
  width: 100vw;
}
</style>
