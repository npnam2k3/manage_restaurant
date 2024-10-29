import "./src/configs/env.config.js";
import app from "./src/app.js";
import config from "./src/configs/config.mysql.js";

const port = config.app.port || 5001;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
