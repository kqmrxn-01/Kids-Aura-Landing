// Kids Aura Local Mock Database Service
// Persists users, comments, replies, follows, notifications, and analytics across sessions.

const DB_KEYS = {
  USERS: 'kidsaura_users',
  VIDEOS: 'kidsaura_videos',
  COMMENTS: 'kidsaura_comments',
  FOLLOWERS: 'kidsaura_followers',
  NOTIFICATIONS: 'kidsaura_notifications',
  VIEWS: 'kidsaura_views',
  LIKES: 'kidsaura_likes',
  PARENT_PIN: 'kidsaura_parent_pin'
};

// Initial database seeding if empty
const INITIAL_USERS = [
  {
    id: 'user-self',
    username: 'kid_explorer',
    displayName: 'Guest Explorer',
    bio: 'Exploring Kids Aura! 🎈🚀',
    avatarUrl: 'G',
    joinedDate: '2026-07-09'
  }
];


const MOCK_YOUTUBE_SHORTS = [
  {
    id: 'yt-mock1',
    title: 'How Do Rockets Fly into Space?',
    description: 'Learn the basic science principles behind rocket propulsion and space travel. Fun physics lesson for kids!',
    creatorId: 'yt-sci-lab',
    creator: '@science_fun_lab',
    category: 'Science',
    url: 'd5vF9gT4K6s',
    poster: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=300&auto=format&fit=crop&q=60',
    likesCount: 1542,
    viewsCount: 12430,
    ageRating: 13,
    created_at: '2026-07-06T10:00:00Z',
    source: 'youtube'
  },
  {
    id: 'yt-mock2',
    title: 'Sea Monsters of the Past!',
    description: 'Travel back in time to meet the ancient, giant reptiles that swam in our oceans millions of years ago.',
    creatorId: 'yt-anim-world',
    creator: '@animal_safari_kids',
    category: 'Animals',
    url: 'q6_tS7zE3yE',
    poster: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=60',
    likesCount: 924,
    viewsCount: 7890,
    ageRating: 3,
    created_at: '2026-07-07T11:00:00Z',
    source: 'youtube'
  },
  {
    id: 'yt-mock3',
    title: 'How Does Soap Clean Hands?',
    description: 'Simple science demonstration showing exactly how soap molecules lift germs and dirt away from skin.',
    creatorId: 'yt-creative-hq',
    creator: '@crayola_creative_kids',
    category: 'Life Skills',
    url: 'T7M073a-4j4',
    poster: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=60',
    likesCount: 785,
    viewsCount: 4320,
    ageRating: 7,
    created_at: '2026-07-08T09:00:00Z',
    source: 'youtube'
  },
  {
    id: 'yt-mock4',
    title: 'Fun Nursery Rhyme - Cocomelon Bath Song!',
    description: 'Learn good hygiene habits with this extremely popular nursery rhyme from Cocomelon. Sing and wash along!',
    creatorId: 'yt-funny-pets',
    creator: '@cocomelon_rhymes',
    category: 'Funny',
    url: 'e_04ZrNroTo',
    poster: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=60',
    likesCount: 2314,
    viewsCount: 18450,
    ageRating: 3,
    created_at: '2026-07-09T14:00:00Z',
    source: 'youtube'
  }
];

const getCategoryPoster = (category) => {
  switch (category) {
    case 'Science':
      return 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=300&auto=format&fit=crop&q=60';
    case 'Animals':
      return 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=60';
    case 'Funny':
      return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=60';
    case 'Life Skills':
      return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=60';
    case 'Gaming':
    default:
      return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=60';
  }
};

const INITIAL_VIDEOS = [];

