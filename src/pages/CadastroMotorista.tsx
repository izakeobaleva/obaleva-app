"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { 
  ArrowLeft, User, Mail, Phone, CreditCard, 
  Car, Upload, CheckCircle, FileText, Image 
} from 'lucide-react';

export default function CadastroMotorista() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    modelo: '',
    placa: '',
    cor: '',
    ano: '',
  });
  
  const [files, setFiles] = useState<{ cnh: File | null; crlv: File | null }>({
    cnh: null,
    crlv: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cnh' | 'crlv') => {
    if (e.target.files?.[0]) {
      setFiles(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Faça login primeiro');

      let cnhUrl = '';
      let crlvUrl = '';

      // Upload CNH
      if (files.cnh) {
        const { data, error } = await supabase.storage
          .from('motoristas')
          .upload(`${user.id}/cnh.jpg`, files.cnh, { upsert: true });
        if (!error && data) {
          const { data: url } = supabase.storage.from('motoristas').getPublicUrl(data.path);
          cnhUrl = url.publicUrl;
        }
      }

      // Upload CRLV
      if (files.crlv) {
        const { data, error } = await supabase.storage
          .from('motoristas')
          .upload(`${user.id}/crlv.jpg`, files.crlv, { upsert: true });
        if (!error && data) {
          const { data: url } = supabase.storage.from('motoristas').getPublicUrl(data.path);
          crlvUrl = url.publicUrl;
        }
      }

      // Salvar na tabela motoristas
      const { error } = await supabase.from('motoristas').upsert({
        id: user.id,
        status: 'pendente',
        dados_veiculo: {
          modelo: form.modelo,
          placa: form.placa,
          cor: form.cor,
          ano: form.ano,
        },
        cnh_url: cnhUrl || null,
        crlv_url: crlvUrl || null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Atualizar tipo do usuário
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);

      toast.success('Cadastro enviado! Aguarde nossa análise.');
      navigate('/');
    } catch (err: any) {
      toast.error('Erro: ' + (err.message || 'Erro desconhecido'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] pb-24">
      <header className="sticky top-0 z-20 bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-[#A0A0B0] hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-white">Torne-se Motorista</h1>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {/* Progresso */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? 'bg-[#F4D03F] text-[#1E1E2F]' : 'bg-white/10 text-[#A0A0B0]'
              }`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-[#F4D03F]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-white font-bold text-lg mb-4">📋 Dados Pessoais</h2>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
              </div>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
              </div>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type="tel" name="telefone" placeholder="Telefone (11) 99999-9999" value={form.telefone} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
              </div>
              <div className="relative">
                <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-white font-bold text-lg mb-4">🚗 Dados do Veículo</h2>
              <div className="relative">
                <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type="text" name="modelo" placeholder="Modelo (Ex: Toyota Corolla)" value={form.modelo} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
              </div>
              <input type="text" name="placa" placeholder="Placa (Ex: ABC-1234)" value={form.placa} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
              <input type="text" name="cor" placeholder="Cor do Veículo" value={form.cor} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
              <input type="text" name="ano" placeholder="Ano (Ex: 2022)" value={form.ano} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0F0B1A] border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-white font-bold text-lg mb-4">📄 Documentos</h2>
              
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-[#F4D03F] transition">
                  <Image size={40} className="mx-auto mb-2 text-[#A0A0B0]" />
                  <p className="text-sm text-[#A0A0B0]">{files.cnh ? files.cnh.name : 'CNH (frente e verso)'}</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'cnh')} />
              </label>

              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-[#F4D03F] transition">
                  <FileText size={40} className="mx-auto mb-2 text-[#A0A0B0]" />
                  <p className="text-sm text-[#A0A0B0]">{files.crlv ? files.crlv.name : 'CRLV (documento do veículo)'}</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'crlv')} />
              </label>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-4 text-sm text-yellow-300">
                ⚠️ As fotos devem estar nítidas e legíveis para aprovação.
              </div>
            </>
          )}
        </motion.div>

        {/* Botões */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0F0B1A] border-t border-white/10 p-4">
          <div className="max-w-md mx-auto flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-2xl border border-white/20 text-white font-medium hover:bg-white/5 transition">
                Voltar
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : () => setStep(s => s + 1)}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Enviando...' : step === 3 ? '✅ Finalizar Cadastro' : 'Próximo'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}