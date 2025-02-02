<template>
  <div class="container" @click="close" :style="{ zIndex: 100 }">
    <div class="user">
      <div class="user-info">
        <img :src="avatar" alt="User Avatar" class="avatar" />
        <p class="username">{{ name }}</p>
        <p class="snt">{{ snt }}</p>
      </div>
      <div class="stats">
        <div class="stat-item">
          <span>关注 {{ followingCount }}</span>
        </div>
        <div class="stat-item">
          <span>粉丝 {{ followerCount }}</span>
        </div>
      </div>
      <div class="data">
        <div class="num">
          <div>{{postCount}}</div>
          <div>{{postCount}}</div>
          <div>{{postCount}}</div>
        </div>
        <div class="num">
          <img src="/src/assets/library/Icon-Star.png" style="filter: brightness(0.9);height:25px"  />
          <img src="/src/assets/library/Icon-Star.png" style="filter: brightness(0.9);height:25px"  />
          <img src="/src/assets/library/Icon-Star.png" style="filter: brightness(0.9);height:25px"  />
        </div>
        
      </div>
      <button class="follow-button" > 关注用户</button>
    </div>
  </div>
</template>

<script setup>
let { name,userid, snt, avatar, followingCount, followerCount, postCount, close } = defineProps({
  userid: String,
  snt: String,
  avatar: String,
  followingCount: Number,
  followerCount: Number,
  postCount: Number,
  close: Function,
  name: String
});
</script>

<style scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

.user {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 5px;
}

.username {
  font-size: 1.5em;
  margin: 5px;
}

.snt {
  font-size: 1em;
  color: #666;
  margin: 5px;
}

.stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.data{
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.num{
  display: flex;
  font-size: 1.2em;
  flex-direction: row;
  justify-content: space-around;
}



.follow-button {
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
