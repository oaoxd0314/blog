import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { toUTCTimeStamp } from "./helper/formater.js";
import getTagList from "./src/_11ty/getTagList.js";

export default function (eleventyConfig) {
  /* passthrough — NOT src/css (processed by @tailwindcss/cli) */
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/js");

  /* shared data */
  eleventyConfig.addGlobalData("env", process.env.ELEVENTY_ENV || "development");
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  /* plugins */
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  /* collections */
  eleventyConfig.addCollection("tagList", getTagList);

  /* filters */
  eleventyConfig.addFilter("htmlDateString", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd"),
  );

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy"),
  );

  eleventyConfig.addFilter("postDate", (dateObj) =>
    DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED),
  );

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = String(content)
      .replace(/<[^>]+>/g, "")
      .trim()
      .split(/\s+/).length;
    return Math.max(1, Math.round(words / 240));
  });

  eleventyConfig.addFilter("recentlyPost", (arr) => {
    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    const cutoff = Date.now() - sevenDays;
    return arr.filter((post) => toUTCTimeStamp(post.data.date).getTime() > cutoff);
  });

  /* markdown */
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({ class: "direct-link" }),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    pathPrefix: "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
