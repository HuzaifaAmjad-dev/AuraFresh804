"use client"

import { useEffect, useState } from "react"

export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      })
      const data = await res.json()
      // handles both { id } and { user: { id } } shapes
      setUser(data?.user || data || null)
    } catch {
      setUser(null)
    }
  }

  async function fetchReviews() {
    const res = await fetch(`/api/reviews?productId=${productId}`, {
      cache: "no-store",
    })
    const data = await res.json()
    setReviews(data || [])
  }

  useEffect(() => {
    loadUser()
    fetchReviews()
  }, [productId])

  async function submitReview() {
    if (!user) return alert("Login required")
    if (!comment.trim()) return alert("Comment is required")

    setLoading(true)
    try {
      const url = editId ? `/api/reviews/${editId}` : "/api/reviews"
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          editId
            ? { rating, comment }
            : { productId, rating, comment, userId: user.id }
        ),
      })

      if (!res.ok) {
        const err = await res.json()
        return alert("Error: " + err.error)
      }

      setComment("")
      setRating(5)
      setEditId(null)
      await fetchReviews()
    } finally {
      setLoading(false)
    }
  }

  async function deleteReview(id: string) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) {
      const err = await res.json()
      return alert("Delete failed: " + err.error)
    }
    fetchReviews()
  }

  function startEdit(r: any) {
    setEditId(r.id)
    setRating(r.rating)
    setComment(r.comment || "")
  }

  function cancelEdit() {
    setEditId(null)
    setRating(5)
    setComment("")
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <select
          className="border w-full p-2 mb-2"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <textarea
          className="border w-full p-2 mb-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write review..."
        />

        <div className="flex gap-2">
          <button
            onClick={submitReview}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {editId ? "Update Review" : "Submit Review"}
          </button>

          {editId && (
            <button
              onClick={cancelEdit}
              className="bg-gray-200 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet</p>
        )}

        {reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded bg-white">
            <div className="flex justify-between">
              <p>⭐ {r.rating}/5</p>

              {user?.id === r.userId && (
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(r)}
                    className="text-blue-500 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteReview(r.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}