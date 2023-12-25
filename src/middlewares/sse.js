let connexions = new Set();
let currentId = 0;

const sse = () => {
    return (request, response, next ) => {
        // initialisation du canal de transmission
        response.initStream = () => {
            response.writeHead(200, {
                'Cache-Control': 'no-cache',
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive'
            })

            //enregistrement des connection sur lesquels on doit dispatcher les données
            connexions.add(response)

            // boucle qui va envoyer de petit d'info pour garder ma connection en vie
            const intervalId = setInterval(() => {
                response.write(':\n\n');
                response.flush();
            }, 30000)

            response.on('close', () => {
                clearInterval(intervalId)
                response.end();
                connexions.delete(response)
            })

        }

        response.sendSSE = (data, eventName) => {
            let dataString =
                `id: ${currentId}\n` +
                `data: ${JSON.stringify(data)}\n` +
                (eventName ? `event: ${eventName}\n\n` : `\n`)

            for (let connexion of connexions) {
                connexion.write(dataString)
                connexion.flush()                
            }

            currentId++;
        }
        next()
    }
}

module.exports = sse;
// export default sse;