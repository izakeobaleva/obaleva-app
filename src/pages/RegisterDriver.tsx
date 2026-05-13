"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { StepIndicator } from '../components/driver-registration/StepIndicator';
import { PersonalDataStep } from '../components/driver-registration/PersonalDataStep';
import { AddressStep } from '../components/driver-registration/AddressStep';
import { DocumentsStep } from '../components/driver-registration/DocumentsStep';
import { ReviewStep } from '../components/driver-registration/ReviewStep';
import { FormActions } from '../components/driver-registration/FormActions';

type Etapa = 1 | 2 | 3 | 4;
const TOTAL_ETAPAS = 4;

export function RegisterDriver() {
  const navigate = useNavigate();

  // Etapa 1 - Dados pessoais
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Etapa 2 - Endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Etapa 3 - Documentos e veículo
  const [frenteCnh, setFrenteCnh] = useState<string | null>(null);
  const [versoCnh, setVersoCnh] = useState<string | null>(null);
  const [selfieCnh, setSelfieCnh] = useState<string | null>(null);
  const [crlv, setCrlv] = useState<string | null>(null);
  const [certidaoAntecedentes, setCertidaoAntecedentes] = useState<string | null>(null);
  const [modeloVeiculo, setModeloVeiculo] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [anoVeiculo, setAnoVeiculo] = useState('');
  const [corVeiculo, setCorVeiculo] = useState('');

  // Etapa 4 - Contrato
  const [contratoAceito, setContratoAceito] = useState(false);

  const [etapa, setEtapa] = useState<Etapa>(1);
  const [loading, setLoading] = useState(false);

  const formatarCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const buscarCep = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      }
    } catch {}
  };

  const validarEtapa1 = () => {
    if (!nome || !cpf || !dataNascimento || !email || !telefone || !password) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return false;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return false;
    }
    return true;
  };

  const validarEtapa2 = () => {
    if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
      toast.error('Preencha todos os campos de endereço');
      return false;
    }
    return true;
  };

  const validarEtapa3 = () => {
    if (!frenteCnh || !versoCnh || !selfieCnh) {
      toast.error('Envie a foto da CNH (frente e verso) e a selfie com a CNH');
      return false;
    }
    if (!crlv) {
      toast.error('Envie o CRLV do veículo');
      return false;
    }
    if (!modeloVeiculo || !placaVeiculo || !anoVeiculo || !corVeiculo) {
      toast.error('Preencha todos os dados do veículo');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (etapa === 1 && validarEtapa1()) setEtapa(2);
    else if (etapa === 2 && validarEtapa2()) setEtapa(3);
    else if (etapa === 3 && validarEtapa3()) setEtapa(4);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contratoAceito) {
      toast.error('Você precisa aceitar o contrato para se cadastrar');
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'motorista', cpf: cpf.replace(/\D/g, '') } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        telefone,
        tipo: 'motorista',
      });

      await supabase.from('motoristas').insert({
        id: authData.user.id,
        status: 'pendente',
        dados_veiculo: { modelo: modeloVeiculo, placa: placaVeiculo.toUpperCase(), ano: anoVeiculo, cor: corVeiculo },
        documentos: { cnh_frente: frenteCnh, cnh_verso: versoCnh, selfie_cnh: selfieCnh, crlv: crlv, certidao_antecedentes: certidaoAntecedentes },
        endereco: { cep: cep.replace(/\D/g, ''), logradouro, numero, complemento, bairro, cidade, estado },
        contrato_aceito: true,
        contrato_aceito_em: new Date().toISOString(),
      });

      toast.success('Cadastro realizado com sucesso! Aguarde a aprovação.', { duration: 5000, icon: '✅' });
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (etapa > 1) {
      setEtapa((etapa - 1) as Etapa);
    } else {
      navigate('/login');
    }
  };

  const temDocumentos = !!(frenteCnh && versoCnh && selfieCnh && crlv);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-sm mx-auto p-4"
      >
        <div className="flex items-center mb-3">
          <button
            onClick={handleBack}
            className="btn-outline-dark"
            type="button"
            style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center -ml-12">
            <h1 className="text-base font-bold text-white">Motorista</h1>
          </div>
        </div>

        <StepIndicator currentStep={etapa} totalSteps={TOTAL_ETAPAS} />

        <form onSubmit={etapa === 4 ? handleRegister : (e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {etapa === 1 && (
              <PersonalDataStep
                nome={nome}
                cpf={cpf}
                dataNascimento={dataNascimento}
                email={email}
                telefone={telefone}
                password={password}
                confirmPassword={confirmPassword}
                onNomeChange={setNome}
                onCpfChange={setCpf}
                onDataNascimentoChange={setDataNascimento}
                onEmailChange={setEmail}
                onTelefoneChange={setTelefone}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                formatarCpf={formatarCpf}
              />
            )}

            {etapa === 2 && (
              <AddressStep
                cep={cep}
                logradouro={logradouro}
                numero={numero}
                complemento={complemento}
                bairro={bairro}
                cidade={cidade}
                estado={estado}
                onCepChange={setCep}
                onLogradouroChange={setLogradouro}
                onNumeroChange={setNumero}
                onComplementoChange={setComplemento}
                onBairroChange={setBairro}
                onCidadeChange={setCidade}
                onEstadoChange={setEstado}
                buscarCep={buscarCep}
                formatarCep={formatarCep}
              />
            )}

            {etapa === 3 && (
              <DocumentsStep
                frenteCnh={frenteCnh}
                versoCnh={versoCnh}
                selfieCnh={selfieCnh}
                crlv={crlv}
                certidaoAntecedentes={certidaoAntecedentes}
                modeloVeiculo={modeloVeiculo}
                placaVeiculo={placaVeiculo}
                anoVeiculo={anoVeiculo}
                corVeiculo={corVeiculo}
                onFrenteCnhChange={setFrenteCnh}
                onVersoCnhChange={setVersoCnh}
                onSelfieCnhChange={setSelfieCnh}
                onCrlvChange={setCrlv}
                onCertidaoChange={setCertidaoAntecedentes}
                onModeloChange={setModeloVeiculo}
                onPlacaChange={setPlacaVeiculo}
                onAnoChange={setAnoVeiculo}
                onCorChange={setCorVeiculo}
              />
            )}

            {etapa === 4 && (
              <ReviewStep
                nome={nome}
                cpf={cpf}
                modeloVeiculo={modeloVeiculo}
                placaVeiculo={placaVeiculo}
                temDocumentos={temDocumentos}
                contratoAceito={contratoAceito}
                onContratoChange={setContratoAceito}
              />
            )}
          </AnimatePresence>

          <FormActions
            etapa={etapa}
            totalEtapas={TOTAL_ETAPAS}
            loading={loading}
            disabled={!contratoAceito}
            onNext={handleNext}
          />
        </form>
      </motion.div>
    </div>
  );
}
</dyad-wider>

