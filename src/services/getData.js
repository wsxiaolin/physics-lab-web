let token, authCode;

export async function fetchData(path, body) {
  return fetch("/api" + path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-API-Token": token,
      "x-API-AuthCode": authCode,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          return { success: false, data: data };
        });
      }
      return response.json().then((data) => {
        return { success: true, data: data };
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      return { success: false, error: error };
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
          alert("Login failed")
        });
      }
      return response.json().then((data) => {
        token = data.Token;
        authCode = data.AuthCode;
        return data;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("Login failed")
    });
}
