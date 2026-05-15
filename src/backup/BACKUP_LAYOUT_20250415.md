# 📦 Backup de Layout - MainScreen

**Data:** 15/04/2025  
**Motivo:** Salvaguarda do layout final após ajustes de tamanhos para celular.

## Estrutura salva

O layout completo da `MainScreen` (src/pages/MainScreen.tsx) foi preservado com:

### Componentes
- **LiveMap** — altura `h-56`, marcador pulsante central, coordenadas no canto inferior, nome e slogan no topo
- **LoginScreen** — `p-4`, ícone Chrome, formulário de e-mail, botão "Entrar"
- **PassengerDashboard** — `p-4`, campos de origem/destino, botão "Solicitar ObaLeva"
- **CadastroRapido** — `p-4`, formulário completo (nome, CPF, telefone, e-mail, senha, placa p/ motorista)
- **DiscoverBar** — cards roláveis 2 por vez (`min-w-[calc(50%-3px)]`), setas de navegação, 8 cards com ícones `size={24}`, tags "Promoção" e "▶️ Assistir"
- **BottomNav** — `minHeight: 56px`, `minWidth: 64px`, ícones `size={24}`, indicador ativo redondo

### Espaçamentos
- Todos os blocos separados por `mt-1` (4px)
- Container centralizado: `max-w-md mx-auto px-4`
- BottomNav: `mx-4` dentro do `flex justify-center`

### Correções aplicadas
- `import { toast } from 'sonner'` (com chaves)
- `LogOut` removido da importação (não utilizado)
- `ChevronRight` adicionado ao import (faltando na versão anterior)

## Comportamento por tipo de usuário
1. **Sem login** → LoginScreen (Google + e-mail)
2. **Logado sem perfil** → botões "Passageiro" / "Motorista" → CadastroRapido
3. **Passageiro** → PassengerDashboard (campos origem/destino + solicitar)
4. **Motorista** → card "Painel do Motorista - Aguardando aprovação - 🟢 Online"
5. **Admin** → card "Painel Administrativo"

## Inatividade automática
Logout automático após 5 minutos sem interação (mouse, teclado, clique).