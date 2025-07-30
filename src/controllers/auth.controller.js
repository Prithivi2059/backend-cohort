const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const registerController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(422)
      .json({ message: "Username and password are required" });
  }

  try {
    const existingUser = await userModel.findOne({
      username,
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(500).json({ message: "Error creating user" });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    if (!token) {
      return res.status(500).json({ message: "Error generating token" });
    }

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      newUser,
      token,
    });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(422)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    const isPasswordValid = comparePassword;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    if (!token) {
      return res.status(500).json({ message: "Error generating token" });
    }

    res.cookie("token", token);

    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userController = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = {
  registerController,
  loginController,
  userController,
  logoutController,
};
