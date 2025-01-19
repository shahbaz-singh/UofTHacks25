// Unit Tests Guidelines:
// 1. Test all public methods
// 2. Cover edge cases and error conditions
// 3. Test interactions between classes
// 4. Verify state changes
// 5. Test performance with large datasets

// User Tests
test('User cannot follow themselves', () => {
  const user = new User(1, 'testUser');
  expect(() => {
    user.follow(1);
  }).toThrow('Cannot follow yourself');
});

test('User can follow and unfollow another user', () => {
  const user = new User(1, 'testUser');
  expect(user.follow(2)).toBe(true);  // First follow succeeds
  expect(user.follow(2)).toBe(false); // Second follow fails
  expect(user.unfollow(2)).toBe(true);  // Unfollow succeeds
  expect(user.unfollow(2)).toBe(false); // Second unfollow fails
});

test('User cannot create empty post', () => {
  const user = new User(1, 'testUser');
  expect(() => {
    user.createPost('   ');
  }).toThrow('Post content cannot be empty');
});

// Post Tests
test('Post like functionality works correctly', () => {
  const post = new Post(1, 1, 'Test content');
  expect(post.like(2)).toBe(true);    // First like succeeds
  expect(post.like(2)).toBe(false);   // Second like removes it
  expect(post.getStats().likeCount).toBe(0);
});

test('Post cannot have empty comments', () => {
  const post = new Post(1, 1, 'Test content');
  expect(() => {
    post.addComment(2, '  ');
  }).toThrow('Comment cannot be empty');
});

test('Post can only be edited by author', () => {
  const post = new Post(1, 1, 'Original content');
  expect(() => {
    post.editContent('New content', 2);
  }).toThrow('Only the author can edit the post');
});

test('Post popularity is calculated correctly', () => {
  const post = new Post(1, 1, 'Test content');
  for (let i = 2; i <= 12; i++) {
    post.like(i);
  }
  expect(post.getStats().isPopular).toBe(true);
});

// Feed Tests
test('Feed returns trending posts in correct order', () => {
  const feed = new Feed();
  const post1 = new Post(1, 1, 'Post 1');
  const post2 = new Post(2, 1, 'Post 2');
  
  feed.addPost(post1);
  feed.addPost(post2);
  
  post1.like(2);
  post2.like(2);
  post2.like(3);
  
  const trending = feed.getTrendingPosts();
  expect(trending[0].id).toBe(2);  // Post 2 should be first
});

test('Feed filters posts by user correctly', () => {
  const feed = new Feed();
  const post1 = new Post(1, 1, 'User 1 post');
  const post2 = new Post(2, 2, 'User 2 post');
  
  feed.addPost(post1);
  feed.addPost(post2);
  
  const user1Posts = feed.getPostsByUser(1);
  expect(user1Posts.length).toBe(1);
  expect(user1Posts[0].content).toBe('User 1 post');
});

test('Post comments are added with correct IDs', () => {
  const post = new Post(1, 1, 'Test content');
  const comment1 = post.addComment(2, 'First comment');
  const comment2 = post.addComment(3, 'Second comment');
  
  expect(comment1.id).toBe(1);
  expect(comment2.id).toBe(2);
  expect(post.comments.length).toBe(2);
});

test('User stats are calculated correctly', () => {
  const user = new User(1, 'testUser');
  user.createPost('Post 1');
  user.createPost('Post 2');
  user.follow(2);
  user.follow(3);
  
  const stats = user.getStats();
  expect(stats.postCount).toBe(2);
  expect(stats.followingCount).toBe(2);
  expect(stats.isInfluencer).toBe(false);
});

test('Feed post removal works correctly', () => {
  const feed = new Feed();
  const post = new Post(1, 1, 'Test post');
  
  feed.addPost(post);
  expect(feed.removePost(1)).toBe(true);   // First removal succeeds
  expect(feed.removePost(1)).toBe(false);  // Second removal fails
  expect(feed.getPostsByUser(1).length).toBe(0);
}); 