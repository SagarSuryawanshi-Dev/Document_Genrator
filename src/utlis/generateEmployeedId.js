// import Document from "../modeuls/documents/documentModel/BaseDocument.js";
// import companyPrefix from "./organizationPrefix.js"

// export const generateEmployeeId = async (company) => {

//   const prefix = companyPrefix[company];

//   if (!prefix) {
//     throw new Error("Company prefix not defined");
//   }

//   const lastEmployee = await Document.findOne({ company })
//     .sort({ employeeId: -1 });

//   let nextNumber = 101;

//   if (lastEmployee) {
//     const lastNumber = parseInt(
//       lastEmployee.employeeId.replace(prefix, "")
//     );

//     nextNumber = lastNumber + 1;
//   }

//   return `${prefix}${nextNumber}`;
// };

import Document from "../modeuls/documents/documentModel/BaseDocument.js";
import companyPrefix from "./organizationPrefix.js";

export const generateEmployeeId = async (company) => {
  const prefix = companyPrefix[company];

  if (!prefix) {
    throw new Error("Company prefix not defined");
  }

  // count existing employees in this company
  const count = await Document.countDocuments({ company });

  const nextNumber = 101 + count;

  return `${prefix}${nextNumber}`;
};
