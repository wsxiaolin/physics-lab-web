<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  username: string;
  user_id: string;
  user_tag: string;
  count_following: int;
  count_follower: int;
  count_projects: int;
  count_messages: int;
}>();
</script>

<template>
  <div id="go_back">
    <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
      <g>
        <ellipse
          ry="25"
          rx="25"
          id="svg_5"
          cy="24.94019"
          cx="25"
          stroke-width="2"
          fill="#BBBBBB"
        />
        <ellipse
          ry="0.2038"
          rx="0.2038"
          id="svg_6"
          cy="20.61135"
          cx="41.10052"
          stroke-width="2"
          fill="#666666"
        />
        <line
          stroke-width="3"
          stroke-linecap="undefined"
          stroke-linejoin="undefined"
          id="svg_2"
          y2="15"
          x2="30"
          y1="25"
          x1="20"
          stroke="#ffffff"
          fill="none"
        />
        <line
          transform="rotate(90 24.9321 30)"
          stroke-width="3"
          stroke-linecap="undefined"
          stroke-linejoin="undefined"
          id="svg_3"
          y2="25"
          x2="30"
          y1="35"
          x1="19.86413"
          stroke="#ffffff"
          fill="none"
        />
        <path
          transform="rotate(45 19.9084 24.9825)"
          id="svg_8"
          d="m19.4084,24.5449l1,0l0,0.87515l-1,0l0,-0.87515z"
          opacity="undefined"
          stroke-width="2"
          stroke="#ffffff"
          fill="none"
        />
      </g>
    </svg>
  </div>
  <h1>
    <strong>{{ username }}</strong>
    <!--用户名-->
  </h1>
  <ul id="title_bar">
    <!--用户名底下的用户标签、关注和粉丝-->
    <li>
      <div id="title_bar_user_tag">
        <button type="text" style="color: cyan">
          {{ user_tag }}
        </button>
      </div>
    </li>
    <li>
      <div id="title_bar_following">
        <button type="button" @click="jump_to_following()">
          关注 {{ count_following }}
        </button>
      </div>
    </li>
    <li>
      <div id="title_bar_follower">
        <button type="button" @click="jump_to_follower()">
          粉丝 {{ count_follower }}
        </button>
      </div>
    </li>
  </ul>
</template>

<style scoped>
#go_back {
  height: 50px;
  position: absolute;
  top: 5px;
  left: 10px;
}
#title_bar {
  position: absolute;
  top: 100px;
  left: 15px;
  width: 90%;
  list-style-type: none;
  margin: 5;
  padding: 0;
  display: flex;
}
h1 {
  position: absolute;
  top: 55px;
  left: 15px;
  height: 25px;
  font-size: 25px;
  font-family: YouYuan;
}
#title_bar_user_tag {
  position: absolute;
  -top: 50px;
  margin-left: 0px;
  width: auto;
  font-size: 7.5px;
  font-family: YouYuan;
  flex: 1;
}
#title_bar_following {
  position: absolute;
  margin-left: 65px;
  -top: 50px;
  width: auto;
  font-size: 7.5px;
  flex: 1;
  font-family: YouYuan;
}
#title_bar_follower {
  position: absolute;
  margin-left: 140px;
  -top: 50px;
  width: auto;
  font-size: 7.5px;
  flex: 1;
  font-family: YouYuan;
}
</style>
