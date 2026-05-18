useEffect(() => {
  const checkSession = async () => {
    try {
      console.log("🔍 Verificando sessão...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("📱 Sessão encontrada:", session?.user?.email || "Nenhuma");
      
      if (session?.user) {
        // Verificar se o perfil existe
        const { data: profile } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (!profile) {
          console.log("⚠️ Usuário sem perfil, fazendo logout...");
          await supabase.auth.signOut();
          localStorage.clear();
          sessionStorage.clear();
          setUser(null);
        } else {
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Erro:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkSession();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log("🔄 Auth state changed:", _event, session?.user?.email);
    setUser(session?.user || null);
  });

  return () => subscription.unsubscribe();
}, []);