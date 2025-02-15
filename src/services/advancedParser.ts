import DOMPurify from "dompurify";
import markdown from "markdown-it";
// @ts-ignore
import katex from "markdown-it-katex";
import highlightjs from "markdown-it-highlightjs";

const md = new markdown({
  html: true,
  linkify:true,
});

md.use(katex).use(highlightjs, {
  inline: true,
  auto: true,
});

md.core.ruler.before("normalize", "parseUnityRichText", function (state) {
  state.src = state.src
    .replace(/<user=(.*?)>(.*?)<\/user>/g, "<span class='RUser' data-user='$1'>$2</span>")
    .replace(
      /<discussion=(.*?)>(.*?)<\/discussion>/g,
      `<a href="/ExperimentSummary/Discussion/$1" internal>$2</a>`
    )
    .replace(
      /<experiment=(.*?)>(.*?)<\/experiment>/g,
      `<a href="/ExperimentSummary/Experiment/$1" internal>$2</a>`
    )
    .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>") // 粗体
    .replace(/<i>(.*?)<\/i>/g, "<em>$1</em>") // 斜体
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 颜色
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 处理2层重复标签
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 处理3层重复标签
    .replace(/<a>(.*?)<\/a>/g, '<span style="color:blue;">$1</span>') // a转换为蓝色
    .replace(/(<br\/>| *\n){2}(\-{3,}|\*{3,}|\_{3,})(<br\/>| *\n)/g, "\n<hr></hr>\n");

  state.src = parse_size(parse_size(parse_size(state.src)));
});

function parse_size(text: string) {
  //@ts-ignore
  return text.replace(/<size=(\d+)>(.*?)<\/size>/g, function (match: string, size, content) {
    return `<span style="font-size:${size / 2}px">${content}</span>`;
  });
}

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

/**
 * 丰富的解析引擎，含有Katex等
 * @param text 文本
 * @param isInline 为真会不输出换行和size标签
 * @returns
 */
function parse(text: string | string[], isInline: boolean = false) {
  // 请确保以下实验简介的渲染正常:
  // /Discussion/67a88a9cd76625ec934e2b47
  // /Discussion/5f3620716adfbe0001ca35e9
  // /Discussion/67a785e6d76625ec934e1525
  // /Experiment/67987779fa3a53d92a765111
  if (!text) return "";
  if (Array.isArray(text)) {
    // 按一定规则拼接为一个字符串
    let text_ = "",
      last_is_code: boolean = false;
    for (let i = 0; i < text.length; ++i) {
      // ~~~代码段 是不支持的，因为我(Arendelle)不用（
      let next_is_code = (text[i].match(/\`\`\`/g)?.length || 0) & 1;

      if (last_is_code || next_is_code || /^( |\t)*(\-|\*|\#|\d+\.)/.test(text[i])) {
        text_ += text[i] + "\n";
      } else if (/^ *<.*> *$/.test(text[i])) {
        text_ += text[i] + "<br/>";
      } else {
        let slice_start = 0;
        while (true) {
          if (text[i][slice_start] === "\t") {
            text_ += "&nbsp;&nbsp;&nbsp;&nbsp;";
          } else if (text[i][slice_start] === " ") {
            text_ += "&nbsp;";
          } else {
            break;
          }
          ++slice_start;
        }

        // > xxx
        if (text[i][slice_start] === ">") {
          text_ += `<blockquote>${text[i].slice(text[i].search(">") + 1)}</blockquote>\n\n`;
          continue;
        }
        text_ += text[i].slice(slice_start) + "  \n";
      }
      if (next_is_code) {
        last_is_code = !last_is_code;
      }
    }
    text = text_;
  }

  let result = md.render(text);

  // 辅助函数：检查是否为同域链接
  function isSameDomain(url: string): boolean {
    const origin = window.location.origin;
    try {
      const parsedUrl = new URL(url, origin);
      return parsedUrl.origin === origin;
    } catch (e) {
      return false;
    }
  }

  // 处理a标签，移除或替换跨域链接
  function processAnchorTags(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const anchorTags = doc.querySelectorAll("a");

    anchorTags.forEach((tag) => {
      const href = tag.getAttribute("href");
      if (href && !isSameDomain(href)) {
        tag.outerHTML = `<span style="color:lightblue;">${tag.textContent}</span>`;
      }
    });

    return doc.body.innerHTML;
  }

  let clean = DOMPurify.sanitize(result, {
    ADD_TAGS: ["a", "br", "span"], // 允许a标签
    ADD_ATTR: ["href", "internal"], // 允许href和data-to属性
  });

  if (isInline) {
    clean = clean
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "");
  }

  return processAnchorTags(clean);
}

export default parse;
