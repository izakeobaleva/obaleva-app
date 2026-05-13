interface DriverContractProps {
  aceito: boolean
  onAcceptChange: (aceito: boolean) => void
}

export function DriverContract({ aceito, onAcceptChange }: DriverContractProps) {
  return (
    <div className="bg-[#0F0B1A] rounded-2xl border border-white/10 p-4 space-y-3">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <span className="text-lg">📋</span> Contrato de Prestação de Serviços
      </h3>

      <div className="max-h-48 overflow-y-auto text-xs text-[#A0A0B0] space-y-2 leading-relaxed pr-2 custom-scrollbar">
        <p>
          <strong className="text-white">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE INDIVIDUAL</strong>
        </p>
        <p>
          Ao se cadastrar como motorista parceiro da plataforma <strong className="text-white">OBALEVA</strong>, 
          você declara estar de acordo com os seguintes termos:
        </p>

        <p className="text-white font-semibold mt-3">1. DA PRESTAÇÃO DOS SERVIÇOS</p>
        <p>
          1.1. O motorista parceiro prestará serviços de transporte individual de passageiros, 
          de forma autônoma e independente, utilizando o aplicativo OBALEVA como plataforma 
          de intermediação.
        </p>
        <p>
          1.2. Não existe vínculo empregatício entre o motorista parceiro e a OBALEVA, 
          caracterizando-se a relação como autônoma e eventual.
        </p>

        <p className="text-white font-semibold mt-3">2. DAS OBRIGAÇÕES DO MOTORISTA</p>
        <p>
          2.1. Manter o veículo em perfeitas condições de uso, segurança e higiene.
        </p>
        <p>
          2.2. Portar todos os documentos obrigatórios (CNH, CRLV, documento do veículo).
        </p>
        <p>
          2.3. Tratar os passageiros com respeito, educação e cordialidade.
        </p>
        <p>
          2.4. Não recusar corridas com base em raça, gênero, religião ou orientação sexual.
        </p>
        <p>
          2.5. Manter seus dados cadastrais atualizados na plataforma.
        </p>

        <p className="text-white font-semibold mt-3">3. DA SEGURANÇA</p>
        <p>
          3.1. O motorista se compromete a não dirigir sob efeito de álcool ou drogas.
        </p>
        <p>
          3.2. O motorista autoriza a verificação de antecedentes criminais.
        </p>
        <p>
          3.3. O motorista concorda em utilizar apenas o veículo cadastrado na plataforma.
        </p>
        <p>
          3.4. Em caso de acidentes, o motorista deve seguir os protocolos de segurança 
          e acionar o suporte da OBALEVA imediatamente.
        </p>

        <p className="text-white font-semibold mt-3">4. DA REMUNERAÇÃO</p>
        <p>
          4.1. O motorista receberá o valor das corridas descontada a taxa administrativa 
          da plataforma, conforme tabela vigente.
        </p>
        <p>
          4.2. Os pagamentos serão processados semanalmente ou conforme política vigente.
        </p>

        <p className="text-white font-semibold mt-3">5. DA RESCISÃO</p>
        <p>
          5.1. O contrato pode ser rescindido a qualquer momento por ambas as partes.
        </p>
        <p>
          5.2. A OBALEVA reserva-se o direito de desativar a conta do motorista em caso 
          de descumprimento das cláusulas deste contrato ou denúncias graves.
        </p>

        <p className="text-white font-semibold mt-3">6. DA PROTEÇÃO DE DADOS</p>
        <p>
          6.1. Os dados pessoais serão tratados conforme a Lei Geral de Proteção de 
          Dados (LGPD), sendo utilizados exclusivamente para os fins da plataforma.
        </p>
        <p>
          6.2. O motorista autoriza o compartilhamento de seus dados básicos com 
          passageiros durante as corridas.
        </p>

        <p className="text-white mt-3">
          <strong>Este contrato é regido pelas leis brasileiras.</strong>
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-white/10">
        <input
          type="checkbox"
          checked={aceito}
          onChange={e => onAcceptChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[#F4D03F] rounded"
        />
        <div>
          <span className="text-white text-sm font-medium">
            Li e aceito os termos do contrato
          </span>
          <p className="text-[#A0A0B0] text-xs mt-0.5">
            Ao marcar esta opção, você concorda com todas as cláusulas acima
          </p>
        </div>
      </label>
    </div>
  )
}