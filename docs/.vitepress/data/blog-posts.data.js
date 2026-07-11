import { createContentLoader } from "vitepress";

export default createContentLoader("blog/*.md", {
  transform(raw) {
    return raw
      .filter((page) => page.url !== "/blog/")
      .map((page) => ({
        title: page.frontmatter.title,
        description: page.frontmatter.description || "",
        url: page.url,
        date: page.frontmatter.date || "",
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
});
