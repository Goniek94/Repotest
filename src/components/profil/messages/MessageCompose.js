import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPaperPlane, FaSave } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { FaTimes } from 'react-icons/fa';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import FormGroup from '../../common/FormGroup';

/**
 * Komponent do tworzenia nowej wiadomości
 * @param {Object} props - Właściwości komponentu
 * @param {boolean} props.isOpen - Czy modal jest otwarty
 * @param {Function} props.onClose - Funkcja wywoływana przy zamykaniu modalu
 * @param {Function} props.onSend - Funkcja wywoływana przy wysyłaniu wiadomości
 * @param {Function} props.onSaveDraft - Funkcja wywoływana przy zapisywaniu szkicu
 * @param {boolean} props.isSending - Czy trwa wysyłanie wiadomości
 * @param {boolean} props.isSaving - Czy trwa zapisywanie szkicu
 * @param {Object} props.initialValues - Początkowe wartości formularza
 * @returns {JSX.Element} - Komponent modalu nowej wiadomości
 */
const MessageCompose = ({
  isOpen,
  onClose,
  onSend,
  onSaveDraft,
  isSending = false,
  isSaving = false,
  initialValues = {}
}) => {
  const [message, setMessage] = useState({
    to: initialValues.to || '',
    subject: initialValues.subject || '',
    content: initialValues.content || '',
    draftId: initialValues.draftId || null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(message);
  };

  const handleSaveDraft = () => {
    onSaveDraft(message);
  };

  const handleClose = () => {
    setMessage({
      to: '',
      subject: '',
      content: '',
      draftId: null
    });
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleSaveDraft}
        disabled={isSaving || !message.content.trim()}
        icon={FaSave}
      >
        {isSaving ? 'Zapisywanie...' : 'Zapisz szkic'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
      >
        Anuluj
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isSending || !message.to || !message.subject || !message.content.trim()}
        icon={FaPaperPlane}
      >
        {isSending ? 'Wysyłanie...' : 'Wyślij'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nowa wiadomość"
      footer={footer}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGroup
          label="Do:"
          htmlFor="to"
        >
          <input
            type="email"
            id="to"
            name="to"
            value={message.to}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </FormGroup>

        <FormGroup
          label="Temat:"
          htmlFor="subject"
        >
          <input
            type="text"
            id="subject"
            name="subject"
            value={message.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </FormGroup>

        <FormGroup
          label="Treść:"
          htmlFor="content"
        >
          <textarea
            id="content"
            name="content"
            value={message.content}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </FormGroup>
      </form>
    </Modal>
  );
};

MessageCompose.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onSaveDraft: PropTypes.func.isRequired,
  isSending: PropTypes.bool,
  isSaving: PropTypes.bool,
  initialValues: PropTypes.object
};

export default MessageCompose;
