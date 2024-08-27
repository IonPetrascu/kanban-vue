import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3000;

const server = http.createServer((req, res) => {
  cors()(req, res, () => {
    res.setHeader('Content-Type', 'application/json');

    try {
      if (req.method === 'GET' && req.url === '/data') {
        const dataPath = path.join(__dirname, 'data.json');
        fs.readFile(dataPath, { encoding: 'utf-8' })
          .then(data => {
            res.statusCode = 200;
            res.end(data);
          })
          .catch(error => {
            console.error('Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          });
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    } catch (error) {
      console.error('Error:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
});

server.listen(PORT, 'localhost', (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});
