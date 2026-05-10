"use client"

import { useEffect, useState } from "react"
import { Star, Pencil, Trash2, X, Send } from "lucide-react"

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-100 hover:scale-110"
        >
          <Star
            className={`h-7 w-7 transition-colors duration-150 ${
              s <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-stone-200 text-stone-200"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-stone-500 self-center">
        {(hovered || value) === 1 && "Poor"}
        {(hovered || value) === 2 && "Fair"}
        {(hovered || value) === 3 && "Good"}
        {(hovered || value) === 4 && "Great"}
        {(hovered || value) === 5 && "Excellent"}
      </span>
    </div>
  )
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${
            s <= value ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"
          }`}
        />
      ))}
    </div>
  )
}

export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      const data = await res.json()
      setUser(data?.user || data || null)
    } catch {
      setUser(null)
    }
  }

  async function fetchReviews() {
    const res = await fetch(`/api/reviews?productId=${productId}`, { cache: "no-store" })
    const data = await res.json()
    setReviews(data || [])
  }

  useEffect(() => {
    loadUser()
    fetchReviews()
  }, [productId])

  async function submitReview() {
    if (!user) return alert("Please login to leave a review")
    if (!comment.trim()) return alert("Please write a comment")

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
    if (!confirm("Delete this review?")) return
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE", credentials: "include" })
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
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
  }

  function cancelEdit() {
    setEditId(null)
    setRating(5)
    setComment("")
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <section className="bg-[#FAF8F5] border-t border-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400 font-medium mb-2">
              What People Say
            </p>
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-3xl font-bold text-stone-900"
            >
              Customer Reviews
            </h2>
          </div>

          {avg && (
            <div className="flex items-center gap-3 bg-white border border-stone-100 rounded-2xl px-5 py-3 shadow-sm">
              <span
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-4xl font-bold text-stone-900"
              >
                {avg}
              </span>
              <div>
                <StarDisplay value={Math.round(Number(avg))} />
                <p className="text-xs text-stone-400 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          )}
        </div>

        {/* Reviews list */}
        <div className="space-y-4 mb-10">
          {reviews.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <Star className="h-10 w-10 mx-auto mb-3 text-stone-200" />
              <p className="text-sm">No reviews yet — be the first!</p>
            </div>
          )}

          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-sm font-bold text-amber-700 flex-shrink-0">
                    {(r.user?.name || r.userName || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {r.user?.name || r.userName || "Anonymous"}
                    </p>
                    <StarDisplay value={r.rating} />
                  </div>
                </div>

                {user?.id === r.userId && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(r)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteReview(r.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {r.comment && (
                <p className="text-stone-600 text-sm leading-relaxed mt-3 pl-12">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Write review form */}
        <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-stone-800 mb-5">
            {editId ? "Edit Your Review" : "Write a Review"}
          </h3>

          {!user && (
            <p className="text-sm text-stone-400 mb-4">
              <a href="/login" className="text-amber-600 font-medium hover:underline">Login</a> to leave a review.
            </p>
          )}

          {/* Star picker — no dropdown, no mobile bug */}
          <div className="mb-4">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Your Rating</p>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div className="mb-4">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Your Comment</p>
            <textarea
              rows={4}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent resize-none transition"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this fragrance..."
              disabled={!user}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={submitReview}
              disabled={loading || !user}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-700 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              <Send className="h-4 w-4" />
              {loading ? "Submitting..." : editId ? "Update Review" : "Submit Review"}
            </button>

            {editId && (
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}