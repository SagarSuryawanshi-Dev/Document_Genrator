import  Document  from "../documentModel/BaseDocument.js";
 const getAllDocuments = async (req, res, next) => {
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


export default getAllDocuments;