import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
//eslint-disable-next-line
import expressServer from "./app";

const PORT = process.env.PORT || 3000;

expressServer.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});

// with database
/*
async function mainApp() {
  await mongoose.connect(`${process.env.DATABASE}`);
  console.log("db connected");

  expressServer.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
}

//eslint-disable-next-line
mainApp();
*/
