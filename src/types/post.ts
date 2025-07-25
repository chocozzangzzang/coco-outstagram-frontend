export interface Post {
  id: number;
  content: string;
  createdAt: string;
  writer: string;
  postImages: PostImageProps[];  
}

export interface PostProps {
  post : Post;
}

export interface PostImageProps {
  id: number;
  imageIndex: number;
  imageUrl: string;
  fileName: string;
}