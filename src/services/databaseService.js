// Kids Aura Database Service Coordinator
// Detects if Supabase Client is initialized. If so, routes database calls to live postgres tables.
// Otherwise, falls back transparently to local persistent storage mockDb.

import { supabase } from './supabaseClient';
import { mockDb } from './mockDb';
import { AiModerationService } from './AiModerationService';

let apiError = null;

// Utility helper to check if live DB is ready to roll
const isDbLive = () => {
  return supabase !== null;
};

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

export const databaseService = {
  // --- USER CONTROLS ---
  getUsers: async () => {
    if (isDbLive()) {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase Error: getUsers falling back to mockDb:', err);
      }
    }
    return mockDb.getUsers();
  },

  getCurrentUser: () => {
    // Current guest simulation remains locally managed for convenience
    return mockDb.getCurrentUser();
  },

  isUsernameAvailable: async (username) => {
    // Basic format validation remains active
    const regex = /^[a-z0-9._]+$/;
    if (!regex.test(username)) {
      return { available: false, reason: 'Only lowercase letters, numbers, ".", and "_" allowed.' };
    }
    if (username.includes(' ')) {
      return { available: false, reason: 'Usernames cannot contain spaces.' };
    }

    if (isDbLive()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('username', username.toLowerCase());
        
        if (error) throw error;
        if (data && data.length > 0) {
          return { available: false, reason: 'Username is already taken.' };
        }
        return { available: true };
      } catch (err) {
        console.warn('Supabase Error: isUsernameAvailable falling back to mockDb:', err);
      }
    }
    return mockDb.isUsernameAvailable(username);
  },

  createUser: async (username, displayName, bio = '') => {
    if (isDbLive()) {
      try {
        const availableCheck = await databaseService.isUsernameAvailable(username);
        if (!availableCheck.available) return { success: false, reason: availableCheck.reason };

        const newUser = {
          username: username.toLowerCase(),
          display_name: displayName,
          bio: bio,
          avatar_url: username.substring(0, 1).toUpperCase()
        };

        const { data, error } = await supabase.from('users').insert([newUser]).select();
        if (error) throw error;

        return { success: true, user: data[0] };
      } catch (err) {
        console.warn('Supabase Error: createUser falling back to mockDb:', err);
      }
    }
    return mockDb.createUser(username, displayName, bio);
  },

  // --- CREATOR PROFILE ---
  getCreatorProfile: async (username) => {
    const cleanUsername = username.replace('@', '');
    if (isDbLive()) {
      try {
        // Fetch User Info
        const { data: user, error: uErr } = await supabase
          .from('users')
          .select('*')
          .eq('username', cleanUsername)
          .single();
        if (uErr) throw uErr;

        if (user) {
          // Fetch Followers & Following counts
          const { count: followers } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', user.id);
          const { count: following } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', user.id);

          // Fetch Videos list
          const { data: videos, error: vErr } = await supabase.from('videos').select('*').eq('creator_id', user.id);
          if (vErr) throw vErr;

          // Hydrate video list
          const hydratedVideos = (videos || []).map(v => ({
            id: v.id,
            title: v.title,
            description: v.description,
            creatorId: v.creator_id,
            creator: `@${cleanUsername}`,
            category: v.category,
            url: v.video_url,
            poster: v.poster_url || getCategoryPoster(v.category),
            likesCount: 0,
            viewsCount: 0
          }));

          return {
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            bio: user.bio,
            avatarUrl: user.avatar_url,
            joinedDate: new Date(user.joined_date).toISOString().split('T')[0],
            followersCount: followers || 0,
            followingCount: following || 0,
            totalLikes: 0,
            totalViews: 0,
            videos: hydratedVideos
          };
        }
      } catch (err) {
        console.warn('Supabase Error: getCreatorProfile falling back to mockDb:', err);
      }
    }
    return mockDb.getCreatorProfile(username);
  },

  // --- FOLLOW SYSTEM ---
  isFollowing: async (creatorId) => {
    if (isDbLive()) {
      try {
        const currentUser = mockDb.getCurrentUser();
        const { data, error } = await supabase
          .from('followers')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', creatorId);
        if (error) throw error;
        return data && data.length > 0;
      } catch (err) {
        console.warn('Supabase Error: isFollowing falling back to mockDb:', err);
      }
    }
    return mockDb.isFollowing(creatorId);
  },

  toggleFollow: async (creatorId) => {
    const currentUser = mockDb.getCurrentUser();
    if (currentUser.id === creatorId) return { success: false, reason: 'You cannot follow yourself!' };

    if (isDbLive()) {
      try {
        const following = await databaseService.isFollowing(creatorId);
        if (following) {
          const { error } = await supabase
            .from('followers')
            .delete()
            .eq('follower_id', currentUser.id)
            .eq('following_id', creatorId);
          if (error) throw error;
          return { success: true, following: false };
        } else {
          const { error } = await supabase
            .from('followers')
            .insert([{ follower_id: currentUser.id, following_id: creatorId }]);
          if (error) throw error;

          // Log Notification
          await databaseService.createNotification(creatorId, 'follow', null, null);
          return { success: true, following: true };
        }
      } catch (err) {
        console.warn('Supabase Error: toggleFollow falling back to mockDb:', err);
      }
    }
    return mockDb.toggleFollow(creatorId);
  },

  // --- VIDEOS & LIKES ---
  getVideos: async () => {
    let nativeVids = [];

    if (isDbLive()) {
      try {
        const { data: videos, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        const likes = loadLikesFromDb(); // Fetch likes locally to map isLiked state
        const currentUser = mockDb.getCurrentUser();

        nativeVids = (videos || []).map(v => ({
          id: v.id,
          title: v.title,
          description: v.description,
          creatorId: v.creator_id,
          creator: v.creator || '@creator',
          category: v.category,
          url: v.video_url,
          poster: v.poster_url || getCategoryPoster(v.category),
          likesCount: v.likes_count || 0,
          viewsCount: v.views_count || 0,
          liked: false // Hydrated in component mapping
        }));
      } catch (err) {
        console.warn('Supabase Error: getVideos falling back to mockDb:', err);
        nativeVids = mockDb.getVideos();
      }
    } else {
      nativeVids = mockDb.getVideos();
    }

    // Merge native videos (filtering out reported ones)
    let reported = [];
    try {
      reported = JSON.parse(localStorage.getItem('kidsaura_reported')) || [];
      if (!Array.isArray(reported)) reported = [];
    } catch (e) {
      console.warn("Error parsing reported list:", e);
    }
    const filtered = nativeVids.filter(v => !reported.includes(v.id));
    
    return filtered;
  },
  incrementViewCount: async (videoId) => {
    if (isDbLive()) {
      try {
        // Query to increment view count inside Postgres table
        const { error } = await supabase.rpc('increment_video_views', { vid_id: videoId });
        if (!error) return;
      } catch (err) {
        console.warn('Supabase RPC Error: incrementViewCount falling back to mockDb:', err);
      }
    }
    mockDb.incrementViewCount(videoId);
  },

  publishVideo: async (title, description, category, url, safetyScore) => {
    const currentUser = mockDb.getCurrentUser();
    if (isDbLive()) {
      try {
        const newVideo = {
          title,
          description,
          creator_id: currentUser.id,
          creator: `@${currentUser.username}`,
          category,
          video_url: url,
          safety_score: safetyScore
        };

        const { data, error } = await supabase.from('videos').insert([newVideo]).select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.warn('Supabase Error: publishVideo falling back to mockDb:', err);
      }
    }
    return mockDb.publishVideo(title, description, category, url, safetyScore);
  },

  toggleLike: async (videoId) => {
    const currentUser = mockDb.getCurrentUser();
    if (isDbLive()) {
      try {
        // Check if liked
        const { data: existing, error: eErr } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', currentUser.id)
          .eq('video_id', videoId);
        
        if (eErr) throw eErr;

        if (existing && existing.length > 0) {
          const { error } = await supabase.from('likes').delete().eq('user_id', currentUser.id).eq('video_id', videoId);
          if (error) throw error;
          return { liked: false };
        } else {
          const { error } = await supabase.from('likes').insert([{ user_id: currentUser.id, video_id: videoId }]);
          if (error) throw error;
          
          // Trigger notification
          const { data: vInfo } = await supabase.from('videos').select('creator_id').eq('id', videoId).single();
          if (vInfo && vInfo.creator_id !== currentUser.id) {
            await databaseService.createNotification(vInfo.creator_id, 'like', videoId, null);
          }
          return { liked: true };
        }
      } catch (err) {
        console.warn('Supabase Error: toggleLike falling back to mockDb:', err);
      }
    }
    return mockDb.toggleLike(videoId);
  },

  // --- COMMENTS ---
  getCommentsForVideo: async (videoId) => {
    if (isDbLive()) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('video_id', videoId)
          .eq('is_reported', false);
        if (error) throw error;
        
        return (data || []).map(c => ({
          id: c.id,
          videoId: c.video_id,
          userId: c.user_id,
          username: c.username,
          avatarUrl: c.avatar_url || '?',
          content: c.content,
          parentId: c.parent_id,
          isReported: c.is_reported,
          created_at: c.created_at
        }));
      } catch (err) {
        console.warn('Supabase Error: getCommentsForVideo falling back to mockDb:', err);
      }
    }
    return mockDb.getCommentsForVideo(videoId);
  },

  addComment: async (videoId, content, parentId = null) => {
    if (!content.trim()) return { success: false, reason: 'Comment cannot be empty!' };
    const currentUser = mockDb.getCurrentUser();

    if (isDbLive()) {
      try {
        const newComm = {
          video_id: videoId,
          user_id: currentUser.id,
          username: currentUser.username,
          avatar_url: currentUser.avatarUrl,
          content: content.trim(),
          parent_id: parentId
        };

        const { data, error } = await supabase.from('comments').insert([newComm]).select();
        if (error) throw error;

        // Trigger Notification
        if (parentId) {
          const { data: parentComm } = await supabase.from('comments').select('user_id').eq('id', parentId).single();
          if (parentComm && parentComm.user_id !== currentUser.id) {
            await databaseService.createNotification(parentComm.user_id, 'reply', videoId, data[0].id);
          }
        } else {
          const { data: vInfo } = await supabase.from('videos').select('creator_id').eq('id', videoId).single();
          if (vInfo && vInfo.creator_id !== currentUser.id) {
            await databaseService.createNotification(vInfo.creator_id, 'comment', videoId, data[0].id);
          }
        }

        return { success: true, comment: data[0] };
      } catch (err) {
        console.warn('Supabase Error: addComment falling back to mockDb:', err);
      }
    }
    return mockDb.addComment(videoId, content, parentId);
  },

  deleteComment: async (commentId) => {
    if (isDbLive()) {
      try {
        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.warn('Supabase Error: deleteComment falling back to mockDb:', err);
      }
    }
    return mockDb.deleteComment(commentId);
  },

  reportComment: async (commentId) => {
    if (isDbLive()) {
      try {
        const { error } = await supabase.from('comments').update({ is_reported: true }).eq('id', commentId);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.warn('Supabase Error: reportComment falling back to mockDb:', err);
      }
    }
    return mockDb.reportComment(commentId);
  },

  // --- NOTIFICATIONS ---
  getNotifications: async () => {
    if (isDbLive()) {
      try {
        const currentUser = mockDb.getCurrentUser();
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', currentUser.id)
          .order('created_at', { ascending: false });
        if (error) throw error;

        return (data || []).map(n => ({
          id: n.id,
          recipientId: n.recipient_id,
          senderId: n.sender_id,
          type: n.type,
          videoId: n.video_id,
          commentId: n.comment_id,
          isRead: n.is_read,
          created_at: n.created_at,
          senderName: 'Kids Aura User',
          senderUsername: '@user',
          senderAvatar: 'U',
          videoTitle: 'Video'
        }));
      } catch (err) {
        console.warn('Supabase Error: getNotifications falling back to mockDb:', err);
      }
    }
    return mockDb.getNotifications();
  },

  createNotification: async (recipientId, type, videoId, commentId) => {
    const currentUser = mockDb.getCurrentUser();
    if (isDbLive()) {
      try {
        const newNotif = {
          recipient_id: recipientId,
          sender_id: currentUser.id,
          type,
          video_id: videoId,
          comment_id: commentId
        };
        const { error } = await supabase.from('notifications').insert([newNotif]);
        if (!error) return;
      } catch (err) {
        console.warn('Supabase Error: createNotification falling back to mockDb:', err);
      }
    }
    mockDb.createNotification(recipientId, type, videoId, commentId);
  },

  markNotificationsAsRead: async () => {
    if (isDbLive()) {
      try {
        const currentUser = mockDb.getCurrentUser();
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('recipient_id', currentUser.id);
        if (!error) return;
      } catch (err) {
        console.warn('Supabase Error: markNotificationsAsRead falling back to mockDb:', err);
      }
    }
    mockDb.markNotificationsAsRead();
  },

  // --- PARENT CONTROLS & SECURITY ---
  setParentPin: (pin) => {
    mockDb.setParentPin(pin);
  },

  getParentPin: () => {
    return mockDb.getParentPin();
  },

  // --- TRACK WATCH TIMES ---
  logWatchDuration: async (category, seconds) => {
    if (isDbLive()) {
      try {
        const currentUser = mockDb.getCurrentUser();
        const newLog = {
          user_id: currentUser.id,
          category: category,
          duration: seconds
        };
        const { error } = await supabase.from('views').insert([newLog]);
        if (!error) return;
      } catch (err) {
        console.warn('Supabase Error: logWatchDuration falling back to mockDb:', err);
      }
    }
    mockDb.logWatchDuration(category, seconds);
  },

  getWatchStats: () => {
    return mockDb.getWatchStats();
  },

  resetWatchStats: () => {
    return mockDb.resetWatchStats();
  },

  // --- ANALYTICS ---
  getCreatorAnalytics: async () => {
    if (isDbLive()) {
      try {
        // Analytics calculations from DB statistics
        const currentUser = mockDb.getCurrentUser();
        const { data: vids } = await supabase.from('videos').select('*').eq('creator_id', currentUser.id);
        const totalViews = (vids || []).reduce((sum, v) => sum + (v.views_count || 0), 0);
        const totalLikes = (vids || []).reduce((sum, v) => sum + (v.likes_count || 0), 0);
        
        return {
          totalViews,
          totalLikes,
          commentsReceived: 0,
          followersGained: 0,
          videosCount: (vids || []).length,
          mostViewedVideo: vids && vids.length > 0 ? vids[0].title : 'None',
          recentActivities: [],
          watchTimeMinutes: Math.round((totalViews * 12) / 60)
        };
      } catch (err) {
        console.warn('Supabase Error: getCreatorAnalytics falling back to mockDb:', err);
      }
    }
    return mockDb.getCreatorAnalytics();
  },

  deleteVideo: async (videoId) => {
    if (isDbLive()) {
      try {
        const { error } = await supabase.from('videos').delete().eq('id', videoId);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.warn('Supabase Error: deleteVideo falling back to mockDb:', err);
      }
    }
    return mockDb.deleteVideo(videoId);
  },

  // --- FAVORITES (SAVE) ---
  toggleSave: async (videoId) => {
    try {
      const saved = JSON.parse(localStorage.getItem('kidsaura_saved')) || [];
      const index = saved.indexOf(videoId);
      let isSaved = false;
      if (index > -1) {
        saved.splice(index, 1);
      } else {
        saved.push(videoId);
        isSaved = true;
      }
      localStorage.setItem('kidsaura_saved', JSON.stringify(saved));
      return { success: true, saved: isSaved };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  isSaved: async (videoId) => {
    try {
      const saved = JSON.parse(localStorage.getItem('kidsaura_saved')) || [];
      return saved.includes(videoId);
    } catch (e) {
      return false;
    }
  },

  // --- REPORT VIDEO ---
  reportVideo: async (videoId) => {
    try {
      const reported = JSON.parse(localStorage.getItem('kidsaura_reported')) || [];
      if (!reported.includes(videoId)) {
        reported.push(videoId);
        localStorage.setItem('kidsaura_reported', JSON.stringify(reported));
      }
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },

  getReportedVideos: () => {
    try {
      return JSON.parse(localStorage.getItem('kidsaura_reported')) || [];
    } catch (e) {
      return [];
    }
  },

  // --- WATCH HISTORY ---
  addWatchHistory: (videoId, title) => {
    try {
      const history = JSON.parse(localStorage.getItem('kidsaura_watch_history')) || [];
      const filtered = history.filter(item => item.videoId !== videoId);
      filtered.unshift({
        videoId,
        title,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('kidsaura_watch_history', JSON.stringify(filtered.slice(0, 20)));
    } catch (e) {
      console.error(e);
    }
  },

  getWatchHistory: () => {
    try {
      return JSON.parse(localStorage.getItem('kidsaura_watch_history')) || [];
    } catch (e) {
      return [];
    }
  },

  // --- AGE FILTERS ---
  getAgeFilter: () => {
    return localStorage.getItem('kidsaura_age_filter') || '13+';
  },

  setAgeFilter: (filter) => {
    localStorage.setItem('kidsaura_age_filter', filter);
  },

  getApiError: () => {
    return apiError;
  }
};

// Helper for local mock likes sync
const loadLikesFromDb = () => {
  try {
    return JSON.parse(localStorage.getItem('kidsaura_likes')) || [];
  } catch (e) {
    return [];
  }
};
