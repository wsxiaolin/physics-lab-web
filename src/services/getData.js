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

export async function login(arg1, arg2, is_token = false) {
  let username = is_token ? null : arg1;
  let password = is_token ? null : arg2;
  let header = {"Content-Type": "application/json"};
  if (is_token && arg1 && arg2) {
    header["x-API-Token"] = arg1;
    header["x-API-AuthCode"] = arg2;
  }
  return fetch("/api/Users/Authenticate", {
    method: "POST",
    body: JSON.stringify({
      Login: username,
      Password: password,
      Version: 2411,
      Device: {
        Identifier: "7db01528cf13e2199e141c402d79190e",
        Language: "Chinese",
      },
    }),
    headers: header,
  })
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then(() => {
          window.$message.error("连接失败", { duration: 3e3, closable: true });
        });
      }
      return response.json().then((data) => {
        password && localStorage.setItem("loginStatus", true);
        password && window.$message.success("连接成功", { duration: 3e3, closable: true });
        return data;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      window.$message.error("连接失败", { duration: 3e3, closable: true });
    });
}
