import { getPrisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
  const prisma = getPrisma();
  const { movieId, status, rating, note } = req.body;

  // Verify movie exists
  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
  });

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  // Check if already added
  const existingEntry = await prisma.watchListItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingEntry) {
    return res.status(400).json({ message: "Movie already added to watchlist" });
  }

  const watchListItem = await prisma.watchListItem.create({
    data: {
      userId: req.user.id,
      movieId: movieId,
      status: status || "PLANNED",
      rating: rating,
      note: note,
    },
  });

  res.status(201).json({
    status: "Success",
    message: "Movie added to watchlist",
    data: watchListItem,
  });
};

const removeFromWatchList = async (req, res) => {
  const prisma = getPrisma();

  const watchlistItem = await prisma.watchListItem.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({ message: "Watchlist item not found" });
  }

  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to remove this item" });
  }

  await prisma.watchListItem.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    status: "Success",
    message: "Movie removed from watchlist",
    data: watchlistItem,
  });
};

const updateWatchList = async (req, res) => {
  const prisma = getPrisma();
  const { status, rating, note } = req.body;

  const watchlistItem = await prisma.watchListItem.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({ message: "Watchlist item not found" });
  }

  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to update this item" });
  }

  const updatedData = {};
  if (status !== undefined) updatedData.status = status.toUpperCase();
  if (rating !== undefined) updatedData.rating = rating;
  if (note !== undefined) updatedData.note = note;

  const updatedWatchlistItem = await prisma.watchListItem.update({
    where: {
      id: req.params.id,
    },
    data: updatedData,
  });

  res.status(200).json({
    status: "Success",
    message: "Movie updated in watchlist",
    data: updatedWatchlistItem,
  });
};

export { addToWatchList, removeFromWatchList, updateWatchList };
