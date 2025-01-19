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
    <div id="CommunityInfoSelectBar">
        <ul id=BarContainer>
            <li>
                <button type="button" id="Projects" class="SelectBar">
                    作品({{count_projects}})
                </button>
            </li>
            <li>
                <button type="button" id="Messages" class="SelectBar">
                    留言({{count_messages}})
                </button>
            </li>
            <li>
                <button type="button" id="Follower_Following" class="SelectBar" style="">
                    粉丝({{count_follower}})
                </button>
            </li>
        </ul>
    </div>
</template>
<style scoped>
    #BarContainer {
        list-style-type: none;
        display: flex;
        z-index: 25;
    }
    li:active {  
        background-color: #4CAF50;
    }  
    .SelectBar {
        background-color: white;
        border-radius: 0px;
        border: 1px solid transparent;
        padding: 0em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: border-color 0s;
    }
    .SelectBar button {
        color: #eee;
    }
    .SelectBar button:hover {
        border-color: white;
        color: white;
    }
    #Projects {
        position: absolute;
        top: 55%;
        left: 20%;
        width: 20%;
        font-size: 10px;
    }
    #Messages {
        position: absolute;
        top: 55%;
        left: 40%;
        width: 20%;
        font-size: 10px;
    }
    #Follower_Following {
        position: absolute;
        top: 55%;
        left: 60%;
        width: 20%;
        font-size: 10px;
    }
</style>