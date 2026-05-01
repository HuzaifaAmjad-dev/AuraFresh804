export function getImageUrl(url?: string | null) {
    if (!url) return ""
  
    // already full URL
    if (url.startsWith("http")) return url
  
    // fallback (optional future local uploads)
    return `/placeholder.png`
  }