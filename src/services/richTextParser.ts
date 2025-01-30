import DOMPurify from "dompurify";

/**
 * 将unity富文本解析为Html，样式写在index.html，含有Ruser
 *
 * @function
 * @name parse
 * @kind function
 * @param {type} params
 * @returns {void}
 * @exports
 */

function parse(text: string | undefined) {
  if (!text) return "";
  let result = text
    .replace(/<user=(.*)>(.*)<\/user>/g, "<span class='RUser' data-user='$1'>$2</span>")
    .replace(
      /<discussion=(.*)>(.*)<\/discussion>/g,
      `<a data-to="/ExperimentSummary/Discussion/$1">$2</a>`
    )
    .replace(
      /<experiment=(.*)>(.*)<\/experiment/g,
      `<a data-to="/ExperimentSummary/Experiment/$1">$2</a>`
    )
    // 新增Markdown语法解析
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // 粗体
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // 斜体
    .replace(/`(.*?)`/g, "<code>$1</code>") // 代码
    .replace(/> (.*?)\n/g, "<blockquote>$1</blockquote>") // 引用

    // 新增Unity富文本解析
    .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>") // 粗体
    .replace(/<i>(.*?)<\/i>/g, "<em>$1</em>") // 斜体
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 颜色
    .replace(/<a>(.*?)<\/a>/g,'<span style="color:blue;">$1</span>') // a转换为蓝色
    .replace(/<size=(.*?)>(.*?)<\/size>/g, '<span style="font-size:$1px;">$2</span>'); // 字体大小

  const clean = DOMPurify.sanitize(result, {
    ADD_TAGS: ["a"], // 允许a标签
    ADD_ATTR: ["href", "data-to"], // 允许href和data-to属性
  });

  return clean;
}

export default parse;