const INITIAL_COMMENTS = [
  {
    id: 'c1',
    videoId: 'seed-panda',
    userId: 'user-science',
    username: 'science_sam',
    avatarUrl: 'S',
    content: 'Pandas are so cute! Did you know they spend 12 hours a day eating?',
    parentId: null,
    isReported: false,
    created_at: '2026-07-05T12:00:00Z'
  },
  {
    id: 'c2',
    videoId: 'seed-panda',
    userId: 'user-nature',
    username: 'nature_kids',
    avatarUrl: 'N',
    content: 'Yes! They need a lot of bamboo energy! 🐼💚',
    parentId: 'c1',
    isReported: false,
    created_at: '2026-07-05T13:10:00Z'
  },
  {
    id: 'c3',
    videoId: 'seed-science',
    userId: 'user-creative',
    username: 'creative_kids',
    avatarUrl: 'C',
    content: 'Wow, this looks like magic! I am going to try painting it.',
    parentId: null,
    isReported: false,
    created_at: '2026-07-06T10:00:00Z'
  }
];

// Helper to load/save JSON from localStorage
const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return fallback;
  }
};

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize DB if empty
if (!localStorage.getItem(DB_KEYS.USERS)) save(DB_KEYS.USERS, INITIAL_USERS);
if (!localStorage.getItem(DB_KEYS.VIDEOS)) save(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
if (!localStorage.getItem(DB_KEYS.COMMENTS)) save(DB_KEYS.COMMENTS, INITIAL_COMMENTS);
if (!localStorage.getItem(DB_KEYS.FOLLOWERS)) save(DB_KEYS.FOLLOWERS, []);
if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) save(DB_KEYS.NOTIFICATIONS, []);
if (!localStorage.getItem(DB_KEYS.LIKES)) save(DB_KEYS.LIKES, []);
if (!localStorage.getItem(DB_KEYS.VIEWS)) save(DB_KEYS.VIEWS, {});

