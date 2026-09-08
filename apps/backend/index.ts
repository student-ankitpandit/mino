import express from "express"
import userRoutes from "./src/auth.ts"
import orgRoutes from "./src/org.ts"
import boardRoutes from "./src/board.ts"
import sectionRoutes from "./src/section.ts"
import issueRoutes from "./src/issue.ts"
import commentRoutes from "./src/comment.ts"
import inviteRoutes from "./src/invite.ts"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const allowedOrigins = [
  "https://trymino.vercel.app",
  "http://localhost:3000",
].filter(Boolean) as string[];

const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^http?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  if (origin.endsWith(".vercel.app")) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())

app.use("/api/v1", userRoutes)
app.use("/api/v1", orgRoutes)
app.use("/api/v1", boardRoutes)
app.use("/api/v1", sectionRoutes)
app.use("/api/v1", issueRoutes)
app.use("/api/v1", commentRoutes)
app.use("/api/v1", inviteRoutes)

const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => console.log(`server is running on port ${PORT}`))

