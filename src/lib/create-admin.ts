import "dotenv/config"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
export const dynamic = "force-dynamic"
async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@aurafresh.pk" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@aurafresh.pk",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Admin created:", admin.email)
  process.exit(0)
}

createAdmin().catch((e) => {
  console.error("❌ Error:", e)
  process.exit(1)
})