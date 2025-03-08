require('dotenv').config({path:'./config.env'});
require('./src/models/index');
const server = require('./app');

const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
        console.log(`
            ──▄────▄▄▄▄▄▄▄────▄───  ☠️  DANGER! ☠️  
            ─▀▀▄─▄█████████▄─▄▀▀──  💥 Server is LIVE! 💥
            ─────██─▀███▀─██──────  🚀 Running at:
            ───▄─▀████▀████▀─▄────  👉 http://localhost:${PORT}
            ─▀█────██▀█▀██────█▀──  🔹 Have fun (but beware)! 🌟
            `);
    });
