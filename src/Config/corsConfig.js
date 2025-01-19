const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:8081",  
  "http://localhost:8082", 
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

module.exports = corsOptions;
