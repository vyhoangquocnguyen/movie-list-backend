import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client/client.ts";

// Create Neon adapter with connection string
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

const userId = "cmitywpc50000g85wukiijhvk";

const movies = [
  {
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    genre: ["Drama"],
    runtime: 142,
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  },
  {
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    genre: ["Crime", "Drama"],
    runtime: 175,
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  },
  {
    title: "The Dark Knight",
    overview:
      "When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    genre: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    title: "The Godfather Part II",
    overview:
      "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    releaseYear: 1974,
    genre: ["Crime", "Drama"],
    runtime: 202,
    posterUrl: "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
  },
  {
    title: "12 Angry Men",
    overview:
      "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    releaseYear: 1957,
    genre: ["Crime", "Drama"],
    runtime: 96,
    posterUrl: "https://image.tmdb.org/t/p/w500/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
  },
  {
    title: "Schindler's List",
    overview:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    releaseYear: 1993,
    genre: ["Biography", "Drama", "History"],
    runtime: 195,
    posterUrl: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    overview:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    releaseYear: 2003,
    genre: ["Action", "Adventure", "Drama"],
    runtime: 201,
    posterUrl: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
  },
  {
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    genre: ["Crime", "Drama"],
    runtime: 154,
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  },
  {
    title: "The Good, the Bad and the Ugly",
    overview:
      "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
    releaseYear: 1966,
    genre: ["Adventure", "Western"],
    runtime: 178,
    posterUrl: "https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
  },
  {
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    releaseYear: 1994,
    genre: ["Drama", "Romance"],
    runtime: 142,
    posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  },
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    genre: ["Action", "Adventure", "Sci-Fi"],
    runtime: 148,
    posterUrl: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
  },
  {
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.",
    releaseYear: 1999,
    genre: ["Drama"],
    runtime: 139,
    posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    overview:
      "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader.",
    releaseYear: 1980,
    genre: ["Action", "Adventure", "Fantasy"],
    runtime: 124,
    posterUrl: "https://image.tmdb.org/t/p/w500/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg",
  },
  {
    title: "The Matrix",
    overview:
      "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    releaseYear: 1999,
    genre: ["Action", "Sci-Fi"],
    runtime: 136,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  {
    title: "Goodfellas",
    overview:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    releaseYear: 1990,
    genre: ["Biography", "Crime", "Drama"],
    runtime: 146,
    posterUrl: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
  },
  {
    title: "One Flew Over the Cuckoo's Nest",
    overview:
      "A criminal pleads insanity and is admitted to a mental institution, where he rebels against the oppressive nurse and rallies up the scared patients.",
    releaseYear: 1975,
    genre: ["Drama"],
    runtime: 133,
    posterUrl: "https://image.tmdb.org/t/p/w500/3jcbDmRFiQ83drXNOvRDeKHxS0C.jpg",
  },
  {
    title: "Seven Samurai",
    overview:
      "A poor village under attack by bandits recruits seven unemployed samurai to help them defend themselves.",
    releaseYear: 1954,
    genre: ["Action", "Drama"],
    runtime: 207,
    posterUrl: "https://image.tmdb.org/t/p/w500/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg",
  },
  {
    title: "Casablanca",
    overview:
      "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.",
    releaseYear: 1942,
    genre: ["Drama", "Romance", "War"],
    runtime: 102,
    posterUrl: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
  },
  {
    title: "Gone with the Wind",
    overview:
      "A manipulative woman and a roguish man conduct a turbulent romance during the American Civil War and Reconstruction periods.",
    releaseYear: 1939,
    genre: ["Drama", "History", "Romance"],
    runtime: 238,
    posterUrl: "https://image.tmdb.org/t/p/w500/lXlskyTvrGZsdGusEFlS3bFGxq2.jpg",
  },
  {
    title: "Parasite",
    overview:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseYear: 2019,
    genre: ["Comedy", "Drama", "Thriller"],
    runtime: 132,
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
];

async function main() {
  console.log("Start seeding...");

  for (const movie of movies) {
    const createdMovie = await prisma.movie.create({
      data: {
        ...movie,
        createdBy: userId,
      },
    });
    console.log(`Created movie: ${createdMovie.title}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
