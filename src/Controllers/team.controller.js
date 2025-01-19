// const { catchAsync } = require("../Utils/catchAsync");
// const { verifyPaymentOrder, initaitePayment } = require("../Utils/razorpay");
// const db = require("../Models/connection");
// const AppError = require("../Utils/error");



// exports.initiateTeamCreate = catchAsync(async(req, res, next)=>{
//     const { teamName } = req.body;
//     const user_id = req.user.id;
//     if(!teamName){
//         return next(new AppError(401,"Team name is required"));
//     }
//     const [TeamCheck] = await db.query("SELECT * FROM teams WHERE name = ?", [teamName]);
//     if(TeamCheck.length > 0){
//         return next(new AppError(401, "Team name already exists"));
//     }
//     const [userTeamCheck] = await db.query("SELECT * FROM users WHERE team_id IS NOT NULL AND id = ?", [user_id]);
//     if(userTeamCheck.length > 0){
//         return next(new AppError(401, "You are already in a team"));
//     }

//     const amount = process.env.TEAM_CREATION_AMOUNT;
//     const notes = {purpose:"Team Creation", user_id: user_id, teamName: teamName}

//     const order = await initaitePayment(amount, notes)
//     console.log(order);

//     return res.status(200).json({ message: "Order initiated successfully",order});
// })



// exports.PurchaseVerify = catchAsync(async(req, res, next) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     console.log(razorpay_order_id, razorpay_payment_id)
//     try{
//         const transaction = await verifyPaymentOrder(razorpay_order_id, razorpay_payment_id, razorpay_signature);
//     console.log(transaction);
//     if(transaction.captured === true){
//         const user_id = transaction.notes.user_id;
//         const teamName = transaction.notes.teamName;
//         const userCheck = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
//         if(userCheck.length === 0){
//             return next(new AppError(401, "User not found"));
//         }
//         const [createTeam] = await db.query(`INSERT INTO teams (name) VALUES (?)`, [teamName]);
//         const team_id = createTeam.insertId;
//         await db.query("INSERT INTO team_progress (team_id) VALUES(?)",[team_id]);
//         await db.query(`UPDATE users SET leadership = ?, team_id = ? WHERE id = ?`, [true, team_id, user_id]);
//       return res.redirect("http://localhost:5173/paymentSuccess");
//     }
//     else{
//       return res.redirect("http://localhost:5173/paymentFailed");
//     }
//     }catch(err){
//         console.error(err);
//         res.redirect("http://localhost:5173/paymentFailed");
//         return next(new AppError(500, err));
//     }
//   });
  


//   exports.findTeamById = catchAsync(async(req, res, next)=>{
//     const team_id = req.params.team_id;
//     const [team] = await db.query("SELECT * FROM teams WHERE id =?", [team_id]);
//     if(team.length === 0){
//         return next(new AppError(401, "Team not found"));
//     }
//     return res.status(200).json({message: "Team found", team});
//   });



//   exports.addTeamMember = catchAsync(async(req, res, next)=>{
//     const {player_id} = req.body;
//     const {leadership, team_id, id} = req.user;
    
//     if(!player_id){
//       return next(new AppError(401,"Player ID is required"));
//     }
//     if(!leadership || leadership === false){
//       return next(new AppError(401, "Only Team leader can add team members"));
//     }
//     if(id === player_id){
//       return next(new AppError(401, "Cannot add yourself to your team"));
//     }
//     const [userCheck] = await db.query("SELECT * FROM users WHERE id = ?", [player_id]);
//     if(userCheck.length === 0){
//         return next(new AppError(401, "Player not found"));
//     }
//     if(userCheck[0].team_id === team_id){
//       return next(new AppError(401, "Player is already in your team"));
//     }
//     if(userCheck[0].team_id !== null){
//       return next(new AppError("Player is already in a team"));
//     }
//     await db.query(`UPDATE users SET team_id = ? WHERE id = ?`, [team_id, player_id]);

//     return res.status(200).json({message: "Player added to team successfully"});

//   });

  


//   exports.kickMember = catchAsync(async(req, res, next)=>{
//     const {player_id} = req.body;
//     const {leadership, team_id, id} = req.user;
    
//     if(!player_id){
//       return next(new AppError(401,"Player ID is required"));
//     }
//     if(!leadership || leadership === false){
//       return next(new AppError(401, "Only Team leader can kick team members"));
//     }
//     if(id === player_id){
//       return next(new AppError(401, "Cannot kick yourself from your team"));
//     }
//     const [userCheck] = await db.query("SELECT * FROM users WHERE id = ?", [player_id]);
//     if(userCheck.length === 0){
//         return next(new AppError(401, "Player not found"));
//     }
//     if(userCheck[0].team_id!== team_id){
//       return next(new AppError(401, "Player is not in your team"));
//     }
//     await db.query(`UPDATE player_progress SET score = 0 , `)
//     await db.query(`UPDATE users SET team_id = NULL WHERE id = ?`, [player_id]);
//   })



  