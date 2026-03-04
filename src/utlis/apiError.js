class AppError extends Error {

    constructor(message, statuscode) {
        super(message);
        this.statuscode = statuscode
        Error.captureStackTrace(this, this.constructor);
    }
}


export default AppError;


// class AppError extends Error {
//     constructor(
//         statuscode,
//         message = "Something Went Wrong",
//         error = null,
//         stack = ""
//     ){
//         super(message)
//         this.statuscode = statuscode;
//         this.data = null;
//         this.message = message;
//         this.success = false;
//         this.error = error;

//         if (stack){
//             this.stack = stack;
//         }else {
//             Error.captureStackTrace(this,this.constructor);
//         }
//     }
// }