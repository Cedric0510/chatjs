import express from 'express';
import routes from './app/routes/index.js';
import sequelize from '../config/database.js'; 

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/api', routes);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ BDD connectée');
    
    app.listen(port, () => {
      console.log("Listening on port : " + port);
    });
  } catch (error) {
    console.error('❌ Erreur BDD:', error);
  }
}

startServer(); 
