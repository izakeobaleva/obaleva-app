# 📦 Backup antes do Fluxo Completo de Corrida

**Data:** 15/04/2025  
**Motivo:** Salvaguarda antes de implementar o fluxo completo de solicitar corrida (rideService, RideStatusModal, lógica de matching)

## Arquivos que serão modificados:
- `src/pages/MainScreen.tsx` — Adicionar importações, estado, lógica de solicitar corrida e modal

## Arquivos que serão criados:
- `src/services/rideService.ts` — Serviço completo de corridas
- `src/components/RideStatusModal.tsx` — Modal de acompanhamento

## Estrutura atual preservada
```
src/
  pages/MainScreen.tsx  ← layout compacto com mapa iframe 180px
  components/MapComponent.tsx  ← iframe Google Maps
  services/(novo) rideService.ts
  components/(novo) RideStatusModal.tsx
```

Código-fonte completo preservado no histórico da conversa.