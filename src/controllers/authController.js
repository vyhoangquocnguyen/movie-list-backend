import { getPrisma } from "../config/db.js";
import bcrypt from "bcryptjs";

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
export { register };
