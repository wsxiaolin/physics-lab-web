<template>
    <div id="notification_container">
        <img src="src\assets\useravatar.jpg" id="avatar"/>
        <div id="notification" class="notification">
            <div id="notification_title" class="notification_title">
                {{msg_title}}
            </div>
            <div id="notification_message" class="notification_message">
                <div id="notification_icon" class="notification_icon">
                    <img src={{msg_icon_url}} id="notification_icon"/>
                </div>
                <div id="notification_text" class="notification_text">
                    {{msg}}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const { projects, type } = defineProps({
        avatar_url: String, 
        msg: String, 
        msg_title: String,
        msg_type: Number,// 0: System, 1: Comments, 2: Followers, 3: Projects, 4: Admin
    });
    const msg_icon_url = computed(()=>
    {
        switch(msg_type.value)
        {
            case 0:
                return "src\\assets\\icons\\notifications_system.png";
            case 1:
                return "src\\assets\\icons\\notifications_comments.png";
            case 2:
                return "src\\assets\\icons\\notifications_followers.png";
            case 3:
                return "src\\assets\\icons\\notifications_projects.png";
            case 4:
                return "src\\assets\\icons\\notifications_admin.png";
        }
    });
</script>

<style scoped>
        #notification_container {
        position: fixed;
        top: 5px;
        right: 0;
        width: 100%;
        height: 150px;
        display: flex;
    }
    #notification_container :hover {
        background-color: #f0f0f0;
    }
    #avatar {
        height: 90px;
        width: 90px;
        border-radius: 50%;
        -overflow: hidden;
        position: relative;
        top: 5px;
        left: 5px;
        z-index: 100;
    }
    #avatar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
        background-color: white;
        mix-blend-mode: luminosity;
    }
    #notification {
        width: 100%;
        height: 100px;
        position: absolute;
        background-color: white;
        display: flex;
        flex-direction: column;
    }
    #notification_icon {
        width: 16px;
        height: 16px;
        position: relative;
        top: 2px;
        background-color: transparent;
        display: flex;
    }
    #notification_title {
        font-size: 20px;
        position: relative;
        left: 100px;
        font-weight: bold;
    }
    #notification_message {
        font-size: 16px;
        position: relative;
        left: 100px;
        display: flex;
        flex-direction: row;
    }
    #notification_text {
        font-size: 16px;
        position: relative;
        display: flex;
    }
    #icon {
        height: 16px;
        width: 16px;
        position: relative;
    }
</style>