export interface Post {
  id: number;
  content: string;
  createdAt: string;
  writer: string;
  likes: Like[];
  comments: Comment[];
  postImages: PostImageProps[];  
}

export interface PostProps {
  post : Post;
}

export interface Like {
  id: number;
  postId: number;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
}

export interface PostImageProps {
  id: number;
  imageIndex: number;
  imageUrl: string;
  fileName: string;
}