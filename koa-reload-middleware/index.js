module.exports =
  process.env.NODE_ENV === "production"
    ? require("./lib/index.prod")
    : require("./lib/index.dev");
