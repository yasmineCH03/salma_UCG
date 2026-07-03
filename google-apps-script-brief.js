const NOTIFY_EMAIL = "salmabenhassinee@gmail.com";
const SHEET_NAME = "Briefs";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet();

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.brand || "",
      data.budget || "",
      data.message || ""
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: data.email || "",
        subject: "Nouveau brief — " + (data.brand || data.name || "site UGC"),
        htmlBody: buildEmail(data)
      });
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "Salma UGC portfolio brief capture" });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Date", "Nom", "Email", "Marque", "Budget", "Message"]);
    sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function buildEmail(data) {
  return `
    <h2>Nouveau brief recu depuis le site</h2>
    <p><strong>Nom:</strong> ${escapeHtml(data.name || "")}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email || "")}</p>
    <p><strong>Marque:</strong> ${escapeHtml(data.brand || "")}</p>
    <p><strong>Budget:</strong> ${escapeHtml(data.budget || "")}</p>
    <p><strong>Message:</strong><br>${escapeHtml(data.message || "").replace(/\n/g, "<br>")}</p>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
