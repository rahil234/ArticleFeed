export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  preferences: string[]
  createdAt: string
}

export interface Article {
  id: string
  title: string
  description: string
  content: string
  images: string[]
  tags: string[]
  category: string
  authorId: string
  authorName: string
  likes: number
  dislikes: number
  blocks: number
  createdAt: string
  updatedAt: string
}

export interface ArticleInteraction {
  articleId: string
  userId: string
  type: "like" | "dislike" | "block"
}

export const CATEGORIES = [
  "Sports",
  "Politics",
  "Space",
  "Technology",
  "Health",
  "Entertainment",
  "Business",
  "Science",
] as const

export type Category = (typeof CATEGORIES)[number]
