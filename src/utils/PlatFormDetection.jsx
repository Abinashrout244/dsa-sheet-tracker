const PLATFORMS = [
  {
    key: "leetcode",
    name: "LeetCode",
    match: (url) => url.includes("leetcode.com"),
    img: "https://assets.leetcode.com/static_assets/public/icons/favicon-192.png",
    fallbackImg: "https://leetcode.com/favicon.ico",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
  },
  {
    key: "gfg",
    name: "GFG",
    match: (url) => url.includes("geeksforgeeks.org"),
    img: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_favicon.png",
    fallbackImg: "https://www.geeksforgeeks.org/favicon.ico",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  {
    key: "tuf",
    name: "TUF+",
    match: (url) => url.includes("takeuforward.org"),
    img: "https://takeuforward.org/favicon.ico",
    fallbackImg: "https://takeuforward.org/favicon.ico",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
];

// detect platform from link
export function getPlatform(link) {
  if (!link) return null;
  return PLATFORMS.find((p) => p.match(link)) || null;
}