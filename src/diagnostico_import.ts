console.log('=== DIAGNÓSTICO DE IMPORTAÇÕES ===');

const verificar = async () => {
  // Verificar App.tsx
  const appImport = document.querySelector('script[src*="App"]');
  console.log('App.tsx importado?', appImport ? '✅ Sim' : '❌ Não');
  
  // Verificar se ProfileScreen existe
  console.log('Verificando rotas...');
  console.log('Verificando componentes...');
};

verificar().catch(console.error);