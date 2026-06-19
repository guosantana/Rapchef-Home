/**
 * RapChef Home — Integração Google Sheets
 * =========================================
 *
 * COMO USAR:
 * 1. Abra a planilha: https://docs.google.com/spreadsheets/d/1XQ4_2OhvExfGsg5kLGCQSawYAL4Ka1yXosULiQ-maMg/
 * 2. Vá em Extensões → Apps Script
 * 3. Cole este código inteiro, salve (Ctrl+S)
 * 4. Clique em "Implantar" → "Nova implantação"
 * 5. Tipo: "Web app" | Executar como: "Eu" | Acesso: "Qualquer pessoa"
 * 6. Clique em "Implantar", autorize e copie a URL gerada
 * 7. Cole a URL no index.html na variável SHEETS_WEBAPP_URL
 */

const SHEET_NAME = "Página1";

/**
 * Colunas esperadas na planilha (linha 1):
 *   A: Nome Completo
 *   B: Email
 *   C: Whatsapp (com DDD)
 *   D: Cidade/Estado
 *   E: Você já tem experiência com delivery ou venda online?
 *   F: Data/Hora
 */

function doPost(e) {
  try {
    var dados;
    if (e && e.postData && e.postData.type === "application/json") {
      dados = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      dados = e.parameter;
    } else {
      throw new Error("Nenhum dado recebido");
    }

    var nome        = (dados.nome        || "").trim();
    var email       = (dados.email       || "").trim();
    var whatsapp    = (dados.whatsapp    || "").trim();
    var cidade      = (dados.cidade      || "").trim();
    var experiencia = (dados.experiencia || "").trim();
    var timestamp   = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    if (!nome)     throw new Error("Campo 'nome' é obrigatório");
    if (!email)    throw new Error("Campo 'email' é obrigatório");
    if (!whatsapp) throw new Error("Campo 'whatsapp' é obrigatório");
    if (!cidade)   throw new Error("Campo 'cidade' é obrigatório");

    var ss    = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1XQ4_2OhvExfGsg5kLGCQSawYAL4Ka1yXosULiQ-maMg/");
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Aba "' + SHEET_NAME + '" não encontrada');

    sheet.appendRow([nome, email, whatsapp, cidade, experiencia, timestamp]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Lead salvo!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: erro.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "online" }))
    .setMimeType(ContentService.MimeType.JSON);
}
