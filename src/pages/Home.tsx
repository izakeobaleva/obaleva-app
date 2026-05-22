import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>OBALEVA</h1>
        <div style={styles.headerIcons}>
          <button style={styles.iconBtn} onClick={() => navigate('/perfil')}>👤</button>
        </div>
      </div>

      <div style={styles.locationBar}>
        <span>📍</span>
        <span>Parque Augusta, R. Augusta</span>
        <button style={styles.changeBtn}>Mudar</button>
      </div>

      <div style={styles.addressCard}>
        <div style={styles.addressRow}>
          <span style={styles.dotGreen}>●</span>
          <input type="text" placeholder="Onde você está?" style={styles.addressInput} />
        </div>
        <div style={styles.addressRow}>
          <span style={styles.dotRed}>●</span>
          <input type="text" placeholder="Para onde você vai?" style={styles.addressInput} />
        </div>
      </div>

      <button style={styles.callButton}>
        CHAMAR OBALEVA
      </button>

      <div style={styles.promoCard}>
        <span style={styles.promoIcon}>🍔</span>
        <div>
          <p style={styles.promoTitle}>Almoço com até 50% OFF</p>
          <p style={styles.promoText}>Peça agora</p>
        </div>
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
  logo: { fontSize: '20px', margin: 0, color: '#667eea' },
  headerIcons: { display: 'flex', gap: '12px' },
  iconBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  locationBar: { flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'white', borderBottom: '1px solid #eee', fontSize: '14px' },
  changeBtn: { marginLeft: 'auto', background: 'none', border: 'none', color: '#667eea', cursor: 'pointer' },
  addressCard: { flexShrink: 0, background: 'white', margin: '16px', borderRadius: '16px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  addressRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  dotGreen: { color: '#4CAF50', fontSize: '20px' },
  dotRed: { color: '#f44336', fontSize: '20px' },
  addressInput: { flex: 1, border: 'none', padding: '12px 0', fontSize: '16px', outline: 'none' },
  callButton: { flexShrink: 0, margin: '0 16px', padding: '16px', background: '#4CAF50', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '30px', fontSize: '16px', cursor: 'pointer' },
  promoCard: { flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px', margin: '16px', padding: '16px', background: 'linear-gradient(135deg, #ff9800, #ff5722)', borderRadius: '16px' },
  promoIcon: { fontSize: '32px' },
  promoTitle: { color: 'white', fontWeight: 'bold', margin: 0 },
  promoText: { color: 'rgba(255,255,255,0.9)', fontSize: '12px', margin: 0 },
  bottomNav: { flexShrink: 0, display: 'flex', background: 'white', borderTop: '1px solid #eee', padding: '12px', justifyContent: 'space-around' },
  navItem: { background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', padding: '8px', color: '#666' },
};

export default Home;