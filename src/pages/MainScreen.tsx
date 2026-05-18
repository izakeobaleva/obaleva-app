// No cabeçalho do HomeScreen
<button 
  onClick={async () => {
    console.log("🔴 Botão SAIR clicado!");
    localStorage.clear();
    sessionStorage.clear();
    await supabase.auth.signOut();
    window.location.href = '/';
  }}
  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition"
>
  SAIR
</button>