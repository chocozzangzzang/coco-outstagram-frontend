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
  username: string;
  content: string;
  createdAt: string;
}

export interface PostImageProps {
  id: number;
  imageIndex: number;
  imageUrl: string;
  fileName: string;
}

export interface User {
  id: number;
  username: string;
  profilePictureName: string;
  profilePictureUrl: string;
  role: string;
  email: string;
  createdAt: string;
  firebaseUid: string;
  comments: Comment[];
  likes: Like[];
}

export interface UserProp {
  user : User;
}