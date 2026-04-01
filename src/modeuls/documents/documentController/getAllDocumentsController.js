import Document from "../documentModel/BaseDocument.js";
import mongoose from "mongoose";
import AppError from "../../../utlis/apiError.js";

export const getAllDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, docType } = req.query;

    const query = {};

    if (docType) {
      query.docType = docType;
    }

    const documents = await Document.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Document.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeesList = async (req, res, next) => {
  try {
    const employees = await Document.aggregate([
      {
        $group: {
          _id: "$employeeEmail",
          employeeName: { $first: "$employeeName" },
          employeeId: { $first: "$employeeId" },
        },
      },
      {
        $project: {
          _id: 0,
          employeeEmail: "$_id",
          employeeName: 1,
          employeeId: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentsByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId || employeeId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Employee ID is missing or invalid",
      });
    }

    const documents = await Document.find({
      employeeId: employeeId.trim(),
    });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};
