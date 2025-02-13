function parseString(input) {
  const result = {
    Tags: null,
    ExcludeTags: null,
  };

  // 处理前缀以确定 Category
  result.Category = input.startsWith("d") ? "Discussion" : "Experiment";

  // 去掉协议部分
  const segments = input.split("://").slice(1).join("://");

  // 按 / 分割并处理每个部分
  const parts = segments.split("/");

  for (let i = 0; i < parts.length; i += 2) {
    const key = parts[i];
    const value = parts[i + 1];

    if (key === "ExcludeTags" || key === "Tags") {
      if (!result[key]) {
        result[key] = [];
      }
      if (value) {
        result[key].push(value);
      }
    } else {
      result[key] = value;
    }
  }

  // 确保 Tag 和 ExcludeTags 是数组或 null
  if (!Array.isArray(result.Tags) || result.Tags.length === 0) {
    result.Tags = null;
  }
  if (!Array.isArray(result.ExcludeTags) || result.ExcludeTags.length === 0) {
    result.ExcludeTags = null;
  }

  console.log(input);
  console.log(result);

  const jsonString = JSON.stringify(result);
  const utf8Bytes = new TextEncoder().encode(jsonString);
  const base64String = btoa(String.fromCharCode(...utf8Bytes));

  return base64String.replace(/\//g,"DEVIDER");
}

export default parseString;