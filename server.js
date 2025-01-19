require('dotenv').config({path:'./config.env'});
const sequelize = require('./src/models/connection');
const server = require('./app');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`
            ──▄────▄▄▄▄▄▄▄────▄───  ☠️  DANGER! ☠️  
            ─▀▀▄─▄█████████▄─▄▀▀──  💥 Server is LIVE! 💥
            ─────██─▀███▀─██──────  🚀 Running at:
            ───▄─▀████▀████▀─▄────  👉 http://localhost:${PORT}
            ─▀█────██▀█▀██────█▀──  🔹 Have fun (but beware)! 🌟
            `);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});