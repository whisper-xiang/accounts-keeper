async function API(type: "cloud" | "local"): Promise<any> {
  if (type === "cloud") {
    return await import("./cloud");
  } else {
    return await import("./cloud");
  }
}

// TODO type由本地settings决定
const api = await API("cloud");

export { api };
