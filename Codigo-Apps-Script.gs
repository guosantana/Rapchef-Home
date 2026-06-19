/**
 * RapChef Home — Integração Google Sheets
 * =========================================
 * 
 * COMO USAR:
 * 1. Abra a planilha: https://docs.google.com/spreadsheets/d/1XQ4_2OhvExfGsg5kLGCQSawYAL4Ka1yXosULiQ-maMg/
 * 2. Vá em Extensões → Apps Script
 * 3. Cole este código inteiro e salve (Ctrl+S)
 * 4. Clique em "Implantar" → "Nova implantação"
 * 5. Tipo: "Web app", Executar como: "Eu", Quem pode acessar: "Qualquer pessoa"
 * 6. Clique em "Implantar" e copie a URL gerada
 * 7. Cole a URL no arquivo index.html (na variável SHEETS_WEBAPP_URL)
 */

// Nome da aba da planilha (geralmente "Página1" ou o nome que você definiu)
const SHEET_NAME = "Página1";

/**
 * Recebe os dados via POST e salva na planilha.
 * Aceita JSON no corpo da requisição ou parâmetros de formulário.
 */
function doPost(e) {
  try {
    // Extrai os dados — aceita tanto JSON quanto form-urlencoded
    let dados;
    if (e && e.postData && e.postData.type === "application/json") {
      dados = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      dados = e.parameter;
    } else {
      throw new Error("Nenhum dado recebido");
    }

    // Mapeia os campos esperados
    const nome       = (dados.nome       || "").trim();
    const whatsapp   = (dados.whatsapp   || "").trim();
    const cidade     = (dados.cidade     || "").trim();
    const experiencia = (dados.experiencia || "").trim();
    const timestamp  = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    // Valida campos obrigatórios
    if (!nome)       throw new Error("Campo 'nome' é obrigatório");
    if (!whatsapp)   throw new Error("Campo 'whatsapp' é obrigatório");
    if (!cidade)     throw new Error("Campo 'cidade' é obrigatório");

    // Abre a planilha e a aba
    const ss = SpreadsheetApp.openByUrl(
      "https://docs.google.com/spreadsheets/d/1XQ4_2OhvExfGsg5kLGCQSawYAL4Ka1yXosULiQ-maMg/"
    );
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Aba "${SHEET_NAME}" não encontrada`);

    // Adiciona uma nova linha no final
    sheet.appendRow([timestamp, nome, whatsapp, cidade, experiencia]);

    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Lead salvo com sucesso!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: erro.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Responde GET com instruções (útil para testar se o web app está no ar).
 */
function doGet() {
  return ContentService
    .createTextOutput(
      JSON.stringify({
        status: "online",
        instrucao: "Envie um POST com os campos: nome, whatsapp, cidade, experiencia"
      })
    )
    .setMimeType(ContentService.MimeType.JSON);
}
