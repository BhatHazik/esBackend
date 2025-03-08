const Razorpay = require('razorpay');
// const { catchAsync } = require("./catchAsync");
// const AppError = require("./error");
const crypto = require('crypto')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.initaitePayment = async ( amount, notes) => {
console.log(amount, notes);
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: notes,
  };
  
  const order = await razorpay.orders.create(options);
  
  return order;
  
};

exports.verifyPaymentOrder = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    console.log("Payment Route got hitted!:", razorpay_order_id, razorpay_payment_id, razorpay_signature)
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) return false;
  const trx = await razorpay.payments.fetch(razorpay_payment_id);
  console.log(trx,"this is transaction");
  return trx;
  
};