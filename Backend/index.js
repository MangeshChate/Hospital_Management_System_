const app = require("./app");
const dotenv = require("dotenv");
const prisma = require("./prisma");
/**
 * Main Index File
 * @editedBy Mangesh
 * @last_edit thu Nov 7
 */


//load env variables
dotenv.config({
    path: "./env"
});




/**
 * Function To Check Database(postgres) is connected properly and run the server.
 */

function checkDatabaseConnection() {
    prisma.$connect()
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`Postgres Connected Successfully & Server in running on port ${process.env.PORT}`)
            })
        })
        .catch((error) => {
            console.error('Failed to connect to the database:', error)
        })
        .finally(() => {
            prisma.$disconnect()
        })
}
checkDatabaseConnection()