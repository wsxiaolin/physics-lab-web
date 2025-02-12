<template>
  <div id="notification_container" @click="handleReply">
    <div class="img">
      <img
        :src="avatar_url"
        id="avatar"
        onerror="this.src='/src/assets/user/default-avatar.png'"
        @click="showUserCard(userID as string)"
      />
    </div>
    <div id="notification" class="notification">
      <div id="notification_title" class="notification_title">
        {{ msg_title }}
      </div>
      <div id="notification_message" class="notification_message" @click="handleClick">
        <div
          id="notification_text"
          class="notification_text"
          v-html="parse(msg as string,true)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import parse from "../../services/advancedParser.ts";
import showUserCard from "../../popup/usercard.ts";

// 解构传递的props
const { id, userID } = defineProps({
  avatar_url: String,
  msg: String,
  msg_title: String,
  id: String,
  userID: String,
});

// 用于回复
const emit = defineEmits(["msgClick"]);

const handleReply = () => {
  emit("msgClick", id);
};

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("RUser")) {
    alert(target.dataset.user);
  }
};
</script>

<style scoped>
#notification_container {
  height: fit-content;
  padding: 5px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  background: white;
}

#notification_container:hover {
  background-color: #f0f0f0;
}

#avatar {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

#avatar::after {
  content: "";
  mix-blend-mode: luminosity;
}

#notification {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

#notification_icon {
  width: 20px;
  height: 20px;
  top: 2px;
  background-color: transparent;
  display: flex;
}

#notification_title {
  font-size: 1em;
  margin-right: auto;
  font-weight: 700;
  white-space: nowrap;
}

#notification_message {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

#notification_text {
  font-size: 1em;
  text-align: left;
  height: fit-content;
  /* overflow-wrap: break-word; */
  max-width: 100%;
  white-space: wrap;
  overflow: hidden;
  text-overflow: hidden;
}

#icon {
  height: 16px;
  width: 16px;
}

#notification_container:hover {
  background-color: #f0f0f0;
}
</style>
../../services/advancedParser.ts
