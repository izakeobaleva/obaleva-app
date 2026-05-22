import React from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Meu Perfil</h1>
        <button onClick={() => navigate('/home')} style={styles.closeBtn}>✕</button>
      </div>

      <div style={styles.content}>
        <div style={styles.avatar}>👤</div>
        <p style={styles.name}>izakesoares</p>
        <p style={styles.email}>izakesoares@gmail.com</p>

        <div style={styles.badge}>
          <span>🚶 PASSAGEIRO</span>
        </div>

        <button style={styles.editBtn}>Editar perfil</button>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}><p style={styles.statValue}>0</p><p style={styles.statLabel}>Corridas</p></div>
          <div style={styles.statCard}><p style={styles.statValue}>0 km</p><p style={styles.statLabel}>km rodados</p></div>
          <div style={styles.statCard}><p style={styles.statValue}>R$ 0</p><p style={styles.statLabel}>Total gasto</p></div>
          <div style={styles.statCard}><p style={styles.statValue}>0 min</p><p style={styles.statLabel}>Tempo médio</p></div>
          <div style={styles.statCard}><p style={styles.statValue}>R$ 0</p><p style={styles.statLabel}>Economizado</p></div>
          <div style={styles.statCard}><p style={styles.statValue}>4.8</p><p style={styles.statLabel}>Média avaliações</p></div>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>⚙️ CONFIGURAÇÕES</p>
          <button style={styles.menuItem}>Editar perfil</button>
          <button style={styles.menuItem}>Formas de pagamento</button>
          <button style={styles.menuItem}>Histórico de corridas</button>
          <button style={styles.menuItem}>Endereços favoritos</button>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>📜 LEGAL</p>
          <button style={styles.menuItem}>Termos de Uso</button>
          <button style={styles.menuItem}>Política de Privacidade</button>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>🔔 PREFERÊNCIAS</p>
          <button style={styles.menuItem}>Notificações</button>
          <button style={styles.menuItem}>Idioma</button>
          <button style={styles.menuItem}>Tema escuro</button>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>🛡️ SEGURANÇA E AJUDA</p>
          <button style={styles.menuItem}>Central de segurança</button>
          <button style={styles.menuItem}>Central de ajuda</button>
          <button style={styles.menuItem}>Fale conosco</button>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>🌟 RECURSOS EXTRAS</p>
          <button onClick={() => navigate('/motorista-cadastro')} style={styles.menuItemHighlight}>
            🚛 Seja Motorista
          </button>
          <button style={styles.menuItem}>Convidar amigos</button>
          <button onClick={handleLogout} style={styles.menuItemDanger}>Sair da conta</button>
        </div>

        <p style={styles.version}>Versão 1.0.0</p>
        <p style={styles.copyright}>© 2026 ObaLeva - Sua corrida de confiança</p>
      </div>

      <div style={styles.bottomNav}>
        <button style={styles.navItem} onClick={() => navigate('/home')}>🏠 Início</button>
        <button style={styles.navItem}>🔍 Buscar</button>
        <button style={styles.navItem}>📋 Atividade</button>
        <button style={styles.navItem} onClick={() => navigate('/perfil')}>👤 Perfil</button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', borderBottom: '1px solid #eee' },
  title: { fontSize: '18px', margin: 0, fontWeight: 'bold' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  content: { flex: 1, overflow: 'auto', padding: '16px' },
  avatar: { fontSize: '60px', textAlign: 'center' },
  name: { textAlign: 'center', fontWeight: 'bold', marginTop: '8px' },
  email: { textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '8px' },
  badge: { textAlign: 'center', background: '#e0e0e0', padding: '4px', borderRadius: '20px', marginBottom: '16px' },
  editBtn: { width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' },
  statCard: { background: 'white', padding: '12px', borderRadius: '12px', textAlign: 'center' },
  statValue: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  statLabel: { fontSize: '12px', color: '#666', margin: 0 },
  section: { marginBottom: '20px' },
  sectionTitle: { fontWeight: 'bold', marginBottom: '8px', color: '#333' },
  menuItem: { display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', cursor: 'pointer', color: '#555', borderBottom: '1px solid #eee' },
  menuItemHighlight: { display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', cursor: 'pointer', color: '#ff9800', fontWeight: 'bold', borderBottom: '1px solid #eee' },
  menuItemDanger: { display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', cursor: 'pointer', color: '#f44336', borderBottom: '1px solid #eee' },
  version: { textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '20px' },
  copyright: { textAlign: 'center', fontSize: '11px', color: '#999', marginBottom: '20px' },
  bottomNav: { flexShrink: 0, display: 'flex', background: 'white', borderTop: '1px solid #eee', padding: '12px', justifyContent: 'space-around' },
  navItem: { background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', padding: '8px', color: '#666' },
};

export default Perfil;