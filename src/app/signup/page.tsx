"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Account created successfully")
        router.push("/login")
      } else {
        alert(data?.error || "Signup failed")
      }
    } catch (err) {
      alert("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-3"
      >
        <h1 className="text-2xl font-bold">Create Account</h1>

        <input
          value={form.name}
          placeholder="Name"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          value={form.email}
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          value={form.phone}
          placeholder="Phone"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          value={form.password}
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-black text-white w-full py-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}