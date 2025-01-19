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
  <div id="go_back">
    <div class="btn">
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
            stroke-width="2"
            stroke="#ffffff"
            fill="none"
          />
        </g>
      </svg>
    </div>
  </div>

  <div class="user_name">
    <div>{{ username }}</div>
  </div>

  <div class="title_bar">
    <div id="title_bar_user_tag">{{ user_tag }}</div>
    <div id="title_bar_following">Following {{ count_following }}</div>
    <div id="title_bar_follower">Follower {{ count_follower }}</div>
  </div>
</template>

<style scoped>
#go_back {
  display: flex;
}

.title_bar {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.user_name {
  display: flex;
  height: 20px;
}

.user_name div {
  font-family: YouYuan;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  color: aliceblue;
}

.title_bar {
  display: flex;
  padding-left: 20px;
}

#title_bar_user_tag,
#title_bar_following,
#title_bar_follower {
  background-color: rgba(70, 70, 70, 0.3);
  padding: 3px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: bold;
}

#title_bar_user_tag {
  color: aquamarine;
}
</style>
