# MyCashFlow 💧

A minimalist, zero-dependency personal finance tracker built entirely on Google Sheets and Google Apps Script.

Adhering to the **suckless** philosophy, this project requires no databases to configure, no npm packages to install, and no complex frameworks. It uses vanilla HTML/CSS/JS for a lightning-fast, mobile-first Web App experience, using Google Sheets as the backend database.

## ✨ Features
- **Zero Infrastructure:** Your data lives privately in your Google Drive.
- **Mobile-First UI:** A sleek, app-like interface tailored for mobile web browsers.
- **Smart Transactions:** Track income/expenses with an integrated auto-savings deduction feature.
- **Debt Management:** Keep track of who owes you and who you owe (Lend/Borrow/Collect/Repay).
- **Suckless Codebase:** Extremely lightweight. No React, no Vue, no Tailwind. Just pure CSS and Vanilla JS.

---

## 📁 Repository Structure

```text
.
├── Code.gs      # Backend logic (Google Apps Script)
├── Index.html   # Frontend Web App (HTML + CSS + Vanilla JS)
└── README.md    # Documentation & Deployment guide
```

---

## 🚀 Deployment Guide

Follow these steps to deploy your own instance of MyCashFlow.

### Step 1: Prepare the Database (Google Sheets)
1. Create a new [Google Sheet](https://sheets.new/).
2. Create exactly **3 sheets** (tabs at the bottom) and name them: `Transactions`, `Debts`, and `Dashboard`.
3. Fill in the headers and formulas exactly as follows:

#### Sheet 1: `Transactions`
| Cell | Content / Formula |
| :--- | :--- |
| **A1** | `Date` |
| **B1** | `Type` |
| **C1** | `Amount` |
| **D1** | `Category` |
| **E1** | `Savings` |
| **F1** | `Note` |
| **G1** | `=IFERROR({"Month"; ARRAYFORMULA(IF(A2:A=""; ""; TEXT(A2:A; "yyyy-mm")))})` |

#### Sheet 2: `Debts`
| Cell | Content / Formula |
| :--- | :--- |
| **A1** | `Date` |
| **B1** | `Action` |
| **C1** | `Amount` |
| **D1** | `Person` |
| **E1** | `Note` |
| **F1** | `=IFERROR({"Month"; ARRAYFORMULA(IF(A2:A=""; ""; TEXT(A2:A; "yyyy-mm")))})` |

#### Sheet 3: `Dashboard`
| Cell | Content / Formula |
| :--- | :--- |
| **A1** | `Current Month` |
| **B1** | `=TEXT(TODAY(); "MM/yyyy")` |
| **A2** | `Monthly Income` |
| **B2** | `=SUMIFS(Transactions!C:C; Transactions!B:B; "Income"; Transactions!G:G; B1)` |
| **A3** | `Monthly Expense` |
| **B3** | `=SUMIFS(Transactions!C:C; Transactions!B:B; "Expense"; Transactions!G:G; B1)` |
| **A4** | `Monthly Balance` |
| **B4** | `=B2 - B3 - SUMIFS(Transactions!E:E; Transactions!G:G; B1) - SUMIFS(Debts!C:C; Debts!B:B; "Lend"; Debts!F:F; B1) + SUMIFS(Debts!C:C; Debts!B:B; "Collect"; Debts!F:F; B1) + SUMIFS(Debts!C:C; Debts!B:B; "Borrow"; Debts!F:F; B1) - SUMIFS(Debts!C:C; Debts!B:B; "Repay"; Debts!F:F; B1)` |
| **A5** | `Total Balance` |
| **B5** | `=SUMIFS(Transactions!C:C; Transactions!B:B; "Income") - SUMIFS(Transactions!C:C; Transactions!B:B; "Expense") - B6 - SUMIFS(Debts!C:C; Debts!B:B; "Lend") + SUMIFS(Debts!C:C; Debts!B:B; "Collect") + SUMIFS(Debts!C:C; Debts!B:B; "Borrow") - SUMIFS(Debts!C:C; Debts!B:B; "Repay")` |
| **A6** | `Total Savings` |
| **B6** | `=SUM(Transactions!E:E)` |

> ⚠️ **Note on Locale:** The formulas above use semicolons (`;`) which is standard for locales like Vietnam/Europe. If your Google account is set to US locale, you may need to replace semicolons (`;`) with commas (`,`) in the formulas.

---

### Step 2: Setup Apps Script
1. On your Google Sheet, click on **Extensions** > **Apps Script** in the top menu.
2. Delete any default code in the script editor.
3. Create a file named `Code.gs` and paste the contents of the `Code.gs` file from this repository.
4. Click the `+` icon next to "Files", select **HTML**, name it `Index.html`, and paste the contents of the `Index.html` file from this repository.
5. Click the **Save** icon (💾).

### Step 3: Deploy the Web App
1. In the top right corner of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the details:
   - **Description:** `MyCashFlow v1.0` (or anything you like).
   - **Execute as:** `Me` (This ensures the app writes to *your* Google Sheet).
   - **Who has access:** `Only myself` (For personal security) OR `Anyone` (If you want to access it without logging in, assuming you keep the URL secret).
4. Click **Deploy**.
5. *Google will ask for permissions. Click "Review permissions", select your account, click "Advanced", and click "Go to project (unsafe)" to allow the script to read/write your spreadsheet.*
6. **Done!** You will get a Web App URL. Bookmark this URL on your phone's browser and add it to your home screen.

---

## 💡 Philosophy
Software today is bloated. **MyCashFlow** stands against that.
- No loading spinners for huge JS bundles.
- No third-party tracking.
- No monthly subscriptions.
- Just you, your code, and your money.

Keep it simple, stupid.
