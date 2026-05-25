import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Shield, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  userId: string;
  onAccept: () => void;
}

export default function TermsModal({ userId, onAccept }: TermsModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);
  const [scrolledTerms, setScrolledTerms] = useState(false);
  const [scrolledPrivacy, setScrolledPrivacy] = useState(false);

  const handleAccept = useCallback(async () => {
    if (!isChecked) {
      toast.error('Você precisa concordar com os termos para continuar');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          termos_aceitos: true, 
          termos_aceito_em: new Date().toISOString(),
          termos_versao: '1.0'
        })
        .eq('id', userId);

      if (error) throw error;

      localStorage.setItem('termos_aceitos', 'true');
      localStorage.setItem('termos_aceito_em', new Date().toISOString());
      
      toast.success('Termos aceitos com sucesso!');
      onAccept();
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
    }
    setLoading(false);
  }, [isChecked, userId, onAccept]);

  const handleScrollTerms = useCallback(() => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setScrolledTerms(true);
      }
    }
  }, []);

  const handleScrollPrivacy = useCallback(() => {
    if (privacyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = privacyRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setScrolledPrivacy(true);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Ícone de Segurança */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-[#F4D03F] to-[#FFD966] rounded-full flex items-center justify-center shadow-lg">
            <Shield size={32} className="text-[#1E1E2F]" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-2">
          Termos de Uso e Privacidade
        </h2>
        <p className="text-[#A0A0B0] text-sm text-center mb-6">
          Para usar o ObaLeva, leia e concorde com nossos termos
        </p>

        {/* TERMOS DE USO */}
        <div className="mb-4">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full flex items-center justify-between bg-[#0F0B1A] rounded-xl px-4 py-3 text-white font-medium hover:bg-white/5 transition"
          >
            <span>📄 Termos de Uso</span>
            {showTerms ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          <AnimatePresence>
            {showTerms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div 
                  ref={termsRef}
                  onScroll={handleScrollTerms}
                  className="bg-[#0F0B1A] rounded-xl p-4 mt-2 max-h-48 overflow-y-auto text-sm text-[#A0A0B0] space-y-3 custom-scrollbar"
                >
                  <h3 className="text-[#F4D03F] font-bold text-sm">TERMOS DE USO DO OBALEVALe</h3>
                  <p><strong className="text-white">1. Aceitação:</strong> Ao usar o ObaLeva, você concorda com estes termos.</p>
                  <p><strong className="text-white">2. Serviço:</strong> Somos uma plataforma que conecta passageiros a motoristas parceiros.</p>
                  <p><strong className="text-white">3. Cadastro:</strong> Você deve fornecer informações verdadeiras e manter sua conta segura.</p>
                  <p><strong className="text-white">4. Conduta:</strong> É proibido uso ilegal, assédio ou discriminação.</p>
                  <p><strong className="text-white">5. Pagamentos:</strong> Valores calculados com base em distância e tempo.</p>
                  <p><strong className="text-white">6. Cancelamento:</strong> Taxas podem ser aplicadas conforme política.</p>
                  <p><strong className="text-white">7. Responsabilidade:</strong> A ObaLeva não se responsabiliza por atos de motoristas parceiros.</p>
                  <p><strong className="text-white">8. Propriedade Intelectual:</strong> Todo conteúdo é propriedade da ObaLeva.</p>
                  <p><strong className="text-white">9. Alterações:</strong> Podemos alterar estes termos a qualquer momento.</p>
                  <p><strong className="text-white">10. Lei Aplicável:</strong> Regido pelas leis brasileiras.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* POLÍTICA DE PRIVACIDADE */}
        <div className="mb-6">
          <button
            onClick={() => setShowPrivacy(!showPrivacy)}
            className="w-full flex items-center justify-between bg-[#0F0B1A] rounded-xl px-4 py-3 text-white font-medium hover:bg-white/5 transition"
          >
            <span>🔒 Política de Privacidade</span>
            {showPrivacy ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          <AnimatePresence>
            {showPrivacy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div 
                  ref={privacyRef}
                  onScroll={handleScrollPrivacy}
                  className="bg-[#0F0B1A] rounded-xl p-4 mt-2 max-h-48 overflow-y-auto text-sm text-[#A0A0B0] space-y-3 custom-scrollbar"
                >
                  <h3 className="text-[#F4D03F] font-bold text-sm">POLÍTICA DE PRIVACIDADE</h3>
                  <p><strong className="text-white">1. Dados Coletados:</strong> Nome, email, telefone, CPF, localização GPS.</p>
                  <p><strong className="text-white">2. Uso:</strong> Processar corridas, calcular valores, melhorar o serviço.</p>
                  <p><strong className="text-white">3. Compartilhamento:</strong> Motoristas parceiros, parceiros de pagamento, autoridades.</p>
                  <p><strong className="text-white">4. Armazenamento:</strong> Servidores seguros com criptografia.</p>
                  <p><strong className="text-white">5. Seus Direitos (LGPD):</strong> Acessar, corrigir, excluir seus dados, revogar consentimento.</p>
                  <p><strong className="text-white">6. Contato:</strong> privacidade@obaleva.com.br</p>
                  <p><strong className="text-white">7. Alterações:</strong> Notificaremos sobre mudanças significativas.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 bg-[#0F0B1A] p-4 rounded-xl cursor-pointer hover:bg-white/5 transition border border-white/10">
          <input 
            type="checkbox" 
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 w-5 h-5 accent-[#F4D03F] shrink-0"
          />
          <span className="text-sm text-[#A0A0B0]">
            Li e concordo com os <span className="text-[#F4D03F] font-bold">Termos de Uso</span> e a <span className="text-[#F4D03F] font-bold">Política de Privacidade</span> do ObaLeva.
          </span>
        </label>

        {/* Botão */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAccept}
          disabled={!isChecked || loading}
          className="w-full mt-5 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </span>
          ) : (
            <>
              <CheckCircle size={20} />
              Aceitar e Continuar
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}