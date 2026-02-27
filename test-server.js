// Script de test simple pour vérifier le serveur
const http = require('http');

const tests = [
  {
    name: 'Serveur répond',
    test: () => {
      return new Promise((resolve, reject) => {
        http.get('http://localhost:3000', (res) => {
          if (res.statusCode === 200) {
            resolve('✅ Serveur accessible');
          } else {
            reject(`❌ Code: ${res.statusCode}`);
          }
        }).on('error', reject);
      });
    }
  },
  {
    name: 'Page de jeu existe',
    test: () => {
      return new Promise((resolve, reject) => {
        http.get('http://localhost:3000/game.html', (res) => {
          if (res.statusCode === 200) {
            resolve('✅ game.html accessible');
          } else {
            reject(`❌ Code: ${res.statusCode}`);
          }
        }).on('error', reject);
      });
    }
  },
  {
    name: 'Fichier multiplayer.js existe',
    test: () => {
      return new Promise((resolve, reject) => {
        http.get('http://localhost:3000/js/multiplayer.js', (res) => {
          if (res.statusCode === 200) {
            resolve('✅ multiplayer.js accessible');
          } else {
            reject(`❌ Code: ${res.statusCode}`);
          }
        }).on('error', reject);
      });
    }
  },
  {
    name: 'Fichier CSS existe',
    test: () => {
      return new Promise((resolve, reject) => {
        http.get('http://localhost:3000/css/game-layout.css', (res) => {
          if (res.statusCode === 200) {
            resolve('✅ game-layout.css accessible');
          } else {
            reject(`❌ Code: ${res.statusCode}`);
          }
        }).on('error', reject);
      });
    }
  }
];

async function runTests() {
  console.log('\n🧪 Tests du serveur 7 Wonders Duel\n');
  console.log('Assurez-vous que le serveur est démarré (npm start)\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const { name, test } of tests) {
    try {
      const result = await test();
      console.log(`${result} - ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ Échec - ${name}: ${error.message || error}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Résultats: ${passed} réussis, ${failed} échoués\n`);
  
  if (failed === 0) {
    console.log('🎉 Tous les tests sont passés!\n');
    console.log('Vous pouvez maintenant:');
    console.log('1. Ouvrir http://localhost:3000 dans votre navigateur');
    console.log('2. Créer une partie');
    console.log('3. Rejoindre avec un autre navigateur/onglet incognito\n');
  } else {
    console.log('⚠️  Certains tests ont échoué.');
    console.log('Vérifiez que le serveur est bien démarré avec "npm start"\n');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
