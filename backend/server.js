const app = require('./app');
const prisma = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to Database');

        app.listen(PORT, '0.0.0.0', 5000, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
