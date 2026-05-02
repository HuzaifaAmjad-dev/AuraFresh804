import "dotenv/config"
import { db } from "./db"
import { users } from "./schema"
import { eq } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import bcrypt from "bcryptjs"

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, "admin@aurafresh.pk"),
  })

  if (existing) {
    console.log("✅ Admin already exists:", existing.email)
    process.exit(0)
  }

  await db.insert(users).values({
    id: createId(),
    name: "Admin",
    email: "admin@aurafresh.pk",
    password: hashedPassword,
    role: "ADMIN",
  })

  console.log("✅ Admin created: admin@aurafresh.pk")
  process.exit(0)
}

createAdmin().catch((e) => {
  console.error("❌ Error:", e)
  process.exit(1)
})