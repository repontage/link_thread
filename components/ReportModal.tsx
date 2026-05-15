'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  commentId: string;
  commentContent: string;
  onClose: () => void;
  onSubmit: (_reason: string) => Promise<void>;
}

export default function ReportModal({ commentId: _commentId, commentContent, onClose, onSubmit }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(reason);
      onClose();
    } catch (error) {
      console.error('Report submission failed', error);
      alert('신고 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-bold">Report Comment</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">Target Comment</p>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 line-clamp-3 italic">
              "{commentContent}"
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Please enter the reason for reporting
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., spam, abuse, inappropriate content, privacy violation, etc."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[100px] transition-all"
              required
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="flex-1 py-2.5 px-4 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200 transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
