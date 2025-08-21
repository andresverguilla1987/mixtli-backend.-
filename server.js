import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import downloadRoutes from "./routes/download.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("API Mixtli funcionando 🚀"));

app.use("/api/upload", uploadRoutes);
app.use("/api/download", downloadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
