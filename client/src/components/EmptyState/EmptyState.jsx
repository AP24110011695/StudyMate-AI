import React from 'react';
import { FileQuestion, MessagesSquare, NotebookPen, Brain, Layers3, FolderOpen } from 'lucide-react';
import './EmptyState.css';

const icons = {
  pdf: FolderOpen,
  chat: MessagesSquare,
  notes: NotebookPen,
  quiz: Brain,
  flashcards: Layers3,
  default: FileQuestion
};

export default function EmptyState({ icon = 'default', title, description, actionText, onAction }) {
  const IconComponent = icons[icon] || icons.default;

  return (
    <div className="empty-state-container page-enter">
      <div className="empty-state-icon-wrapper">
        <IconComponent size={48} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionText && onAction && (
        <button className="btn btn-primary empty-state-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
