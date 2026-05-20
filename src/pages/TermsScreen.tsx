import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, FileText, CheckCircle, Printer, Download, Eye, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface TermsScreenProps {
  onBack: () => void;
  user?: any;
  onAccept?: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onBack, user, onAccept }) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [acceptDate, setAcceptDate] = useState<string | null>(null);

  useEffect(() => {
    const checkPreviousAcceptance = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('usuarios')
          .select('termos_aceitos, termos_aceito_em')
          .eq('id', user.id)
          .single();
        
        if (data?.termos_aceitos) {
          setHasConfirmed(true);
          setAcceptDate(data.termos_aceito_em);
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
    setScrollPosition(target.scrollTop);
  };

  const handleConfirm = async () => {
    if (!hasReadToBottom) {
      alert('⚠️ Por favor, role até o final do documento para confirmar que leu todos os termos.');
      return;
    }

    if (user?.id) {
      await supabase
        .from('usuarios')
        .update({ 
          termos_aceitos: true, 
          termos_aceito_em: new Date().toISOString(),
          termos_versao: '1.0'
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
            <h2 className="text-white text-lg font-bold mb-2">Termos Aceitos com Sucesso!</h2>
            <p className="text-[#A0A0B0] text-sm">
              Você aceitou os Termos de Uso do ObaLeva em <strong className="text-[#F4D03F]">{acceptDate}</strong>
            </p>
          </div>

          <div className="bg-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20">
            <h3 className="text-[#F4D03F] font-bold mb-3 flex items-center gap-2">
              <FileText size={18} /> Comprovante de Leitura e Aceitação
            </h3>
            <div className="space-y-3 text-[#A0A0B0] text-sm">
              <p><strong>Usuário:</strong> {user?.email}</p>
              <p><strong>Data e hora da aceitação:</strong> {acceptDate}</p>
              <p><strong>Versão dos Termos:</strong> 1.0</p>
              <p><strong>IP de confirmação:</strong> Documento válido digitalmente</p>
              <p><strong>Status:</strong> ✅ Termos aceitos e confirmados</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-[#A0A0B0] text-xs text-center">
                Este comprovante é válido como documento eletrônico nos termos da MP 2.200-2/2001 e Lei 14.063/2020.
              </p>
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
          <h1 className="text-white text-xl font-bold">TERMOS DE USO</h1>
          <button className="text-[#A0A0B0] hover:text-white">
            <Printer size={20} />
          </button>
        </div>

        <div 
          className="bg-white/5 rounded-2xl p-5 border border-[#F4D03F]/20 h-[60vh] overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="text-center mb-6 pb-4 border-b border-white/10">
            <h2 className="text-white text-lg font-bold">TERMOS DE USO DO APLICATIVO OBALEVALe</h2>
            <p className="text-[#A0A0B0] text-xs mt-1">Versão 1.0 - Maio de 2026</p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">1</span>
              ACEITAÇÃO DOS TERMOS
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Ao utilizar o aplicativo ObaLeva, você declara expressamente que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição, você não está autorizado a utilizar o aplicativo.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">2</span>
              SERVIÇOS OFERECIDOS
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              O ObaLeva atua exclusivamente como plataforma tecnológica de intermediação, conectando Passageiros a Motoristas parceiros autônomos. A ObaLeva NÃO é uma empresa de transporte. Os serviços de transporte são prestados exclusivamente pelos Motoristas parceiros, que são profissionais autônomos e independentes.
            </p>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8 mt-2">
              A ObaLeva não se responsabiliza pela conduta, qualidade do serviço ou qualquer ato praticado pelos Motoristas, agindo estes por conta e risco próprios.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">3</span>
              CADASTRO E CONTA
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Para utilizar os serviços, é necessário criar uma conta fornecendo informações verdadeiras, precisas e completas. Você é integralmente responsável pela confidencialidade de sua senha e por todas as atividades ocorridas em sua conta.
            </p>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8 mt-2">
              Você concorda em notificar imediatamente a ObaLeva sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">4</span>
              CONDUTA DO USUÁRIO
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Você concorda em utilizar o serviço apenas para fins legais e de acordo com estes Termos. É expressamente proibido:
            </p>
            <ul className="text-[#A0A0B0] text-sm leading-relaxed pl-12 mt-2 space-y-1 list-disc">
              <li>Utilizar o aplicativo para qualquer finalidade ilegal ou não autorizada;</li>
              <li>Praticar qualquer ato de violência, assédio, discriminação ou falta de respeito;</li>
              <li>Tentar interferir ou comprometer a segurança do sistema;</li>
              <li>Fornecer informações falsas ou enganosas.</li>
            </ul>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">5</span>
              PAGAMENTOS E TARIFAS
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Os valores das corridas são calculados com base na distância percorrida, tempo de viagem e tarifas dinâmicas, conforme exibido no aplicativo antes da confirmação da corrida. Você concorda em pagar todos os valores devidos integralmente.
            </p>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8 mt-2">
              A ObaLeva se reserva o direito de aplicar tarifas diferenciadas em horários de pico, eventos especiais ou condições climáticas adversas.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">6</span>
              CANCELAMENTO
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Você pode cancelar uma corrida a qualquer momento antes do início da viagem. Taxas de cancelamento poderão ser aplicadas conforme política da plataforma, devidamente informada no aplicativo.
            </p>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8 mt-2">
              Cancelamentos recorrentes ou abusivos poderão resultar em suspensão ou bloqueio da conta.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">7</span>
              PROPRIEDADE INTELECTUAL
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Todo o conteúdo do aplicativo, incluindo marcas, logotipos, textos, imagens, software e código-fonte, são de propriedade exclusiva da ObaLeva ou de seus licenciantes, sendo protegidos pelas leis de propriedade intelectual.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">8</span>
              LIMITAÇÃO DE RESPONSABILIDADE
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Em nenhuma hipótese a ObaLeva será responsável por danos indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da impossibilidade de uso do aplicativo.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">9</span>
              ALTERAÇÕES NOS TERMOS
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              A ObaLeva poderá alterar estes Termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no aplicativo. O uso continuado do serviço após tais alterações constituirá sua concordância com os novos termos.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-[#F4D03F] font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-sm">10</span>
              LEI APLICÁVEL E FORO
            </h3>
            <p className="text-[#A0A0B0] text-sm leading-relaxed pl-8">
              Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da comarca de sua residência para dirimir qualquer controvérsia oriunda destes Termos.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[#A0A0B0] text-xs">
              Última atualização: Maio de 2026
            </p>
            <p className="text-[#F4D03F] text-xs mt-1 font-bold">
              ObaLeva - Sua corrida de confiança
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className={hasReadToBottom ? 'text-green-400' : 'text-[#A0A0B0]'} />
            <span className="text-[10px] text-[#A0A0B0]">
              {hasReadToBottom ? '✓ Documento lido até o final' : 'Role até o final do documento para confirmar a leitura'}
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
          {hasReadToBottom ? 'CONFIRMO QUE LI E ACEITO OS TERMOS' : 'LEIA O DOCUMENTO ATÉ O FINAL'}
        </button>
      </div>
    </div>
  );
};

export default TermsScreen;