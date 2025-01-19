<script setup lang="ts">
import PersonalInfo from './components/PersonalInfo.vue';
import BasicInfoPopUp from './components/BasicInfoPopUp.vue';
import CommunitySelectingContainer from './components/CommunitySelectingContainer.vue';

</script>

<template>
  <div id="upper_container">
    <PersonalInfo
      username= "Bromine溴"
      user_id= "XXX"
      user_tag= "老用户"
      count_following= 999
      count_follower= 999
      count_projects= 9999
      count_messages= 9999
    />
    <BasicInfoPopUp
      username= "Bromine溴"
      user_id= "XXX"
      user_tag= "老用户"
      count_following= 999
      count_follower= 999
      count_projects= 9999
      count_messages= 9999
      id_signature= "我要成为BA高手!" 
    />
    <CommunitySelectingContainer
      username= "Bromine溴"
      user_id= "XXX"
      user_tag= "老用户"
      count_following= 999
      count_follower= 999
      count_projects= 9999
      count_messages= 9999
    />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
