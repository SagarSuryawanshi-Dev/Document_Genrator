import OfferLetter from "../modeuls/documents/documentModel/OfferLetter.js";

export const getOrCreateEmployeeNumber = async (employeeId) => {
  const existing = await OfferLetter.findOne({ employeeId });
  if (existing) return existing.employeeNumber;

  // Ensure unique 6-digit number
  let number;
  let exists = true;
  while (exists) {
    number = Math.floor(100000 + Math.random() * 900000);
    exists = await OfferLetter.findOne({ employeeNumber: number });
  }
  return number;
};