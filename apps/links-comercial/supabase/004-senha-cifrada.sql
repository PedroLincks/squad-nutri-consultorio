-- Migração 4 (28/10/2026): cópia cifrada (AES-GCM) da senha da vendedora, para o botão "Ver senha" do admin.
-- O login continua usando senha_hash. Rodar no SQL Editor do projeto. Idempotente.

alter table public.vendedoras add column if not exists senha_cifrada text;
