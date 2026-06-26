const SHEET_NAME = "Selections";
const NOTIFY_EMAIL = "";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    const rows = payload.selections.map(item => [
      new Date(),
      payload.clientName || "",
      payload.clientEmail || "",
      payload.globalNote || "",
      item.name,
      item.category,
      item.city,
      item.format,
      item.budget,
      item.score,
      item.priority || "",
      item.note || "",
      item.angle || "",
      item.audience || "",
      payload.page || ""
    ]);

    if (rows.length) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    }

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Nouvelle selection Salma Ben Hassine UGC",
        htmlBody: buildEmail(payload)
      });
    }

    return jsonResponse({ ok: true, count: rows.length });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "Salma Ben Hassine UGC selector capture" });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Date",
      "Client Name",
      "Client Email",
      "Global Note",
      "Prospect",
      "Category",
      "City",
      "Format",
      "Budget",
      "Score",
      "Priority",
      "Selection Note",
      "UGC Angle",
      "Audience",
      "Page"
    ]);
    sheet.getRange(1, 1, 1, 15).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function buildEmail(payload) {
  const items = payload.selections.map(item => `
    <li>
      <strong>${escapeHtml(item.name)}</strong>
      <br>Priority: ${escapeHtml(item.priority || "")}
      <br>Note: ${escapeHtml(item.note || "")}
    </li>
  `).join("");

  return `
    <h2>Nouvelle selection client</h2>
    <p><strong>Client:</strong> ${escapeHtml(payload.clientName || "")}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.clientEmail || "")}</p>
    <p><strong>Note generale:</strong> ${escapeHtml(payload.globalNote || "")}</p>
    <ol>${items}</ol>
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
