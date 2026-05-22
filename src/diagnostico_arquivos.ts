// Diagnóstico - verificar status dos arquivos
console.log('=== DIAGNÓSTICO DE ARQUIVOS ===');
console.log('');

const arquivos = [
  'src/pages/MainScreen.tsx',
  'src/pages/HomeScreen.tsx',
  'src/pages/Home.tsx',
  'src/components/MapComponent.tsx',
  'src/components/navigation/BottomNav.tsx',
  'src/components/screens/HomeScreen.tsx',
  'src/components/HomeContent.tsx',
  'src/components/HomeScreenContent.tsx',
  'src/components/WelcomeScreen.tsx',
  'src/backup/MainScreen.tsx.bak',
  'src/backup/MapComponent.tsx.bak',
  'src/contexts/AuthContext.tsx',
  'src/backup/AuthContext.tsx.bak',
];

arquivos.forEach(arquivo => {
  console.log(`Verificando: ${arquivo}`);
});
console.log('');
console.log('Fim do diagnóstico');