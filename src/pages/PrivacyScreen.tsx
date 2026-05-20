import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Share2, CheckCircle, Clock, Printer } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface PrivacyScreenProps {
  onBack: () => void;
  user?: any;
  onAccept?: () => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack, user, onAccept }) => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [acceptDate, setAcceptDate] = useState<string | null>(null);

  useEffect(() => {
    const checkPreviousAcceptance = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('usuarios')
          .select('privacidade_aceita, privacidade_aceito_em')
          .eq('id', user.id)
          .single();
        
        if (data?.privacidade_aceita) {
          setHasConfirmed(true);
          setAcceptDate(data.privacidade_aceito_em);
        }
      }
    };
    checkPreviousAcceptance();
  }, [user]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom) {
      setHasReadToBottom(true);
    }
  };

  const handleConfirm = async () => {
    if (!hasReadToBottom) {
      alert('⚠️ Por favor, role até o final do documento para confirmar que leu toda a política.');
      return;
    }

    if (user?.id) {
      await supabase
        .from('usuarios')
        .update({ 
          privacidade_aceita: true, 
          privacidade_aceito_em: new Date().toISOString(),
          privacidade_versao: '1.0'
        })
        .eq('id', user.id);
    }

    setHasConfirmed(true);
    setAcceptDate(new Date().toLocaleString('pt-BR'));
    
    if (onAccept) {
      onAccept();
    }
  };

  if (hasConfirmed && acceptDate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        <div className="max-w-md mx-auto px-4 pb-24">
          <div className="flex items-center gap-3 py-4">
            <button onClick={onBack} className="text-[#A0A0B0] hover:text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-xl font-bold">Comprovante de Aceitação</h1>
          </div>

          <div className="bg-green-500/10 border border-green-500 rounded-2xl p-6 text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-white text-lg font-bold mb-2">Política de Privacidade Aceita!</h2>
            <p className="text-[#A0A0B0] text-sm">
              Você aceitou a Política de Privacidade do ObaLeva em <strong className="text-[#F4D03F]">{acceptDate}</strong>
            </p>
          </div>

          <div className="bg-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20">
            <h3 className="text-[#F4D03F] font-bold mb-3 flex items-center gap-2">
              <Lock size={18} /> Comprovante de Aceitação
            </h3>
            <div className="space-y-3 text-[#A0A0B0] text-sm">
              <p><strong>Usuário:</strong> {user?.email}</p>
              <p><strong>Data e hora da aceitação:</strong> {acceptDate}</p>
              <p><strong>Versão da Política:</strong> 1.0</p>
              <p><strong>Status:</strong> ✅ Política aceita e confirmada</p>
            </div>
          </div>

          <button onClick={onBack} className="w-full mt-4 py-3 rounded-xl bg-[#F4D03F] text-black font-bold">
            Voltar ao Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center justify-between py-4">
          <button onClick={onBack} className="text-[#A0A0B0] hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">POLÍTICA DE PRIVACIDADE</h1>
          <button className="text-[#A0A0B0] hover:text-white">
            <Printer size={20} />
          </button>
        </div>

        <div 
          className="bg-white/5 rounded-2xl p-5 border border-[#F4D03F]/20 h-[60vh] overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="text-center mb-6 pb-4 border-b border-white/10">
            <h2 className="text-white text-lg font-bold">POLÍTICA DE PRIVACIDADE DO OBALEVALe</h2>
            <p className="text-[#A0A0B0] text-xs mt-1">Versão 1.0 - Maio de 2026</p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2">1. INFORMAÇÕES COLETADAS</h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed">
              Coletamos as seguintes informações para fornecer nossos serviços:
            </p>
            <ul className="text-[#A0A0B0] text-sm leading-relaxed mt-2 space-y-1 list-disc pl-5">
              <li>Dados de identificação (nome, e-mail, telefone, CPF);</li>
              <li>Dados de localização (GPS do dispositivo durante o uso);</li>
              <li>Dados de corrida (origem, destino, horário, valor);</li>
              <li>Dados de pagamento;</li>
              <li>Dados de avaliações e histórico.</li>
            </ul>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2">2. USO DAS INFORMAÇÕES</h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed">
              Utilizamos seus dados para: processar corridas, calcular valores, melhorar o serviço, enviar notificações sobre o status da corrida, comunicar promoções (com seu consentimento) e cumprir obrigações legais.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2">3. COMPARTILHAMENTO DE DADOS</h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed">
              Compartilhamos seus dados com:
            </p>
            <ul className="text-[#A0A0B0] text-sm leading-relaxed mt-2 space-y-1 list-disc pl-5">
              <li>Motoristas parceiros (para execução da corrida);</li>
              <li>Parceiros de pagamento (para processamento de transações);</li>
              <li>Autoridades públicas, quando exigido por lei.</li>
            </ul>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2">4. ARMAZENAMENTO E SEGURANÇA</h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed">
              Seus dados são armazenados em servidores seguros com criptografia. Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou destruição.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2">5. SEUS DIREITOS (LGPD)</h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed">
              Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:
            </p>
            <ul className="text-[#A0A0B0] text-sm leading-relaxed mt-2 space-y-1 list-disc pl-5">
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Acessar seus dados;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a exclusão de seus dados;</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2">6. CONTATO DO ENCARREGADO (DPO)</h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed">
              Para exercer seus direitos ou tirar dúvidas sobre esta Política, entre em contato conosco:
            </p>
            <p className="text-white text-sm mt-2">📧 privacidade@obaleva.com.br</p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2">7. ALTERAÇÕES NA POLÍTICA</h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed">
              Esta Política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas por meio do aplicativo ou e-mail.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[#A0A0B0] text-xs">Última atualização: Maio de 2026</p>
            <p className="text-[#F4D03F] text-xs mt-1 font-bold">ObaLeva - Sua corrida de confiança</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className={hasReadToBottom ? 'text-green-400' : 'text-[#A0A0B0]'} />
            <span className="text-[10px] text-[#A0A0B0]">
              {hasReadToBottom ? '✓ Documento lido até o final' : 'Role até o final para confirmar a leitura'}
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!hasReadToBottom}
          className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
            hasReadToBottom 
              ? 'bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black hover:scale-[1.02]' 
              : 'bg-white/10 text-[#A0A0B0] cursor-not-allowed'
          }`}
        >
          <CheckCircle size={18} />
          {hasReadToBottom ? 'CONFIRMO QUE LI E ACEITO A POLÍTICA DE PRIVACIDADE' : 'LEIA O DOCUMENTO ATÉ O FINAL'}
        </button>
      </div>
    </div>
  );
};

export default PrivacyScreen;