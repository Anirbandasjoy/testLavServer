import app from "./app";
const PORT = process.env.PORT || 4000;
import { dbConnection } from "./config/db";

app.listen(PORT, async () => {
  await dbConnection();
  console.log(`Server is running at http://localhost:${PORT}`);
});
