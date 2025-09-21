import type { Transaction } from "@/types/trading";

export const exportToExcel = async (
  transactions: Transaction[],
  filename: string
) => {
  const excelXML = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Transaction History</Title>
  <Author>StockSim</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#6366F1" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataStyle">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10"/>
  </Style>
  <Style ss:ID="CurrencyStyle">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10"/>
   <NumberFormat ss:Format="$#,##0.00"/>
  </Style>
  <Style ss:ID="NumberStyle">
   <Alignment ss:Vertical="Center" ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Transactions">
  <Table>
   <Column ss:Width="100"/>
   <Column ss:Width="80"/>
   <Column ss:Width="200"/>
   <Column ss:Width="60"/>
   <Column ss:Width="80"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Row ss:Height="25">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Date</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Symbol</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Company Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Type</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Quantity</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Price per Share</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Total Amount</Data></Cell>
   </Row>
   ${transactions
     .map((transaction) => {
       const date = new Date(transaction.executedAt).toLocaleDateString(
         "en-US",
         {
           year: "numeric",
           month: "2-digit",
           day: "2-digit",
         }
       );
       return `
   <Row>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${date}</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${
      transaction.symbol
    }</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${transaction.symbolName
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${
      transaction.type
    }</Data></Cell>
    <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${
      transaction.quantity
    }</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${
      transaction.pricePerShare
    }</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${
      transaction.totalAmount
    }</Data></Cell>
   </Row>`;
     })
     .join("")}
  </Table>
  <AutoFilter x:Range="R1C1:R${
    transactions.length + 1
  }C7" xmlns="urn:schemas-microsoft-com:office:excel">
  </AutoFilter>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
    <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
   </PageSetup>
   <FitToPage/>
   <Print>
    <FitWidth>1</FitWidth>
    <FitHeight>32767</FitHeight>
   </Print>
   <Selected/>
   <FreezePanes/>
   <FrozenNoSplit/>
   <SplitHorizontal>1</SplitHorizontal>
   <TopRowBottomPane>1</TopRowBottomPane>
   <ActivePane>2</ActivePane>
   <Panes>
    <Pane>
     <Number>3</Number>
    </Pane>
    <Pane>
     <Number>2</Number>
     <ActiveRow>0</ActiveRow>
    </Pane>
   </Panes>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([excelXML], {
    type: "application/vnd.ms-excel",
  });

  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("download", `${filename}.xls`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
};
