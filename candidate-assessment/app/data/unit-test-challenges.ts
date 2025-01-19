import { Challenge } from './challenges'

export const socialMediaChallenge: Challenge = {
  id: 'social-media-tests',
  title: 'Social Media Tests',
  description: 'Write unit tests for a social media platform',
  difficulty: 'Medium',
  files: {
    'src/User.js': `
      class User {
        constructor(id, username) {
          this.id = id;
          this.username = username;
          this.following = new Set();
          this.posts = [];
        }

        follow(userId) {
          if (userId === this.id) {
            throw new Error('Cannot follow yourself');
          }
          if (this.following.has(userId)) {
            return false;
          }
          this.following.add(userId);
          return true;
        }

        unfollow(userId) {
          return this.following.delete(userId);
        }

        createPost(content) {
          if (!content.trim()) {
            throw new Error('Post content cannot be empty');
          }
          const post = new Post(this.posts.length + 1, this.id, content);
          this.posts.push(post);
          return post;
        }
      }
    `,
    'src/Post.js': `
      class Post {
        constructor(id, author, content) {
          this.id = id;
          this.author = author;
          this.content = content;
          this.likes = new Set();
          this.comments = [];
          this.createdAt = new Date();
        }

        like(userId) {
          if (this.likes.has(userId)) {
            this.likes.delete(userId);
            return false; // Unliked
          }
          this.likes.add(userId);
          return true; // Liked
        }

        addComment(userId, text) {
          if (!text.trim()) {
            throw new Error('Comment cannot be empty');
          }
          const comment = {
            id: this.comments.length + 1,
            userId,
            text,
            timestamp: new Date()
          };
          this.comments.push(comment);
          return comment;
        }

        editContent(newContent, userId) {
          if (userId !== this.author) {
            throw new Error('Only the author can edit the post');
          }
          if (!newContent.trim()) {
            throw new Error('Content cannot be empty');
          }
          this.content = newContent;
          return true;
        }

        getStats() {
          return {
            likeCount: this.likes.size,
            commentCount: this.comments.length,
            isPopular: this.likes.size > 10
          };
        }
      }
    `,
    'src/Feed.js': `
      class Feed {
        constructor() {
          this.posts = new Map();
          this.users = new Map();
        }

        addPost(post) {
          this.posts.set(post.id, post);
        }

        removePost(postId) {
          return this.posts.delete(postId);
        }

        getPostsByUser(userId) {
          return Array.from(this.posts.values())
            .filter(post => post.author === userId)
            .sort((a, b) => b.createdAt - a.createdAt);
        }

        getTrendingPosts() {
          return Array.from(this.posts.values())
            .sort((a, b) => b.likes.size - a.likes.size)
            .slice(0, 10);
        }
      }
    `,
    'tests/socialMedia.test.js': ''
  }
} 