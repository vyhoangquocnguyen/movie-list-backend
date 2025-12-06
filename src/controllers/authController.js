import { getPrisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const userExist = await getPrisma().user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await getPrisma().user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Return success response
    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: name,
          email: email,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const userExist = await getPrisma().user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExist) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    //Verify password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    //Generate JWT token
    const token = generateToken(userExist.id, res);

    // Return success response
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: userExist.id,
          email: email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", {
    expire: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

export { register, login, logout };
