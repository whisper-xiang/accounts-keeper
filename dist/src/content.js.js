const link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = chrome.runtime.getURL("sidebar.css");
(document.head || document.documentElement).appendChild(link);
