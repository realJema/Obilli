'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Link as LinkIcon
} from 'lucide-react';
import { useI18n } from '@/lib/providers';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingUrl: string;
  listingTitle: string;
}

export function ShareModal({ isOpen, onClose, listingUrl, listingTitle }: ShareModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = async (platform: string) => {
    const shareText = t('sell.checkListing');
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listingUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(listingUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${listingUrl}`)}`, '_blank');
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: listingTitle || t('sell.myListing'),
              text: shareText,
              url: listingUrl,
            });
          } catch (error) {
            console.error('Failed to share:', error);
          }
        } else {
          handleCopyLink();
        }
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-card border border-border rounded-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">{t('sell.shareListing')}</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t('sell.shareSocialMedia')}
          </p>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1 bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground font-mono overflow-hidden">
              {listingUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center px-4 py-2 bg-muted hover:bg-accent border border-border rounded-md text-sm font-medium transition-colors"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? t('sell.copied') : t('sell.copy')}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleShare('facebook')}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/70 rounded-lg transition-colors"
            >
              <Facebook className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Facebook</span>
            </button>
            
            <button
              onClick={() => handleShare('twitter')}
              className="flex flex-col items-center justify-center p-4 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/70 rounded-lg transition-colors"
            >
              <Twitter className="h-6 w-6 text-sky-600 dark:text-sky-400 mb-2" />
              <span className="text-sm font-medium text-sky-900 dark:text-sky-100">Twitter</span>
            </button>
            
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-950/50 dark:hover:bg-green-900/70 rounded-lg transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">{t('sell.shareToWhatsApp')}</span>
            </button>
            
            <button
              onClick={() => handleShare('native')}
              className="flex flex-col items-center justify-center p-4 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 rounded-lg transition-colors"
            >
              <LinkIcon className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium text-primary">More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}