import Document from "../modeuls/documents/documentModel/BaseDocument.js";
import { generateEmployeeId } from "./generateEmployeedId.js";

export const getOrCreateEmployeeId = async (email, company) => {
  const existingEmployee = await Document.findOne({ email, company });

  if (existingEmployee) {
    return existingEmployee.employeeId;
  }

  const newEmployeeId = await generateEmployeeId(company);

  return newEmployeeId;
};
