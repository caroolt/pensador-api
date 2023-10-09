const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors'); // Importe o módulo cors

const app = express();

// Configure o CORS para aceitar solicitações de todas as origens
app.use(cors());

app.get('/frases/:keywords/:pages', async (req, res) => {
  try {
    const keywords = req.params.keywords; 
    const pages = req.params.pages;
    
    const frases = [];
    for(i = 1; i <= pages; i++) {
      let response;
      if(i === 1 ) {
         response = await axios.get(`https://www.pensador.com/${keywords}/`);
      } else {
        response = await axios.get(`https://www.pensador.com/${keywords}/${i}/`);
      }
    
      const pensador = cheerio.load(response.data);
      const fraseElements = pensador('.frase');
  
      fraseElements.each((index, element) => {
        const frase = pensador(element).text();
        frases.push(frase);
      });
    }

    res.json({
      frases
    });
  } catch (error) {
    console.error('Erro ao obter frases:', error);
    res.status(500).json({ error: 'Erro ao obter frases' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
