import type { Transaction } from "@/types/trading";

export const exportToCSV = async (
  transactions: Transaction[],
  filename: string
) => {
  const csvLines = [];
  csvLines.push(
    "Date;Symbol;Company Name;Type;Quantity;Price per Share;Total Amount;P&L"
  );

  transactions.forEach((transaction) => {
    const date = new Date(transaction.executedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const pricePerShare = transaction.pricePerShare.toFixed(2);
    const totalAmount = transaction.totalAmount.toFixed(2);

    const profitLoss = transaction.profitLoss;
    const profitLossValue =
      profitLoss !== null
        ? `${profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)}`
        : "—";

    const line = [
      `"${date}"`,
      `"${transaction.symbol}"`,
      `"${transaction.symbolName}"`,
      `"${transaction.type}"`,
      transaction.quantity,
      pricePerShare,
      totalAmount,
      `"${profitLossValue}"`,
    ].join(";");
    csvLines.push(line);
  });

  const BOM = "\uFEFF";
  const csvContent = BOM + csvLines.join("\r\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("download", `${filename}.csv`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
};
