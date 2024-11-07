const db = require("../Config/database");
const { asyncChoke } = require("../Utils/asyncWrapper");
const AppError = require("../Utils/error");
const { addDays, format, isAfter, setHours, setMinutes, setSeconds, parseISO } = require('date-fns');


exports.teamFetch = asyncChoke(async(req, res, next)=>{
    const user_id = req.user.id;
    const teamFoundQuery = "SELECT * FROM playerDetails where user_id = ?"
    const teamFoundValue = [user_id];
    const [teamFound] = await db.query(teamFoundQuery,teamFoundValue);
    if(teamFound.length === 0){
        return next(new AppError(404, "Team not found!"));
    }
    const team_id = teamFound[0].team_id;
    

    console.log(teamFound)

    const teamQuery = "SELECT * FROM teams WHERE id = ?"
    const teamValues = [team_id]
    const [team] = await db.query(teamQuery, teamValues);
    if(team.length === 0){
        return next(new AppError(404, "Team not found!"));
    }
    const teamName = team[0].name
    const team_points = team[0].team_points;
    const teamPlayersQuery = "SELECT * FROM playerDetails WHERE team_id = ?"
    const teamPlayersValue = [team_id]
    const [teamPlayers] = await db.query(teamPlayersQuery, teamPlayersValue);
    
    const userIds = teamPlayers.map(player => player.user_id);
    

    // Query to get the names of all team members from the users table
    const usersQuery = "SELECT id, name FROM users WHERE id IN (?)";
    const [users] = await db.query(usersQuery, [userIds]);
    
    const result = teamPlayers.map(player => {
        const user = users.find(u => u.id === player.user_id);
        return {
            name: user ? user.name : null,
            leadership: player.leadership,
            points:player.points
        };
    });
    res.status(200).json({
        status:"succuss",
        team_id:team_id,
        teamName:teamName,
        teamPoints: team_points,
        players:result
    });

});




// const scheduleMatch = async (team_id) => {
    
//     const now = new Date();
//     const timeNow = format(now, 'HH:mm:ss');
//     const dateNow = format(now, 'yyyy-MM-dd');
  
//     // Define slot times and max slots per time slot
//     const slots = [
//       { start: 12, end: 13 },
//       { start: 13, end: 14 },
//       { start: 14, end: 15 },
//       { start: 15, end: 16 },
//       { start: 16, end: 17 },
//       { start: 17, end: 18 }
//     ];
//     const maxSlots = 12;
  
//     // Helper function to check slot availability
//     async function isSlotAvailable(date, startHour, endHour) {
//       const count = await querySlotCount(date, startHour, endHour);
//       return count < maxSlots;
//     }
  
//     // Check if the current time is between 6:00 PM and 12:00 AM
//     if (now.getHours() >= 18 || now.getHours() < 6) {
//       // Increment the date
//       const nextDay = addDays(now, 1);
//       const nextDate = format(nextDay, 'yyyy-MM-dd');
//       // Start checking slots from 12:00 PM
//       for (let slot of slots) {
//         console.log("1")
//         if (await isSlotAvailable(nextDate, slot.start, slot.end)) {
//           await insertMatch(team_id, nextDate, slot.start);
//           return `Match scheduled at ${slot.start}:00 on ${nextDate}`;
//         }
//       }
//     }
  
//     // If the current time is between 12:00 PM and 6:00 PM
//     if (now.getHours() >= 12 && now.getHours() < 18) {
//       let slotIndex = 0;
//       if (now.getMinutes() >= 40) {
//         slotIndex = now.getHours() - 12 + 1;
//       } else {
//         slotIndex = now.getHours() - 12;
//       }
  
//       // Start checking from the determined slot
//       for (let i = slotIndex; i < slots.length; i++) {
//         const slot = slots[i];
//         if (await isSlotAvailable(dateNow, slot.start, slot.end)) {
//           await insertMatch(team_id, dateNow, slot.start);
//           return `Match scheduled at ${slot.start}:00 on ${dateNow}`;
//         }
//       }
//     }
  
//     // If all slots are occupied on the current day, increment the date and repeat
//     while (true) {
//       const nextDay = addDays(now, 1);
//       const nextDate = format(nextDay, 'yyyy-MM-dd');
//       for (let slot of slots) {
//         if (await isSlotAvailable(nextDate, slot.start, slot.end)) {
//           await insertMatch(team_id, nextDate, slot.start);
//           return `Match scheduled at ${slot.start}:00 on ${nextDate}`;
//         }
//       }
//     }
//   }
  
//   // Replace with your actual query logic
//   async function querySlotCount(date, startHour, endHour) {
//     const query = `
//       SELECT COUNT(*) as count 
//       FROM freeTournamentMatches 
//       WHERE date = ? AND start_hour = ? AND end_hour = ?`;
//     const result = await db.query(query, [date, startHour, endHour]);

//     console.log(date ,startHour, endHour)
//     return result[0].count;
//   }
  
//   // Replace with your actual insertion logic
//   async function insertMatch(team_id, date, startHour) {
//     const query = `
//       INSERT INTO freeTournamentMatches (team_id, date, start_hour) 
//       VALUES (?, ?, ?)`;
//     await db.query(query, [team_id, date, startHour]);
//     console.log(`Inserted match for team ${team_id} at ${startHour}:00 on ${date}`);
  
    


    
//     // let dayOffset = 0;
//     // let scheduled = false;

