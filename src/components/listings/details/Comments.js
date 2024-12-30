import React from 'react';
import { Edit2, Flag } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';

const Comments = ({
  comments,
  onEditComment,
  onSaveComment,
  onReportComment,
  canEditComment,
  newComment,
  setNewComment,
  addComment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze</h2>

      {/* Lista komentarzy */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">{comment.author}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{comment.date}</span>

                {canEditComment(comment.createdAt) && (
                  <ActionButton
                    icon={<Edit2 className="w-4 h-4" />}
                    onClick={() => onEditComment(comment.id)}
                    tooltipText="Edytuj komentarz"
                  />
                )}

                <ActionButton
                  icon={<Flag className="w-4 h-4" />}
                  onClick={() => onReportComment(comment.id)}
                  tooltipText="Zgłoś komentarz"
                  buttonStyle="text-red-500 hover:text-red-600"
                />
              </div>
            </div>

            {comment.isEditing ? (
              <EditingComment
                comment={comment}
                onSave={() => onSaveComment(comment.id, comment.text)}
              />
            ) : (
              <p className="text-gray-600">{comment.text}</p>
            )}
          </div>
        ))}
      </div>

      {/* Formularz dodawania komentarza */}
      <AddCommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        onAddComment={addComment}
      />
    </div>
  );
};

/** Komponent przycisku akcji z tooltipem */
const ActionButton = ({ icon, onClick, tooltipText, buttonStyle = 'text-blue-500 hover:text-blue-600' }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={onClick} className={buttonStyle}>
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/** Komponent formularza dodawania komentarza */
const AddCommentForm = ({ newComment, setNewComment, onAddComment }) => (
  <div>
    <textarea
      className="w-full p-3 border rounded-lg mb-2"
      placeholder="Dodaj komentarz (max 1000 znaków)..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      maxLength={1000}
      rows={3}
    />
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">
        {newComment.length}/1000 znaków
      </span>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        onClick={() => {
          onAddComment(newComment);
          setNewComment('');
        }}
      >
        Dodaj komentarz
      </button>
    </div>
  </div>
);

/** Komponent edycji komentarza */
const EditingComment = ({ comment, onSave }) => (
  <div>
    <textarea
      className="w-full p-2 border rounded-lg mb-2"
      defaultValue={comment.text}
      rows={3}
    />
    <button
      className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm"
      onClick={onSave}
    >
      Zapisz
    </button>
  </div>
);

export default Comments;
