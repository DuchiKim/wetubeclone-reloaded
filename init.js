import "dotenv/config"
import "./database"
import "./src/models/Video"
import app from "./server"

const PORT = 4000;
const handleListening = () => {
    console.log (`Server listening on port http://localhost:${PORT}`)
};

app.listen(4000,handleListening);