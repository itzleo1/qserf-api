const express = require('express');
const firebase = require('firebase');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Carregue as credenciais do arquivo JSON
const firebaseConfig = {
    authDomain: "qserf-ed821.firebaseapp.com",
    databaseURL: "https://qserf-ed821-default-rtdb.firebaseio.com",
    projectId: "qserf-ed821",
    storageBucket: "qserf-ed821.appspot.com",
    messagingSenderId: "60617892569",
    appId: "1:60617892569:web:1733d05a183a60e5c514c8",
    measurementId: "G-DQ44FJ1MTQ"
  }

// Inicialize o Firebase Admin SDK
  firebase.initializeApp(firebaseConfig);

// Rota para salvar informações do jogador na Firebase
app.post('/api/v1/salvar', async (req, res) => {
  const { username, status } = req.body;

  try {
    // Referência para a coleção 'jogadores' no Firestore
    const jogadoresCollection = firebase.firestore().collection('qserf');

    // Procurar se o jogador já existe no Firestore
    const jogadorExistente = await jogadoresCollection.doc(username).get();

    if (jogadorExistente.exists) {
      // Atualizar o status se o jogador já existir
      await jogadoresCollection.doc(username).update({ status });
    } else {
      // Criar um novo jogador se não existir
      await jogadoresCollection.doc(username).set({ username, status });
    }

    res.json({ mensagem: 'Informações do jogador salvas com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar informações do jogador:', error);
    res.status(500).json({ erro: 'Erro ao salvar informações do jogador' });
  }
});

// Rota para obter informações do jogador na Firebase
app.get('/api/v1/obter/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const jogadorSnapshot = await firebase.firestore().collection('qserf').doc(username).get();

    if (jogadorSnapshot.exists) {
      const jogadorData = jogadorSnapshot.data();
      res.json({ username: jogadorData.username, status: jogadorData.status });
    } else {
      res.status(404).json({ mensagem: 'Jogador não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter informações do jogador:', error);
    res.status(500).json({ erro: 'Erro ao obter informações do jogador' });
  }
});

app.get('/ping', async (req, res) => {
    res.send('Pong!');
});

app.get('/pong', async (req, res) => {
    res.send('Ping!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
