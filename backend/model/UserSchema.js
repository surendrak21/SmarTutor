const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true, minlength: 6 },
    cpassword: { type: String, required: true, minlength: 6 }, 
    tokens: [{ token: { type: String, required: true } }],
    // NEW: user’s pre-registration selection (courseId list)
    selectedCourses: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Hash only when password modified
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.cpassword = await bcrypt.hash(this.cpassword, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.cpassword;
  delete obj.tokens;
  return obj;
};

module.exports = mongoose.model("USER", userSchema);
