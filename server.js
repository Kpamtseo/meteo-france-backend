const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Activer CORS pour toutes les origines
app.use(cors());

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Météo France - Backend</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        h1 { color: #667eea; }
        .status { 
          background: #4caf50; 
          color: white; 
          padding: 10px 20px; 
          border-radius: 5px;
          display: inline-block;
          margin: 10px 0;
        }
        code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
        }
        .endpoint {
          background: #f8f9fa;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 15px 0;
        }
        a {
          color: #667eea;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌦️ API Météo France - Backend</h1>
        <div class="status">✅ Serveur actif et opérationnel</div>
        
        <h2>📡 Endpoints disponibles</h2>
        
        <div class="endpoint">
          <h3>GET /api/vigilance</h3>
          <p>Récupère les données de vigilance météorologique pour tous les départements français.</p>
          <p><strong>URL :</strong> <a href="/api/vigilance" target="_blank">/api/vigilance</a></p>
          <p><strong>Réponse :</strong> JSON</p>
        </div>
        
        <div class="endpoint">
          <h3>GET /api/test</h3>
          <p>Endpoint de test pour vérifier que le serveur fonctionne.</p>
          <p><strong>URL :</strong> <a href="/api/test" target="_blank">/api/test</a></p>
        </div>
        
        <h2>🔧 Utilisation</h2>
        <p>Dans votre application HTML, utilisez cette URL :</p>
        <code>const apiUrl = '${req.protocol}://${req.get('host')}/api/vigilance';</code>
        
        <h2>ℹ️ Informations</h2>
        <p><strong>Version :</strong> 1.0.0</p>
        <p><strong>Source des données :</strong> Météo France API Publique</p>
        <p><strong>CORS :</strong> Activé pour toutes les origines</p>
        <p><strong>Mise à jour :</strong> En temps réel</p>
      </div>
    </body>
    </html>
  `);
});

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Le serveur fonctionne correctement !',
    timestamp: new Date().toISOString()
  });
});

// Endpoint principal pour récupérer les alertes
app.get('/api/vigilance', async (req, res) => {
  try {
    console.log('📡 Requête reçue pour /api/vigilance');
    
    const apiUrl = 'https://public-api.meteofrance.fr/public/DPVigilance/v1/cartevigilance/encours';
    
    console.log('🔄 Appel à l\'API Météo France...');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Erreur API Météo France: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Données reçues de Météo France');
    
    // Ajouter des headers pour le cache
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes
      'Content-Type': 'application/json'
    });
    
    res.json(data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║     🌦️  Backend Météo France - Serveur actif  🌦️      ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  console.log(`✅ Serveur actif sur : http://0.0.0.0:${PORT}`);
  console.log(`📡 API disponible sur : http://0.0.0.0:${PORT}/api/vigilance`);
  console.log(`🧪 Test disponible sur : http://0.0.0.0:${PORT}/api/test\n`);
});