export const mockDb = {
  // --- USER AUTHENTICATION / SIGNUP MOCK ---
  getUsers: () => load(DB_KEYS.USERS, INITIAL_USERS),
  
  getCurrentUser: () => {
    const users = load(DB_KEYS.USERS, INITIAL_USERS);
    const explorer = users.find(u => u.username === 'kid_explorer');
    if (explorer) return explorer;
    if (users.length > 0) return users[0];
    return {
      id: 'user-self',
      username: 'kid_explorer',
      displayName: 'Guest Explorer',
      bio: 'Exploring Kids Aura! 🎈🚀',
      avatarUrl: 'G',
      joinedDate: '2026-07-09'
    };
  },

  isUsernameAvailable: (username) => {
    // Validation rules: lowercase, numbers, dots, underscores, no space
    const regex = /^[a-z0-9._]+$/;
    if (!regex.test(username)) {
      return { available: false, reason: 'Only lowercase letters, numbers, ".", and "_" allowed.' };
    }
    if (username.includes(' ')) {
      return { available: false, reason: 'Usernames cannot contain spaces.' };
    }
    const users = load(DB_KEYS.USERS, INITIAL_USERS);
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return { available: false, reason: 'Username is already taken.' };
    }
    return { available: true };
  },

  createUser: (username, displayName, bio = '') => {
    const check = mockDb.isUsernameAvailable(username);
    if (!check.available) return { success: false, reason: check.reason };

    const users = load(DB_KEYS.USERS, INITIAL_USERS);
    const newUser = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase(),
      displayName,
      bio,
      avatarUrl: username.substring(0, 1).toUpperCase(),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    save(DB_KEYS.USERS, users);
    return { success: true, user: newUser };
  },

  // --- CREATOR PROFILE DETAILS ---
  getCreatorProfile: (username) => {
    const cleanUsername = username.replace('@', '');
    const users = load(DB_KEYS.USERS, INITIAL_USERS);
    let creator = users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
    const isYtCreator = cleanUsername.toLowerCase().includes('science_fun_lab') || 
                        cleanUsername.toLowerCase().includes('animal_safari_kids') || 
                        cleanUsername.toLowerCase().includes('crayola_creative_kids') || 
                        cleanUsername.toLowerCase().includes('funny_animals_kids') ||
                        username.startsWith('@yt-') ||
                        !creator;
    
    if (!creator) {
      // Hydrate dynamic YouTube creator profile
      creator = {
        id: `yt-author-${cleanUsername}`,
        username: cleanUsername,
        displayName: cleanUsername.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        bio: `Featured KidSafe channel on YouTube! 🎥🌟`,
        avatarUrl: cleanUsername.substring(0, 1).toUpperCase(),
        joinedDate: '2026-07-16'
      };
    }

    // Fetch followers & following count
    const followersList = load(DB_KEYS.FOLLOWERS, []);
    const followers = followersList.filter(f => f.followingId === creator.id).length;
    const following = followersList.filter(f => f.followerId === creator.id).length;

    // Fetch videos list
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    let creatorVideos = [];

    if (creator.id.startsWith('yt-author-')) {
      const allYoutube = MOCK_YOUTUBE_SHORTS;
      creatorVideos = allYoutube.filter(v => v.creator.replace('@', '').toLowerCase() === cleanUsername.toLowerCase());
    } else {
      creatorVideos = videos.filter(v => v.creatorId === creator.id);
    }

    // Sum likes and views
    const totalLikes = creatorVideos.reduce((sum, v) => sum + (v.likesCount || 0), 0);
    const totalViews = creatorVideos.reduce((sum, v) => sum + (v.viewsCount || 0), 0);

    return {
      ...creator,
      followersCount: followers + (creator.id.startsWith('yt-author-') ? 1240 : 0),
      followingCount: following,
      totalLikes,
      totalViews,
      videos: creatorVideos
    };
  },

  // --- FOLLOW SYSTEM ---
  isFollowing: (creatorId) => {
    const currentUser = mockDb.getCurrentUser();
    const followers = load(DB_KEYS.FOLLOWERS, []);
    return followers.some(f => f.followerId === currentUser.id && f.followingId === creatorId);
  },

  toggleFollow: (creatorId) => {
    const currentUser = mockDb.getCurrentUser();
    if (currentUser.id === creatorId) return { success: false, reason: 'You cannot follow yourself!' };

    const followers = load(DB_KEYS.FOLLOWERS, []);
    const isFollowing = followers.some(f => f.followerId === currentUser.id && f.followingId === creatorId);

    let updatedFollowers;
    if (isFollowing) {
      updatedFollowers = followers.filter(f => !(f.followerId === currentUser.id && f.followingId === creatorId));
    } else {
      updatedFollowers = [...followers, {
        id: `follow-${Date.now()}`,
        followerId: currentUser.id,
        followingId: creatorId,
        created_at: new Date().toISOString()
      }];
      // Add notification for creator
      mockDb.createNotification(creatorId, 'follow', null, null);
    }

    save(DB_KEYS.FOLLOWERS, updatedFollowers);
    return { success: true, following: !isFollowing };
  },

  // --- VIDEOS & UPLOADS ---
  getVideos: () => {
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    const likes = load(DB_KEYS.LIKES, []);
    const currentUser = mockDb.getCurrentUser();
    const currentUserId = currentUser?.id || 'guest';

    // Map liked state
    return videos.map(video => ({
      ...video,
      liked: likes.some(l => l.userId === currentUserId && l.videoId === video.id)
    }));
  },

  incrementViewCount: (videoId) => {
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    const updated = videos.map(v => 
      v.id === videoId ? { ...v, viewsCount: (v.viewsCount || 0) + 1 } : v
    );
    save(DB_KEYS.VIDEOS, updated);
  },

  publishVideo: (title, description, category, url, safetyScore) => {
    const currentUser = mockDb.getCurrentUser();
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    
    const newVideo = {
      id: `vid-${Date.now()}`,
      title,
      description,
      creatorId: currentUser.id,
      creator: `@${currentUser.username}`,
      category,
      url,
      poster: getCategoryPoster(category),
      likesCount: 0,
      viewsCount: 0,
      safetyScore,
      created_at: new Date().toISOString()
    };

    videos.unshift(newVideo);
    save(DB_KEYS.VIDEOS, videos);
    return newVideo;
  },

  // --- LIKES ---
  toggleLike: (videoId) => {
    const currentUser = mockDb.getCurrentUser();
    const likes = load(DB_KEYS.LIKES, []);
    const hasLiked = likes.some(l => l.userId === currentUser.id && l.videoId === videoId);

    let updatedLikes;
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    
    if (hasLiked) {
      updatedLikes = likes.filter(l => !(l.userId === currentUser.id && l.videoId === videoId));
      // Decrement likes count
      save(DB_KEYS.VIDEOS, videos.map(v => v.id === videoId ? { ...v, likesCount: Math.max(0, (v.likesCount || 0) - 1) } : v));
    } else {
      updatedLikes = [...likes, {
        id: `like-${Date.now()}`,
        userId: currentUser.id,
        videoId: videoId,
        created_at: new Date().toISOString()
      }];
      // Increment likes count
      save(DB_KEYS.VIDEOS, videos.map(v => v.id === videoId ? { ...v, likesCount: (v.likesCount || 0) + 1 } : v));

      // Trigger notification for video creator
      const targetVideo = videos.find(v => v.id === videoId);
      if (targetVideo && targetVideo.creatorId !== currentUser.id) {
        mockDb.createNotification(targetVideo.creatorId, 'like', videoId, null);
      }
    }

    save(DB_KEYS.LIKES, updatedLikes);
    return { liked: !hasLiked };
  },

  // --- COMMENTS & REPLIES ---
  getCommentsForVideo: (videoId) => {
    const comments = load(DB_KEYS.COMMENTS, INITIAL_COMMENTS);
    return comments.filter(c => c.videoId === videoId && !c.isReported);
  },

  addComment: (videoId, content, parentId = null) => {
    if (!content.trim()) return { success: false, reason: 'Comment content cannot be empty!' };
    
    const currentUser = mockDb.getCurrentUser();
    const comments = load(DB_KEYS.COMMENTS, INITIAL_COMMENTS);

    const newComment = {
      id: `comm-${Date.now()}`,
      videoId,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      content: content.trim(),
      parentId,
      isReported: false,
      created_at: new Date().toISOString()
    };

    comments.push(newComment);
    save(DB_KEYS.COMMENTS, comments);

    // Create system notification
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    const targetVideo = videos.find(v => v.id === videoId);
    
    if (parentId) {
      // Find parent commenter to notify of reply
      const parentComment = comments.find(c => c.id === parentId);
      if (parentComment && parentComment.userId !== currentUser.id) {
        mockDb.createNotification(parentComment.userId, 'reply', videoId, newComment.id);
      }
    } else if (targetVideo && targetVideo.creatorId !== currentUser.id) {
      // Notify creator of new video comment
      mockDb.createNotification(targetVideo.creatorId, 'comment', videoId, newComment.id);
    }

    return { success: true, comment: newComment };
  },

  deleteComment: (commentId) => {
    const currentUser = mockDb.getCurrentUser();
    const comments = load(DB_KEYS.COMMENTS, INITIAL_COMMENTS);
    const target = comments.find(c => c.id === commentId);

    if (!target) return { success: false, reason: 'Comment not found.' };
    if (target.userId !== currentUser.id) return { success: false, reason: 'You can only delete your own comments!' };

    // Delete comment and its child replies recursively
    const deleteIds = new Set([commentId]);
    let prevSize = 0;
    while (deleteIds.size > prevSize) {
      prevSize = deleteIds.size;
      comments.forEach(c => {
        if (c.parentId && deleteIds.has(c.parentId)) {
          deleteIds.add(c.id);
        }
      });
    }

    const filtered = comments.filter(c => !deleteIds.has(c.id));
    save(DB_KEYS.COMMENTS, filtered);
    return { success: true };
  },

  reportComment: (commentId) => {
    const comments = load(DB_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = comments.map(c => 
      c.id === commentId ? { ...c, isReported: true } : c
    );
    save(DB_KEYS.COMMENTS, updated);
    return { success: true };
  },

  // --- NOTIFICATIONS CENTER ---
  getNotifications: () => {
    const currentUser = mockDb.getCurrentUser();
    const notifications = load(DB_KEYS.NOTIFICATIONS, []);
    const users = load(DB_KEYS.USERS, INITIAL_USERS);
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);

    // Hydrate notifications with sender details and target titles
    return notifications
      .filter(n => n.recipientId === currentUser.id)
      .map(n => {
        const sender = users.find(u => u.id === n.senderId);
        const video = n.videoId ? videos.find(v => v.id === n.videoId) : null;
        return {
          ...n,
          senderName: sender ? sender.displayName : 'A user',
          senderUsername: sender ? `@${sender.username}` : '',
          senderAvatar: sender ? sender.avatarUrl : '?',
          videoTitle: video ? video.title : ''
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createNotification: (recipientId, type, videoId, commentId) => {
    const currentUser = mockDb.getCurrentUser();
    if (currentUser.id === recipientId) return; // Don't notify self

    const notifications = load(DB_KEYS.NOTIFICATIONS, []);
    notifications.push({
      id: `notif-${Date.now()}`,
      recipientId,
      senderId: currentUser.id,
      type,
      videoId,
      commentId,
      isRead: false,
      created_at: new Date().toISOString()
    });
    save(DB_KEYS.NOTIFICATIONS, notifications);
  },

  markNotificationsAsRead: () => {
    const currentUser = mockDb.getCurrentUser();
    const notifications = load(DB_KEYS.NOTIFICATIONS, []);
    const updated = notifications.map(n => 
      n.recipientId === currentUser.id ? { ...n, isRead: true } : n
    );
    save(DB_KEYS.NOTIFICATIONS, updated);
  },

  // --- PARENT SECURITY ---
  setParentPin: (pin) => {
    save(DB_KEYS.PARENT_PIN, pin);
  },

  getParentPin: () => {
    return load(DB_KEYS.PARENT_PIN, null);
  },

  // --- TRACK WATCH SESSIONS ---
  logWatchDuration: (category, seconds) => {
    const stats = load(DB_KEYS.VIEWS, {
      Science: 0,
      Animals: 0,
      Funny: 0,
      'Life Skills': 0,
      Gaming: 0
    });
    stats[category] = (stats[category] || 0) + seconds;
    save(DB_KEYS.VIEWS, stats);
  },

  getWatchStats: () => {
    return load(DB_KEYS.VIEWS, {
      Science: 0,
      Animals: 0,
      Funny: 0,
      'Life Skills': 0,
      Gaming: 0
    });
  },

  resetWatchStats: () => {
    const emptyStats = {
      Science: 0,
      Animals: 0,
      Funny: 0,
      'Life Skills': 0,
      Gaming: 0
    };
    save(DB_KEYS.VIEWS, emptyStats);
    return emptyStats;
  },

  // --- CREATOR ANALYTICS ---
  getCreatorAnalytics: () => {
    const currentUser = mockDb.getCurrentUser();
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    const creatorVideos = videos.filter(v => v.creatorId === currentUser.id);

    const totalViews = creatorVideos.reduce((sum, v) => sum + (v.viewsCount || 0), 0);
    const totalLikes = creatorVideos.reduce((sum, v) => sum + (v.likesCount || 0), 0);

    // Comments received on creator's videos
    const comments = load(DB_KEYS.COMMENTS, INITIAL_COMMENTS);
    const videoIds = new Set(creatorVideos.map(v => v.id));
    const commentsReceived = comments.filter(c => videoIds.has(c.videoId)).length;

    // Followers gained
    const followers = load(DB_KEYS.FOLLOWERS, []);
    const followersGained = followers.filter(f => f.followingId === currentUser.id).length;

    // Most viewed video
    let mostViewed = null;
    if (creatorVideos.length > 0) {
      mostViewed = creatorVideos.reduce((max, v) => v.viewsCount > max.viewsCount ? v : max, creatorVideos[0]);
    }

    // Recent items: Filter notifications for likes, follows, comments
    const notifications = mockDb.getNotifications().slice(0, 10);

    return {
      totalViews,
      totalLikes,
      commentsReceived,
      followersGained,
      videosCount: creatorVideos.length,
      mostViewedVideo: mostViewed ? mostViewed.title : 'None yet',
      recentActivities: notifications,
      watchTimeMinutes: Math.round((totalViews * 12) / 60) // Estimating 12s average view duration
    };
  },

  deleteVideo: (videoId) => {
    const videos = load(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    const filtered = videos.filter(v => v.id !== videoId);
    save(DB_KEYS.VIDEOS, filtered);
    return { success: true };
  },

  getMockYoutubeShorts: (category) => {
    return MOCK_YOUTUBE_SHORTS.filter(v => !category || v.category === category);
  }
};
