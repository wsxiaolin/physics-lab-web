<script setup>
defineProps({
  username: String,
  user_id: String,
  user_tag: String,
  count_following: Number,
  count_follower: Number,
  count_projects: Number,
  count_messages: Number,
});
</script>

<template>
  <div id="CommunityInfoSelectBar">
    <div id="BarContainer">
      <div class="SelectBar" @click="handleProjectsClick">作品({{ count_projects }})</div>
      <div class="SelectBar" @click="handleMessagesClick">留言({{ count_messages }})</div>
      <div class="SelectBar" @click="handleFollowerFollowingClick">粉丝({{ count_follower }})</div>
    </div>
  </div>
</template>

<style scoped>
#BarContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.SelectBar {
  margin: 0 10px;
  padding: 10px;
}

.SelectBar {
  font-weight: 500;
  font-family: inherit;
  transition: border-color 0s;
  font-size: 1em;
  color: aliceblue;
}

.SelectBar:hover {
  color: black;
}
</style>
