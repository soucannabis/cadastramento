/**
 * Utilitário para salvar e ler o parâmetro bvid no localStorage com expiração de 7 dias.
 * Usado na rota /cadastro?bvid=XXX para rastrear origem do cadastro.
 */

const BVID_STORAGE_KEY = "cadastro_bvid";
const BVID_EXPIRY_DAYS = 7;

/**
 * Salva o bvid no localStorage com expiração de 7 dias.
 * @param {string} bvid - Valor do parâmetro bvid da URL
 */
export function setBvid(bvid) {
  if (!bvid || typeof bvid !== "string") return;
  const trimmed = bvid.trim();
  if (!trimmed) return;
  const expiresAt = Date.now() + BVID_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  try {
    window.localStorage.setItem(
      BVID_STORAGE_KEY,
      JSON.stringify({ value: trimmed, expiresAt })
    );
  } catch (e) {
    console.warn("bvidStorage: falha ao salvar bvid", e);
  }
}

/**
 * Retorna o bvid válido (não expirado) ou null.
 * Remove do localStorage se estiver expirado.
 * @returns {string|null}
 */
export function getBvid() {
  try {
    const raw = window.localStorage.getItem(BVID_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.value) return null;
    if (data.expiresAt && Date.now() > data.expiresAt) {
      window.localStorage.removeItem(BVID_STORAGE_KEY);
      return null;
    }
    return data.value;
  } catch (e) {
    return null;
  }
}

/**
 * Remove o bvid do localStorage (ex.: após usar no cadastro, se quiser consumir uma vez).
 * Opcional: não chamamos por padrão para permitir múltiplos cadastros com o mesmo link.
 */
export function clearBvid() {
  try {
    window.localStorage.removeItem(BVID_STORAGE_KEY);
  } catch (e) {
    console.warn("bvidStorage: falha ao limpar bvid", e);
  }
}
