-- Script para adicionar colunas de controle de termos de uso
-- Execute este SQL uma única vez no SQL Editor do Supabase

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS termos_aceitos BOOLEAN DEFAULT FALSE;

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS termos_aceito_em TIMESTAMP WITH TIME ZONE;

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS termos_versao TEXT DEFAULT '1.0';