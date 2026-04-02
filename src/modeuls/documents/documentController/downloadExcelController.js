import ExcelJS from "exceljs";
import Document from "../documentModel/BaseDocument.js"; 



 const exportUsersToExcel = async (req, res, next) => {
  try {
    // 1️⃣ Fetch data from DB
    const documents = await Document.find().populate("issuedBy", "name").sort({ createdAt: -1 }).lean();

    if (!documents.length) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    // 2️⃣ Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // 3️⃣ Define columns
    worksheet.columns = [
      { header: "documentType", key: "documentType", width: 25 },
      { header: "issuedTo", key:"issuedTo",width: 20},
      { header: "employeeEmail", key: "employeeEmail", width: 30 },
      { header: "employeeNumber", key: "employeeNumber", width: 20 },
      { header: "createdAt", key: "createdAt", width: 25 },
      {header: "issuedBy", key: "issuedBy", width: 25},
      { header: "paymentStatus", key: "paymentStatus",width: 20 }
    ];

    // 4️⃣ Add rows
    documents.forEach((document) => {
      worksheet.addRow({
        documentType:document.documentType,
        issuedTo:document.issuedTo,
        employeeEmail: document.employeeEmail,
        employeeNumber: document.employeeNumber,
        createdAt: document.createdAt,
        issuedBy:document.issuedBy?.name || "N/A",
        paymentStatus: document.paymentStatus
      });
    });

    // 5️⃣ Set response headers (IMPORTANT)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users.xlsx"
    );

    // 6️⃣ Send file
    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
};

export default exportUsersToExcel;;