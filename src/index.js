import express from 'express';
import routes from './app/routes/index.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/api', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening on port : " + process.env.PORT);
});
