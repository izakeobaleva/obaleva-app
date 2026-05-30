import { Shield } from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  card: '#1a1a2e',
  texto: '#ffffff',
  textoCinza: '#9ca3af',
};

export function AboutSection() {
  return (
    <div style={{
      flexShrink: 0,
      backgroundColor: COLORS.card,
      margin: '0 16px 12px 16px',
      borderRadius: '16px',
      border: `1px solid ${COLORS.roxo}40`,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: COLORS.roxo + '15',
        borderBottom: `1px solid ${COLORS.roxo}40`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color={COLORS.amarelo} />
          <span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>ℹ️ SOBRE</span>
        </div>
      </div>
      
      <div style={{ padding: '12px 16px' }}>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Versão do aplicativo</span>
          <p style={{ color: COLORS.texto, fontSize: '13px', marginTop: '2px' }}>ObaLeva v1.0.0</p>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Termos de uso</span>
          <p style={{ color: COLORS.amarelo, fontSize: '12px', marginTop: '2px', cursor: 'pointer' }}>Consultar termos →</p>
        </div>
        <div>
          <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Política de privacidade</span>
          <p style={{ color: COLORS.amarelo, fontSize: '12px', marginTop: '2px', cursor: 'pointer' }}>Consultar política →</p>
        </div>
      </div>
    </div>
  );
}