//     // while (!scheduled) {
//     //     const dateToCheck = new Date();
//     //     dateToCheck.setDate(dateToCheck.getDate() + dayOffset);

//     //     // Define the hourly slots from 12:00 PM to 6:00 PM
//     //     const timeSlots = [
//     //         '12:00:00', '13:00:00', '14:00:00',
//     //         '15:00:00', '16:00:00', '17:00:00'
//     //     ];

//     //     const now = new Date();
//     //     const currentHour = now.getHours();
//     //     const currentMinute = now.getMinutes();

//     //     // Determine the starting slot based on the current time
//     //     let startSlotIndex = 0;
//     //     if (currentHour >= 12) {
//     //         startSlotIndex = timeSlots.findIndex(slot => {
//     //             const [hour] = slot.split(':');
//     //             return hour >= currentHour && (hour > currentHour || currentMinute > 0);
//     //         });
//     //     }

//     //     // Iterate through the time slots starting from the calculated index
//     //     for (let i = startSlotIndex; i < timeSlots.length; i++) {
//     //         const startTime = timeSlots[i];
//     //         // Ensure endTime is correctly calculated as one hour after startTime
//     //         const endTime = new Date(dateToCheck);
//     //         endTime.setHours(endTime.getHours() + 1);
//     //         console.log(endTime)
//     //         // Query to check if the slot is available
//     //         const slotQuery = `
//     //             SELECT COUNT(*) AS count 
//     //             FROM freeTournamentMatches 
//     //             WHERE date = ? AND time = ?
//     //         `;
//     //         const [slotResult] = await db.query(slotQuery, [dateToCheck.toISOString().split('T')[0], startTime]);

//     //         if (slotResult.count < 12) {
//     //             // Slot available, schedule the match
//     //             const insertMatchQuery = `
//     //                 INSERT INTO freeTournamentMatches (team_id, date, time)
//     //                 VALUES (?, ?, ?)
//     //             `;
//     //             await db.query(insertMatchQuery, [team_id, dateToCheck.toISOString().split('T')[0], startTime]);
//     //             scheduled = true;
//     //             break; // Exit the loop once a slot is found
//     //         }
//     //     }

//     //     if (!scheduled) {
//     //         // Increment the dayOffset to check the next day if no slots were available
//     //         dayOffset++;
//     //     }
//     // }

//     // if (!scheduled) {
//     //     return next(new AppError(400, "Unable to schedule match! All slots are fully booked."));
//     // }
// };
 

const moment = require('moment');

const MAX_SLOTS_PER_HOUR = 12;
const START_HOUR = 12;
const END_HOUR = 17;
const MINUTE_THRESHOLD = 40;

async function scheduleMatch(teamId, date, time) {
  
}

  exports.teamCreation = asyncChoke(async (req, res, next) => {
    const { paymentID, team_name } = req.body;
    const user_id = req.user.id;
    const realPaymentID = process.env.PAYMENT_ID;
     
    
    const teamCheckQuery = 'SELECT * FROM playerDetails WHERE user_id = ?';
    const teamCheckValue = [user_id];
    const [teamCheck] = await db.query(teamCheckQuery, teamCheckValue);
    if (teamCheck.length > 0) {
      return next(new AppError(409, "Already in a Team!"));
    }
    if (paymentID !== realPaymentID) {
      return next(new AppError(401, "Invalid Payment"));
    }
    if (!team_name) {
      return next(new AppError(401, "Team Name Required!"));
    }
 

    const teamNameQuery = 'SELECT * FROM teams WHERE name = ?';
    const teamNameValue = [team_name];
    const [teamName] = await db.query(teamNameQuery, teamNameValue);
    if (teamName.length > 0) {
      return next(new AppError(409, `Team with name ${team_name} already exists!`));
    }
    
    const teamCreateQuery = 'INSERT INTO teams (name) VALUES(?)';
    const teamCreateValue = [team_name];
    const [teamCreate] = await db.query(teamCreateQuery, teamCreateValue);
    if (teamCreate.affectedRows === 0) {
      return next(new AppError(400, "unable to create team!"));
    }
    const team_id = teamCreate.insertId;
  
    const teamPlayersQuery = 'INSERT INTO PlayerDetails (team_id , user_id, leadership) VALUES(?,?,?)'
    const teamPlayersValue = [team_id, user_id, 1];
    const [teamPlayers] = await db.query(teamPlayersQuery, teamPlayersValue);
    if (teamPlayers.affectedRows === 0) {
      return next(new AppError(400, "unable to create team!"));
    }
  // Schedule a match
  const date = new Date();
  const time = date.toLocaleTimeString();
  const matchSchedule = await scheduleMatch(team_id, date.toLocaleDateString(), time);
  if (matchSchedule) {
    console.log(`Match scheduled for ${matchSchedule.matchTime} on ${matchSchedule.matchDate}`);
  }
    return res.status(200).json({
      "status": "Succuss",
      "message": "Team Created Succuss!"
    });
  })