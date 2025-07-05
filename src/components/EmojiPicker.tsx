
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

const emojis = [
  '😊', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '🔥', '⭐', '✨', '🎯', '🚀', '💡', '🎉', '🎊', '🏆', '👍',
  '💪', '🎨', '📚', '💻', '📱', '⏰', '📅', '✅', '🎵', '🎮'
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, selectedEmoji }) => {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-10 h-10 p-0">
          {selectedEmoji || <Smile className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