<dyad-chat-summary>Refatorando cadastro motorista em componentes</dyad-chat-summary>

Pronto! O `RegisterDriver.tsx` foi reduzido de ~500 linhas para ~200 linhas. Criei **6 componentes menores** dentro de `src/components/driver-registration/`:

1. **`StepIndicator`** — bolinhas indicadoras de progresso
2. **`PersonalDataStep`** — Etapa 1 (dados pessoais) com seus subcomponentes `InputField` e `PasswordField`
3. **`AddressStep`** — Etapa 2 (endereço)
4. **`DocumentsStep`** — Etapa 3 (documentos e veículo)
5. **`ReviewStep`** — Etapa 4 (revisão e contrato)
6. **`FormActions`** — botões de próximo/enviar

Cada componente é focado, fácil de manter e reutilizável.

<dyad-command type="rebuild"></dyad-command>Vou continuar de onde parei e finalizar o `RegisterDriver.tsx`:

<dyad-write path="src/pages/RegisterDriver.tsx" description="Versão refatorada e completa com componentes modulares">
"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { StepIndicator } from '../components/driver-registration/StepIndicator';
import { PersonalDataStep } from '../components/driver-registration/PersonalDataStep';
import { AddressStep } from '../components/driver-registration/AddressStep';
import { DocumentsStep } from '../components/driver-registration/DocumentsStep';
import { ReviewStep } from '../components/driver-registration/ReviewStep';
import { FormActions } from '../components/driver-registration/FormActions';

type Etapa = 1 | 2 | 3 | 4;
const TOTAL_ETAPAS = 4;

