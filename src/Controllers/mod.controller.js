// const { catchAsync } = require("../Utils/catchAsync");
// const db = require("../Config/database");
// const AppError = require("../../Utils/error");
// const { createSendToken, createSendTokenForMODs } = require("../../Utils/helper");





// exports.signUpMOD = catchAsync(async(req, res, next) => {
//     const {name, adhar, pan, DOB, phone, password, game, type} = req.body;

//     if(!name || !adhar || !pan || !DOB || !phone || !password || !game || !type) {
//         return next(new AppError(401, "All fields are required"));
//     }

//    try{
//     const [addMOD] = await db.query(`INSERT INTO moderators (name, adhar, pan, DOB, phone, password, game) VALUES(?,?,?,?,?,?,?)`, [name, adhar, pan, DOB, phone, password, game]);

//     if(addMOD.affectedRows === 0){
//         return next(new AppError(401, "Error in adding moderator"));
//     }
//     return res.status(200).json({
//         status: "Success",
//         message: "Moderator added successfully"
//     });
//    }
//     catch(err){
//          console.error(err);
//          return next(new AppError(500, err));
//     }
// });

 
// exports.loginMOD = catchAsync(async(req, res, next) => {
//     const {IdentityNumber, password} = req.body;
//     if(!IdentityNumber || !password){
//         return next(new AppError(401, "All fields are required"));
//     }
//     try{
//         const [getMOD] = await db.query(`SELECT * FROM moderators WHERE id = ? AND password = ?`, [IdentityNumber, password]);
//         if(getMOD.length === 0){
//             return next(new AppError(401, "Invalid credentials"));
//         }
//         const token = createSendTokenForMODs(IdentityNumber);
//         return res.status(200).json({
//             status: "Success",
//             message: "Login successful",
//             token: token,
//             data: getMOD[0]
//         });
//     }
//     catch(err){
//         console.error(err);
//         return next(new AppError(500, err));
//     }
// });

