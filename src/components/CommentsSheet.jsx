import React, { useState, useEffect } from 'react';
import { X, Send, Trash2, Flag, CornerDownRight, MessageCircle } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function CommentsSheet({ videoId, onClose, commentsCount, onCommentChange, onRequestAuth }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null); // { id, username }
  const currentUser = databaseService.getCurrentUser();

  // Load comments from databaseService
  const loadComments = async () => {
    const list = await databaseService.getCommentsForVideo(videoId);
    setComments(list);
  };

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (onRequestAuth && !onRequestAuth('Comment')) return;

    const res = await databaseService.addComment(videoId, newCommentText, replyTo ? replyTo.id : null);
    if (res.success) {
      setNewCommentText('');
      setReplyTo(null);
      await loadComments();
      if (onCommentChange) onCommentChange();
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this comment?');
    if (confirm) {
      const res = await databaseService.deleteComment(id);
      if (res.success) {
        await loadComments();
        if (onCommentChange) onCommentChange();
      }
    }
  };

  const handleReport = async (id) => {
    const confirm = window.confirm('Report this comment as inappropriate for kids?');
    if (confirm) {
      await databaseService.reportComment(id);
      await loadComments();
      alert('Thank you. The comment has been flagged and removed for moderation.');
      if (onCommentChange) onCommentChange();
    }
  };

  // Group comments into parents and children replies
  const parentComments = comments.filter(c => !c.parentId);
  const getRepliesFor = (id) => comments.filter(c => c.parentId === id);

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '60%',
      background: '#151522',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      zIndex: 100,
      boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      borderTop: '2px solid rgba(255,255,255,0.06)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageCircle size={20} className="status-checking" style={{ color: 'var(--primary-teal)' }} />
          <span style={{ fontFamily: 'var(--font-kids)', fontSize: '16px', fontWeight: 'bold' }}>
            Comments ({comments.length})
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a0a0b0', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {parentComments.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px 0', fontSize: '13px' }}>
            No comments yet. Write a friendly comment below! 🎈
          </div>
        ) : (
          parentComments.map((comment) => {
            const replies = getRepliesFor(comment.id);
            return (
              <div key={comment.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Parent comment card */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--primary-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '13px'
                  }}>
                    {comment.avatarUrl}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: '#ffe66d' }}>@{comment.username}</span>
                      <span style={{ fontSize: '11px', color: '#555' }}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#eee', lineHeight: '1.4' }}>{comment.content}</p>
                    
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
                      <button 
                        onClick={() => setReplyTo({ id: comment.id, username: comment.username })}
                        style={{ background: 'none', border: 'none', color: '#7f8c8d', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Reply
                      </button>
                      
                      {comment.userId === currentUser.id ? (
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          style={{ background: 'none', border: 'none', color: '#ff7675', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <Trash2 size={10} /> Delete
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleReport(comment.id)}
                          style={{ background: 'none', border: 'none', color: '#a0a0b0', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <Flag size={10} /> Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Threaded Replies list */}
                {replies.map((reply) => (
                  <div key={reply.id} style={{ display: 'flex', gap: '12px', paddingLeft: '28px' }}>
                    <CornerDownRight size={16} style={{ color: '#555', marginTop: '6px' }} />
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--primary-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '11px'
                    }}>
                      {reply.avatarUrl}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', fontSize: '12px', color: '#4ecdc4' }}>@{reply.username}</span>
                        <span style={{ fontSize: '10px', color: '#555' }}>
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#eee', lineHeight: '1.4' }}>{reply.content}</p>
                      
                      {/* Delete / Report for reply */}
                      <div>
                        {reply.userId === currentUser.id ? (
                          <button 
                            onClick={() => handleDelete(reply.id)}
                            style={{ background: 'none', border: 'none', color: '#ff7675', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', padding: 0 }}
                          >
                            <Trash2 size={9} /> Delete
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleReport(reply.id)}
                            style={{ background: 'none', border: 'none', color: '#a0a0b0', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', padding: 0 }}
                          >
                            <Flag size={9} /> Report
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Reply State bar */}
      {replyTo && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          borderTop: '1px solid rgba(255,255,255,0.03)'
        }}>
          <span style={{ color: 'var(--primary-teal)' }}>
            Replying to <strong>@{replyTo.username}</strong>
          </span>
          <button 
            onClick={() => setReplyTo(null)}
            style={{ background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', fontSize: '11px' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmitComment} style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: '#12121c',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <input 
          type="text" 
          placeholder={replyTo ? `Write a reply...` : "Add a friendly comment..."}
          className="input-styled"
          style={{ margin: 0, padding: '10px 14px' }}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          maxLength={150}
        />
        <button 
          type="submit" 
          disabled={!newCommentText.trim()}
          style={{
            background: 'var(--primary-teal)',
            border: 'none',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: newCommentText.trim() ? 'pointer' : 'default',
            opacity: newCommentText.trim() ? 1 : 0.5
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