export function RegisterDriver() {
  const navigate = useNavigate();

  // Etapa 1 - Dados pessoais
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Etapa 2 - Endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Etapa 3 - Documentos e veículo
  const [frenteCnh, setFrenteCnh] = useState<string | null>(null);
  const [versoCnh, setVersoCnh] = useState<string | null>(null);
  const [selfieCnh, setSelfieCnh] = useState<string | null>(null);
  const [crlv, setCrlv] = useState<string | null>(null);
  const [certidaoAntecedentes, setCertidaoAntecedentes] = useState<string | null>(null);
  const [modeloVeiculo, setModeloVeiculo] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [anoVeiculo, setAnoVeiculo] = useState('');
  const [corVeiculo, setCorVeiculo] = useState('');

  // Etapa 4 - Contrato
  const [contratoAceito, setContratoAceito] = useState(false);

  const [etapa, setEtapa] = useState<Etapa>(1);
  const [loading, setLoading] = useState(false);

  const formatarCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const buscarCep = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      }
    } catch {}
  };

  const validarEtapa1 = () => {
    if (!nome || !cpf || !dataNascimento || !email || !telefone || !password) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return false;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return false;
    }
    return true;
  };

  const validarEtapa2 = () => {
    if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
      toast.error('Preencha todos os campos de endereço');
      return false;
    }
    return true;
  };

  const validarEtapa3 = () => {
    if (!frenteCnh || !versoCnh || !selfieCnh) {
      toast.error('Envie a foto da CNH (frente e verso) e a selfie com a CNH');
      return false;
    }
    if (!crlv) {
      toast.error('Envie o CRLV do veículo');
      return false;
    }
    if (!modeloVeiculo || !placaVeiculo || !anoVeiculo || !corVeiculo) {
      toast.error('Preencha todos os dados do veículo');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (etapa === 1 && validarEtapa1()) setEtapa(2);
    else if (etapa === 2 && validarEtapa2()) setEtapa(3);
    else if (etapa === 3 && validarEtapa3()) setEtapa(4);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contratoAceito) {
      toast.error('Você precisa aceitar o contrato para se cadastrar');
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'motorista', cpf: cpf.replace(/\D/g, '') } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        telefone,
        tipo: 'motorista',
      });

      await supabase.from('motoristas').insert({
        id: authData.user.id,
        status: 'pendente',
        dados_veiculo: { modelo: modeloVeiculo, placa: placaVeiculo.toUpperCase(), ano: anoVeiculo, cor: corVeiculo },
        documentos: { cnh_frente: frenteCnh, cnh_verso: versoCnh, selfie_cnh: selfieCnh, crlv: crlv, certidao_antecedentes: certidaoAntecedentes },
        endereco: { cep: cep.replace(/\D/g, ''), logradouro, numero, complemento, bairro, cidade, estado },
        contrato_aceito: true,
        contrato_aceito_em: new Date().toISOString(),
      });

      toast.success('Cadastro realizado com sucesso! Aguarde a aprovação.', { duration: 5000, icon: '✅' });
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (etapa > 1) {
      setEtapa((etapa - 1) as Etapa);
    } else {
      navigate('/login');
    }
  };

  const temDocumentos = !!(frenteCnh && versoCnh && selfieCnh && crlv);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-sm mx-auto p-4"
      >
        <div className="flex items-center mb-3">
          <button
            onClick={handleBack}
            className="btn-outline-dark"
            type="button"
            style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center -ml-12">
            <h1 className="text-base font-bold text-white">Motorista</h1>
          </div>
        </div>

        <StepIndicator currentStep={etapa} totalSteps={TOTAL_ETAPAS} />

        <form onSubmit={etapa === 4 ? handleRegister : (e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {etapa === 1 && (
              <PersonalDataStep
                nome={nome}
                cpf={cpf}
                dataNascimento={dataNascimento}
                email={email}
                telefone={telefone}
                password={password}
                confirmPassword={confirmPassword}
                onNomeChange={setNome}
                onCpfChange={setCpf}
                onDataNascimentoChange={setDataNascimento}
                onEmailChange={setEmail}
                onTelefoneChange={setTelefone}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                formatarCpf={formatarCpf}
              />
            )}

            {etapa === 2 && (
              <AddressStep
                cep={cep}
                logradouro={logradouro}
                numero={numero}
                complemento={complemento}
                bairro={bairro}
                cidade={cidade}
                estado={estado}
                onCepChange={setCep}
                onLogradouroChange={setLogradouro}
                onNumeroChange={setNumero}
                onComplementoChange={setComplemento}
                onBairroChange={setBairro}
                onCidadeChange={setCidade}
                onEstadoChange={setEstado}
                buscarCep={buscarCep}
                formatarCep={formatarCep}
              />
            )}

            {etapa === 3 && (
              <DocumentsStep
                frenteCnh={frenteCnh}
                versoCnh={versoCnh}
                selfieCnh={selfieCnh}
                crlv={crlv}
                certidaoAntecedentes={certidaoAntecedentes}
                modeloVeiculo={modeloVeiculo}
                placaVeiculo={placaVeiculo}
                anoVeiculo={anoVeiculo}
                corVeiculo={corVeiculo}
                onFrenteCnhChange={setFrenteCnh}
                onVersoCnhChange={setVersoCnh}
                onSelfieCnhChange={setSelfieCnh}
                onCrlvChange={setCrlv}
                onCertidaoChange={setCertidaoAntecedentes}
                onModeloChange={setModeloVeiculo}
                onPlacaChange={setPlacaVeiculo}
                onAnoChange={setAnoVeiculo}
                onCorChange={setCorVeiculo}
              />
            )}

            {etapa === 4 && (
              <ReviewStep
                nome={nome}
                cpf={cpf}
                modeloVeiculo={modeloVeiculo}
                placaVeiculo={placaVeiculo}
                temDocumentos={temDocumentos}
                contratoAceito={contratoAceito}
                onContratoChange={setContratoAceito}
              />
            )}
          </AnimatePresence>

          <FormActions
            etapa={etapa}
            totalEtapas={TOTAL_ETAPAS}
            loading={loading}
            disabled={!contratoAceito}
            onNext={handleNext}
          />
        </form>
      </motion.div>
    </div>
  );
}