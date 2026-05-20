// ... (keep all existing code, just update the handleLogout function)

const handleLogout = async () => {
  console.log("🔴 Clique no botão Sair");
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.log("Erro no signOut:", err);
  }
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/';
};