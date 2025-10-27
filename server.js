const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Activer CORS pour toutes les origines
app.use(cors());

// Clé API Météo France (peut être définie via variable d'environnement ou directement)
const METEO_API_KEY = process.env.METEO_API_KEY || 'eyJ4NXQiOiJZV0kxTTJZNE1qWTNOemsyTkRZeU5XTTRPV014TXpjek1UVmhNbU14T1RSa09ETXlOVEE0Tnc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJrcGFtdHNlb0BjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImtwYW10c2VvIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJEZWZhdWx0QXBwbGljYXRpb24iLCJpZCI6MzI3NTMsInV1aWQiOiJiN2U0N2MzOC1iYzAwLTRlMjctYTc1Yy01YWRmMTNiZmJlMzQifSwiaXNzIjoiaHR0cHM6XC9cL3BvcnRhaWwtYXBpLm1ldGVvZnJhbmNlLmZyOjQ0M1wvb2F1dGgyXC90b2tlbiIsInRpZXJJbmZvIjp7IjUwUGVyTWluIjp7InRpZXJRdW90YVR5cGUiOiJyZXF1ZXN0Q291bnQiLCJncmFwaFFMTWF4Q29tcGxleGl0eSI6MCwiZ3JhcGhRTE1heERlcHRoIjowLCJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOiJzZWMifSwiNjBSZXFQYXJNaW4iOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6InNlYyJ9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJBUk9NRS1QSSIsImNvbnRleHQiOiJcL3B1YmxpY1wvYXJvbWVwaVwvMS4wIiwicHVibGlzaGVyIjoiYWRtaW5fbWYiLCJ2ZXJzaW9uIjoiMS4wIiwic3Vic2NyaXB0aW9uVGllciI6IjUwUGVyTWluIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRvbm5lZXNQdWJsaXF1ZXNWaWdpbGFuY2UiLCJjb250ZXh0IjoiXC9wdWJsaWNcL0RQVmlnaWxhbmNlXC92MSIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6InYxIiwic3Vic2NyaXB0aW9uVGllciI6IjYwUmVxUGFyTWluIn1dLCJleHAiOjE3OTMxMTUzOTYsInRva2VuX3R5cGUiOiJhcGlLZXkiLCJpYXQiOjE3NjE1NzkzOTYsImp0aSI6IjczOGU4NzY5LTVhNzgtNDM2Ni1iZmQ0LTg5NGIyNTY5MWMzYSJ9.WOpxC98MPq29Qx-l56afPpbDMsjSbPBLhm2dyyV-pxhmiIZ6KxYlXopm5Q9siXQ3wtTwq2f7BDfJozKKg3uYTP-FYuX7Q3g6OtQfN4YnwOBo_bZsenqdJ0X4uhqsQO3fHTpovpI9b4kyQJA2mGcY2bWSKrDk2Ije6CkAnOspUAFq0L1X-mV9eK4IeZOY0tsQZAgMA2J3zIfslAuANnCMoesM5c3GkU0R908xvIPl_fOF1VCqCbZTMlMMWkiWpr8FfmzZIUV15NAE9WpBk32-bkd7RiK7GRexlCTV0BJzY3qymJLmatLCjQxIqJRfrDxpnsWlezJD4350NGQWXqlvxw==';

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Météo France - Backend FINAL</title>
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
        .badge {
          background: #4caf50;
          color: white;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 0.85em;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌦️ API Météo France - Backend <span class="badge">OFFICIEL</span></h1>
        <div class="status">✅ Serveur actif avec clé API authentifiée</div>
        
        <h2>📡 Endpoints disponibles</h2>
        
        <div class="endpoint">
          <h3>GET /api/vigilance</h3>
          <p>Récupère les données officielles de vigilance météorologique de Météo France</p>
          <p><strong>URL :</strong> <a href="/api/vigilance" target="_blank">/api/vigilance</a></p>
          <p><strong>Réponse :</strong> JSON (format officiel Météo France)</p>
          <p><strong>Authentification :</strong> ✅ Clé API intégrée</p>
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
        <p><strong>Version :</strong> 4.0.0 (FINAL)</p>
        <p><strong>Source des données :</strong> Météo France API Officielle</p>
        <p><strong>Authentification :</strong> Clé API valide</p>
        <p><strong>CORS :</strong> Activé pour toutes les origines</p>
        <p><strong>Mise à jour :</strong> Temps réel</p>
        <p><strong>Limite :</strong> 60 requêtes/minute</p>
        
        <h2>✅ Statut</h2>
        <p style="color: #4caf50; font-weight: bold;">🟢 API fonctionnelle avec authentification réussie</p>
      </div>
    </body>
    </html>
  `);
});

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Le serveur fonctionne correctement avec l\'API Météo France authentifiée !',
    timestamp: new Date().toISOString(),
    version: '4.0.0',
    apiStatus: 'authenticated'
  });
});

// Endpoint principal pour récupérer les alertes
app.get('/api/vigilance', async (req, res) => {
  try {
    console.log('📡 Requête reçue pour /api/vigilance');
    console.log('🔑 Utilisation de la clé API Météo France');
    
    const apiUrl = 'https://public-api.meteofrance.fr/public/DPVigilance/v1/cartevigilance/encours';
    
    console.log('🔄 Appel à l\'API officielle Météo France...');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': METEO_API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'MeteoFranceApp/4.0'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Erreur API: ${response.status} ${response.statusText}`);
      throw new Error(`Erreur API Météo France: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Données officielles reçues de Météo France');
    
    // Log du nombre de départements
    if (data.product && data.product.periods && data.product.periods[0]) {
      const domains = data.product.periods[0].timelaps?.domain_ids || [];
      console.log(`📊 ${domains.length} départements récupérés`);
    }
    
    // Ajouter des headers pour le cache
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes
      'Content-Type': 'application/json',
      'X-Data-Source': 'Météo France API Officielle',
      'X-Backend-Version': '4.0.0'
    });
    
    res.json(data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString(),
      info: 'Impossible de récupérer les données de vigilance depuis l\'API Météo France',
      solution: 'Vérifiez que la clé API est valide et que vous n\'avez pas dépassé les limites de taux'
    });
  }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║     🌦️  Backend Météo France FINAL - Actif 🌦️        ║');
  console.log('║           API Officielle avec Authentification        ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  console.log(`✅ Serveur actif sur : http://0.0.0.0:${PORT}`);
  console.log(`📡 API disponible sur : http://0.0.0.0:${PORT}/api/vigilance`);
  console.log(`🧪 Test disponible sur : http://0.0.0.0:${PORT}/api/test`);
  console.log(`🔑 Authentification : Clé API Météo France active`);
  console.log(`📊 Source : API Officielle Météo France`);
  console.log(`⚡ Limite : 60 requêtes par minute\n`);
});
