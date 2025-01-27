<template>
  <Header>
    <h1>通知</h1>
  </Header>
  <main>
    <div class="outer">
      <n-tabs type="line" class="list" animated>
        <n-tab-pane name="全部" tab="全部" style="padding: 0;">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI=0></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="系统消息" tab="系统消息">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI=1></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="回复和评论" tab="回复和评论">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI=2></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="关注和粉丝" tab="关注和粉丝">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI=3></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="作品" tab="作品">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI=4></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="管理通知" tab="管理通知">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI=5></NotificationList>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </main>
  <Footer></Footer>
</template>

<script setup lang="ts">
import NotificationList from "../components/messages/NotificationList.vue";
import Header from "../components/utils/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<style scoped>
.list {
  height: calc(100vh - 120px);
  margin-top: 60px;
}

.outer{
margin-left: 2vh;
}
.item {
  margin-top: -60px;
}
</style>
