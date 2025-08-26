const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },

    role: {
      type: String,
      enum: [
        "manager",
        "afitsant",
        "xoctest",
        "kassir",
        "buxgalter",
        "barmen",
        "povir",
        "paner",
        "admin",
      ],
      default: "afitsant",
    },

    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },

    user_code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    card_code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    permissions: {
      type: [String],
      enum: ["chek", "atkaz", "hisob"],
      default: [],
    },

    // 🔥 Afitsantlarga tegishli oylikdan foiz
    percent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔐 Parolni saqlashdan oldin hash qilish
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Parolni solishtirish
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
