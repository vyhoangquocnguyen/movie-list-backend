import { getPrisma } from "../config/db.js";

const getAllMovies = async (req, res) => {
  const prisma = getPrisma();
  try {
    const movies = await prisma.movie.findMany();
    res.status(200).json({
      status: "Success",
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Failed to fetch movies",
      error: error.message,
    });
  }
};

const addNewMovie = async (req, res) => {
  const prisma = getPrisma();
  try {
    const movie = await prisma.movie.create({
      data: {
        ...req.body,
        createdBy: req.user.id,
      },
    });
    res.status(201).json({
      status: "Success",
      message: "Movie added successfully",
      data: movie,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "Error",
        message: "Movie already exists",
      });
    }
    if (error.code === "P2003") {
      return res.status(400).json({
        status: "Error",
        message: "User not found",
      });
    }
    res.status(500).json({
      status: "Error",
      message: "Failed to add movie",
      ...(process.env.NODE_ENV === "development" && { debug: error.message }),
    });
  }
};

const updateMovie = async (req, res) => {
  const prisma = getPrisma();
  try {
    const movie = await prisma.movie.update({
      where: {
        id: req.params.id,
        createdBy: req.user.id, // Ensures user can only update their own movies
      },
      data: req.body,
    });
    res.status(200).json({
      status: "Success",
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        status: "Error",
        message: "Movie not found or you don't have permission to update it",
      });
    }
    res.status(500).json({
      status: "Error",
      message: "Failed to update movie",
      ...(process.env.NODE_ENV === "development" && { debug: error.message }),
    });
  }
};

const deleteMovie = async (req, res) => {
  const prisma = getPrisma();
  try {
    const movie = await prisma.movie.delete({
      where: {
        id: req.params.id,
        createdBy: req.user.id, // Ensures user can only delete their own movies
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Movie deleted successfully",
      data: movie,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        status: "Error",
        message: "Movie not found or you don't have permission to delete it",
      });
    }
    res.status(500).json({
      status: "Error",
      message: "Failed to delete movie",
      ...(process.env.NODE_ENV === "development" && { debug: error.message }),
    });
  }
};

export { getAllMovies, addNewMovie, updateMovie, deleteMovie };
