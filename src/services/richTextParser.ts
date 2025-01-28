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
  let result = text.replace(
    /<user=(.*)>(.*)<\/user>/g,
    "<span class='RUser' data-user='$1'>$2</span>"
  );
  return result;
}

export default parse;
