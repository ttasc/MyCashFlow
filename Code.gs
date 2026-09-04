/**
 * MyCashFlow - Backend Logic (Suckless Design)
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('MyCashFlow')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const dashSheet = ss.getSheetByName('Dashboard');
  const dashValues = dashSheet.getRange('B1:B6').getValues().flat();

  const debtSheet = ss.getSheetByName('Debts');
  const debtData = debtSheet.getDataRange().getValues();
  debtData.shift();

  const safeDebtData = debtData.map(row => [
    row[0] ? String(row[0]) : '',
    row[1],
    row[2],
    row[3],
    row[4]
  ]);

  return {
    sheetUrl: ss.getUrl(),
    metrics: {
      currentMonth: dashValues[0],
      monthlyIncome: dashValues[1] || 0,
      monthlyExpense: dashValues[2] || 0,
      monthlyBalance: dashValues[3] || 0,
      totalBalance: dashValues[4] || 0,
      totalSavings: dashValues[5] || 0
    },
    debts: safeDebtData
  };
}

function getTransactions(monthStr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  data.shift();

  return data
    .filter(row => row[6] === monthStr)
    .map(row => [
      row[0] ? Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), "dd/MM/yyyy") : '',
      row[1],
      row[2],
      row[3],
      row[4],
      row[5]
    ])
    .reverse();
}

function submitTransaction(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Transactions');
  sheet.appendRow([new Date(), data.type, data.amount, data.category, data.savings || 0, data.note]);
  return true;
}

function submitDebt(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Debts');
  sheet.appendRow([new Date(), data.action, data.amount, data.person, data.note]);
  return true;
}
