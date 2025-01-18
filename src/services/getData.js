function fetchData(path) {
  return fetch("/api" + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-API-Token": "nmyTZxOFYriNBctIEszHfv7MS0DXWwha",
      "x-API-AuthCode": "VxujKkedoZWyH3UOzFGYwnR9gp6qirbI",
    },
  })
    .then((response) => {
      if (!response.ok) {
        alert("Network response was not ok");
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

export default fetchData;
