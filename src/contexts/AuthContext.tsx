-- Atualizar diretamente pelo ID
UPDATE usuarios 
SET tipo = 'motorista' 
WHERE id = '1c99951c-7cf4-483c-b59f-617640c51a7d';

-- Verificar
SELECT * FROM usuarios WHERE id = '1c99951c-7cf4-483c-b59f-617640c51a7d';