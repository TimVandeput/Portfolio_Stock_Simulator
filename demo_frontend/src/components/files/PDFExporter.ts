import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction } from "@/types/trading";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const exportToPDF = async (
  transactions: Transaction[],
  filename: string
) => {
  const doc = new jsPDF();

  try {
    const logoImage = new Image();
    logoImage.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      logoImage.onload = resolve;
      logoImage.onerror = reject;
      logoImage.src = "/logoSS.png";
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const aspectRatio = logoImage.width / logoImage.height;
    const logoWidth = 40;
    const logoHeight = logoWidth / aspectRatio;

    const scale = 2;
    canvas.width = logoImage.width * scale;
    canvas.height = logoImage.height * scale;
    canvas.style.width = logoImage.width + "px";
    canvas.style.height = logoImage.height + "px";

    ctx?.scale(scale, scale);
    ctx?.drawImage(logoImage, 0, 0, logoImage.width, logoImage.height);

    const logoDataUrl = canvas.toDataURL("image/png", 1.0);
    doc.addImage(logoDataUrl, "PNG", 20, 10, logoWidth, logoHeight);
  } catch (error) {
    doc.setFontSize(20);
    doc.setTextColor(96, 165, 250);
    doc.text("StockSim", 20, 25);
  }

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Transaction History Report", 60, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  doc.text(`Total Transactions: ${transactions.length}`, 20, 42);

  const tableData = transactions.map((transaction) => [
    formatDate(transaction.executedAt),
    transaction.symbol,
    transaction.symbolName,
    transaction.type,
    transaction.quantity.toString(),
    formatCurrency(transaction.pricePerShare),
    formatCurrency(transaction.totalAmount),
  ]);

  autoTable(doc, {
    head: [
      ["Date", "Symbol", "Company", "Type", "Qty", "Price/Share", "Total"],
    ],
    body: tableData,
    startY: 50,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [96, 165, 250],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 20 },
      2: { cellWidth: 40 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
    },
    margin: { left: 20, right: 20 },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      const currentPage = data.pageNumber;

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );

      doc.text(
        "StockSim - Portfolio Management Platform",
        20,
        doc.internal.pageSize.height - 10
      );
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 50;
  if (finalY < doc.internal.pageSize.height - 60) {
    const buyTransactions = transactions.filter((t) => t.type === "BUY");
    const sellTransactions = transactions.filter((t) => t.type === "SELL");
    const totalBuyAmount = buyTransactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0
    );
    const totalSellAmount = sellTransactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0
    );

    const profitLoss = totalSellAmount - totalBuyAmount;
    const profitLossPercent =
      totalBuyAmount > 0 ? (profitLoss / totalBuyAmount) * 100 : 0;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 20, finalY + 20);

    doc.setFontSize(10);
    doc.text(
      `Buy Orders: ${buyTransactions.length} (${formatCurrency(
        totalBuyAmount
      )})`,
      20,
      finalY + 30
    );
    doc.text(
      `Sell Orders: ${sellTransactions.length} (${formatCurrency(
        totalSellAmount
      )})`,
      20,
      finalY + 37
    );
    doc.text(
      `Net Investment: ${formatCurrency(totalBuyAmount - totalSellAmount)}`,
      20,
      finalY + 44
    );

    const profitLossColor = profitLoss >= 0 ? [34, 197, 94] : [239, 68, 68]; // Green or Red
    doc.setTextColor(
      profitLossColor[0],
      profitLossColor[1],
      profitLossColor[2]
    );
    doc.text(
      `Profit/Loss: ${profitLoss >= 0 ? "+" : ""}${formatCurrency(
        profitLoss
      )} (${profitLossPercent >= 0 ? "+" : ""}${profitLossPercent.toFixed(
        2
      )}%)`,
      20,
      finalY + 51
    );
  }

  doc.save(`${filename}.pdf`);
};
