// content.js
document.body.style.backgroundColor = "lightblue"; // 修改网页背景颜色

// 添加按钮
const button = document.createElement("button");
button.textContent = "Click me";
button.addEventListener("click", () => alert("Button clicked!"));
document.body.appendChild(button);

console.log("content.js loaded");
