const fs = require("fs");
const path = require("path");

// 创建目录
const iconDir = path.join(__dirname, "../assets/icons");
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 魔杖图标（生成页面）
const wandIcon = `
<svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M40.5 20L45 35L60 40.5L45 46L40.5 61L36 46L21 40.5L36 35L40.5 20Z" fill="currentColor"/>
</svg>
`;

// 时钟图标（历史页面）
const clockIcon = `
<svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40.5" cy="40.5" r="25.5" stroke="currentColor" stroke-width="6"/>
  <path d="M40.5 25.5V40.5L50.5 50.5" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
</svg>
`;

// 保存图标函数
const saveIcon = (name, svg, color) => {
  const fileName = `${name}${color === "#ff0000" ? "-active" : ""}.png`;
  const filePath = path.join(iconDir, fileName);

  // 这里应该使用实际的 SVG 到 PNG 转换逻辑
  // 为了演示，我们创建一个简单的 PNG 文件
  const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  fs.writeFileSync(filePath, buffer);
};

// 生成所有图标
["#000000", "#ff0000"].forEach((color) => {
  saveIcon("wand", wandIcon, color);
  saveIcon("clock", clockIcon, color);
});

console.log("Icons created successfully!");
