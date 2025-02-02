import { createApp,computed } from "vue";
import UserCard from "../components/popup/usercard.vue";
import { getData } from "../services/getData";

export default async function (userid: string) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  window.$message.loading("请稍候",{duration:1e3});
  const re = await getData("/Users/GetUser", { ID: userid });
  const data = re.Data.User;
  const app = createApp(UserCard, {
    userid,
    name:data.Nickname,
    close: () => {
      app.unmount;
      div.remove();
    },
    snt: data.Signature,
    avatar:  computed(() => {
      if (data.Avatar === 0) return "/src/assets/user/default-avatar.png"; //默认头像
      return `/static/users/avatars/${data.ID.slice(0, 4)}/${data.ID.slice(
        4,
        6
      )}/${data.ID.slice(6, 8)}/${data.ID.slice(8, 24)}/${data.Avatar}.jpg`;
    }).value,
    followingCount: re.Data.Statistic.FollowingCount,
    followerCount: re.Data.Statistic.FollowerCount,
    postCount: re.Data.Statistic.ExperimentCount,
  });
  app.mount(div);
}
