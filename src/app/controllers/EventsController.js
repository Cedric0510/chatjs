export default class EventsController {
    
    static clients = [];
    
    static async connect(req, res) {
        console.log('Nouvelle connexion SSE');
        
        // Config headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });
        
        // Ajout client
        const clientId = Date.now();
        const client = { id: clientId, response: res };
        EventsController.clients.push(client);
        
        console.log(`Client ${clientId} connecté. Total: ${EventsController.clients.length}`);
        
        // Message initial
        res.write(`data: {"type": "connected", "clientId": ${clientId}}\n\n`);
        
        // Nettoyage déco
        req.on('close', () => {
            EventsController.clients = EventsController.clients.filter(c => c.id !== clientId);
            console.log(`Client ${clientId} déconnecté. Total: ${EventsController.clients.length}`);
        });
    }
    
    // Message clients connectés
    static broadcastMessage(messageData) {
        const event = {
            type: 'newMessage',
            data: messageData
        };
        
        const eventString = `data: ${JSON.stringify(event)}\n\n`;
        
        console.log(`Diffusion message à ${EventsController.clients.length} clients`);

        EventsController.clients.forEach(client => {
            try {
                client.response.write(eventString);
            } catch (error) {
                console.log('Erreur envoi SSE:', error.message);
            }
        });
    }
}