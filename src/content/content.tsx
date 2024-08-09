import React from "react";
import ReactDOM from "react-dom/client";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

export const App = () => {
  return (
    <>
      <div
        style={{
          background: "red",
          width: "200px",
          height: "200px",
          position: "fixed",
          right: 0,
          bottom: 0,
        }}
      >
        content pages
      </div>
    </>
  );
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>{/* <App /> */}</React.StrictMode>
);
