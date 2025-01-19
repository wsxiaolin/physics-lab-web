<template>
  <div id="upper_container">
    <div class="personal-info">
      <PersonalInfo
        :username="user.username"
        :user_id="user.user_id"
        :user_tag="user.user_tag"
        :count_following="user.count_following"
        :count_follower="user.count_follower"
        :count_projects="user.count_projects"
        :count_messages="user.count_messages"
      />
      <BasicInfoPopUp :username="user.username" :user_tag="user.user_tag" />
    </div>

    <div class="cummunity-selecting-container">
      <CommunitySelectingContainer
        :username="user.username"
        :user_id="user.user_id"
        :user_tag="user.user_tag"
        :count_following="user.count_following"
        :count_follower="user.count_follower"
        :count_projects="user.count_projects"
        :count_messages="user.count_messages"
      />
    </div>
  </div>
</template>

<script setup>
import PersonalInfo from "../components/user/PersonalInfo.vue";
import BasicInfoPopUp from "../components/user/BasicInfoPopUp.vue";
import CommunitySelectingContainer from "../components/user/CommunitySelectingContainer.vue";

const user = {
  username: "Bromine溴",
  user_id: "XXX",
  user_tag: "老用户",
  count_following: 999,
  count_follower: 999,
  count_projects: 9999,
  count_messages: 9999,
  signature: "我要成为BA高手!",
};
</script>

<style scoped>
#upper_container {
  margin: 20px;
  display: flex;
  flex-wrap: wrap;
  background-color: aqua;
}

.personal-info {
  width: 500px;
  max-width: 400px;
  min-width: 50%;
  height: calc(100vh - 80px);
  background-color: chartreuse;
  display: flex;
  flex-direction: column;
}
.cummunity-selecting-container {
  width: 500px;
  max-width: 400px;
  min-width: 50%;
  background-color: red;
}

@media (max-width: 600px) {
  .personal-info {
    height: 35vh;
  }
}
</style>
