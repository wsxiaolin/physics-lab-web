import DOMPurify from "dompurify";
import markdown from "markdown-it";
// @ts-ignore
import katex from "markdown-it-katex";
import highlightjs from "markdown-it-highlightjs";

const md = new markdown({
  html: true,
});

md.use(katex).use(highlightjs, {
  inline: true,
  auto: true,
});

md.core.ruler.before("normalize", "parseUnityRichText", function (state) {
  state.src = state.src
    .replace(/<size=(\d+)>(.*?)<\/size>/g, `<span style="font-size:$1px;">$2</span>`)
    .replace(/<size=(\d+)>(.*?)<\/size>/g, `<span style="font-size:$1px;">$2</span>`) // 处理2层重复标签
    .replace(/<size=(\d+)>(.*?)<\/size>/g, `<span style="font-size:$1px;">$2</span>`) // 处理3层重复标签
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
    .replace(/(<br\/>|  \n){2}(\-{3,}|\*{3,}|\_{3,})(<br\/>|  \n)/g, "<hr></hr>");

  console.log(state.src);
});

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

function parse(text: string | string[]) {
  if (!text) return "";
  if (Array.isArray(text)) {
    let text_ = "", last_is_code: boolean = false;
    for (let i = 0; i < text.length; ++i) {
      let slice_start = 0;
      while (text[i][slice_start] === ' ' || text[i][slice_start] === '\t') {
        if (text[i][slice_start] === '\t') {
          text_ += '    ';
        } else {
          text_ += ' ';
        }
        ++slice_start;
      }

      if (text[i][slice_start] === '>') {
        text_ += `<blockquote>${text[i].slice(text[i].search('>') + 1)}</blockquote>  \n`;
        continue;
      }

      let next_is_code = (text[i].match(/\`\`\`/g)?.length || 0) & 1;
      if (last_is_code
          || next_is_code
          || ((str) => {
            for (let i = 0; i < str.length; ++i) {
              if (str[i] === ' ') {
                continue;
              } else if (
                  str[i] === '-'
                  || str[i] === '*'
                  || str[i] === '#'
                  || ((line) => {
                    for (let j = 0; j < line.length; ++j) {
                      if ('0' <= line[j] && line[j] <= '9') {
                        continue;
                      } else if (line[j] === '.') {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  })(str.slice(i))
              ) {
                return true;
              } else {
                return false;
              }
            }
          })(text[i])
      ) {
        text_ += text[i].slice(slice_start) + '\n';
      } else if (text[i].length === 0) {
        text_ += text[i].slice(slice_start) + '  \n';
      } else {
        text_ += text[i].slice(slice_start) + "<br/>";
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
        tag.outerHTML = `<span style="color:blue;">${tag.textContent}</span>`;
      }
    });

    return doc.body.innerHTML;
  }

  let clean = DOMPurify.sanitize(result, {
    ADD_TAGS: ["a", "br", "span"], // 允许a标签
    ADD_ATTR: ["href", "internal"], // 允许href和data-to属性
  });

  return processAnchorTags(clean);
}

export default parse;
