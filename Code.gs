/**
 * MyCashFlow - Backend Logic (Suckless Design)
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('MyCashFlow')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1'); // Chuẩn Mobile-first
}

// Lấy toàn bộ dữ liệu cho Dashboard
function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Lấy số liệu tổng quan từ sheet Dashboard
  const dashSheet = ss.getSheetByName('Dashboard');
  const dashValues = dashSheet.getRange('B1:B6').getValues().flat();

  // 2. Lấy dữ liệu công nợ thô
  const debtSheet = ss.getSheetByName('Debts');
  const debtData = debtSheet.getDataRange().getValues();
  debtData.shift(); // Bỏ dòng header

  // Ép kiểu Date object sang String để truyền qua google.script.run an toàn
  const safeDebtData = debtData.map(row => [
    row[0] ? String(row[0]) : '', // Chuyển cột Thời gian thành text
    row[1],
    row[2],
    row[3],
    row[4]
  ]);

  return {
    metrics: {
      currentMonth: dashValues[0],
      monthlyIncome: dashValues[1] || 0,
      monthlyExpense: dashValues[2] || 0,
      monthlyBalance: dashValues[3] || 0,
      totalBalance: dashValues[4] || 0,
      totalSavings: dashValues[5] || 0
    },
    debts: safeDebtData // Gửi mảng đã xử lý Date an toàn
  };
}

// Ghi nhận Thu/Chi
function submitTransaction(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Transactions');
  const date = new Date();

  // Append raw data
  sheet.appendRow([
    date,
    data.type,
    data.amount,
    data.category,
    data.savings || 0,
    data.note
  ]);
  return true;
}

// Ghi nhận Công nợ
function submitDebt(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Debts');
  const date = new Date();

  sheet.appendRow([
    date,
    data.action,
    data.amount,
    data.person,
    data.note
  ]);
  return true;
}
