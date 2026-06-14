const RESERVED = new Set(["all", "nav", "page", "static", "post", "posts"]);

export default function getTagList(collection) {
  const tagSet = new Set();
  for (const item of collection.getAll()) {
    if (!("tags" in item.data)) continue;
    for (const tag of item.data.tags) {
      if (!RESERVED.has(tag)) tagSet.add(tag);
    }
  }
  return [...tagSet];
}
