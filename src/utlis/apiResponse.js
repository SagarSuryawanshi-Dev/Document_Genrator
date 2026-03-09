const sendResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
  });
};
export default  sendResponse;



// class ApiResponse {
//     constructor(statusCode,data,message,success,error){
//       this.statusCode = statusCode;
//       this.data = data,
//       this.message = message,
//       this.success = statusCode < 400
//     }
// }


