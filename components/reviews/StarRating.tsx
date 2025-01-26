import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer ${
            star <= (hoverValue || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  )
}

