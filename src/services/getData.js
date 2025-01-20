export async function getData(path, body) {
  return fetch("/api" + path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-API-Token": localStorage.getItem("token"),
      "x-API-AuthCode": localStorage.getItem("authCode"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          window.$message.error("连接失败", { duration: 3e3, closable: true });
        });
      }
      return response.json().then((data) => {
        return data;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      window.$message.error("连接失败", { duration: 3e3, closable: true });
    });
}

export async function login(username, password) {
  return fetch("/api/Users/Authenticate", {
    method: "POST",
    body: JSON.stringify({
      Login: username,
      Password: password,
      Version: 2411,
      Device: {
        ID: null,
        Identifier: "7db01528cf13e2199e141c402d79190e",
        Platform: "Android",
        Model: "HONOR ROD-W09",
        System: "Android OS 12 / API-31 (HONORROD-W09/7.0.0.186C00)",
        CPU: "ARM64 FP ASIMD AES",
        GPU: "Mali-G610 MC6",
        SystemMemory: 7691,
        GraphicMemory: 2048,
        ScreenWidth: 2560,
        ScreenHeight: 1600,
        ScreenDPI: 360,
        ScreenSize: 8.4,
        Timezone: "Local",
        Language: "Chinese",
      },
      Statistic: null,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(() => {
          window.$message.error("连接失败", { duration: 3e3, closable: true });
        });
      }
      return response.json().then((data) => {
        localStorage.setItem("token", data.Token);
        localStorage.setItem("authCode", data.AuthCode);
        username && localStorage.setItem("username", username);
        password &&localStorage.setItem("password", password);
        window.$message.success("连接成功", { duration: 3e3, closable: true });
        return data;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      window.$message.error("连接失败", { duration: 3e3, closable: true });
    });
}
