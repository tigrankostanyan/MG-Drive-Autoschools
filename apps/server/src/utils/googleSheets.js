const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const credentialsPath = path.join(__dirname, "../../credentials.json");

let auth;
if (fs.existsSync(credentialsPath)) {
  auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
} else if (process.env.SPREADSHEET_ID) {
  // Only warn when a spreadsheet is actually configured; otherwise the
  // integration is intentionally unused and the console stays clean.
  console.warn(
    "Google Sheets credentials.json not found! Sheet integration will be disabled.",
  );
}

const appendRegistrationToSheet = async (data) => {
  if (!auth) {
    console.error("Google Sheets is not authenticated.");
    return;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    const dateStr = new Date().toLocaleString("hy-AM", { timeZone: "Asia/Yerevan" });

    const row = [
      data.phone || "",
      data.name || "",
      data.lastname || "",
      data.age || "",
      data.email || "",
      data.packageType || "",
      dateStr,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1", // Ensure your sheet is named Sheet1 or update this to your sheet name
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [row],
      },
    });
    console.log("Appended to Google Sheets successfully");
  } catch (err) {
    console.error("Error appending to Google Sheets:", err);
  }
};

module.exports = {
  appendRegistrationToSheet,
};
