import { useEffect, useRef, ReactNode } from 'react';
import { Button } from '../common';

interface ModalProps {
  id: string;
  className?: string;
  closeButton?: boolean;
  onClose: () => void;
  children: ReactNode;
  dataStep?: string;
}

/**
 * Add noOverflow class to body (w function in original)
 */
const addNoOverflow = () => {
  document?.getElementsByTagName('body')[0]?.classList.add('noOverflow');
};

/**
 * Remove noOverflow class from body (y function in original)
 */
const removeNoOverflow = () => {
  document?.getElementsByTagName('body')[0]?.classList.remove('noOverflow');
};

/**
 * Base Modal component (S component in original)
 * Renders an overlay with a modal dialog.
 * Structure: div#overlay > div#[id].modal
 */
const Modal = ({
  id,
  className,
  closeButton,
  onClose,
  children,
  dataStep,
}: ModalProps) => {
  const targetRef = useRef<EventTarget | null>(null);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (onClose && e.code === 'Escape') {
        onClose();
      }
    };

    // Add noOverflow to body when modal opens
    addNoOverflow();
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      // Remove noOverflow from body when modal closes
      removeNoOverflow();
    };
  }, [onClose]);

  const handleMouseEvent = (e: React.MouseEvent) => {
    if (e.type === 'mousedown') {
      targetRef.current = e.target;
    } else if (e.type === 'mouseup' && targetRef.current !== null) {
      if (onClose && (targetRef.current as HTMLElement).id === 'overlay') {
        onClose();
      }
      targetRef.current = null;
    }
  };

  return (
    <div
      id="overlay"
      role="presentation"
      onMouseDown={handleMouseEvent}
      onMouseUp={handleMouseEvent}
    >
      <div id={id} className={`modal ${className || ''}`} data-step={dataStep}>
        {closeButton && onClose && (
          <Button
            className="closeButton"
            iconButton
            onClick={onClose}
          >
            <CloseIcon outline />
          </Button>
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * Close icon (N component in original)
 * SVG with outline and icon groups
 */
interface CloseIconProps {
  outline?: boolean;
}

const CloseIcon = ({ outline }: CloseIconProps) => (
  <svg viewBox="0 0 20 20">
    {outline ? (
      <>
        <g className="outline">
          <path d="M0 17.01L7.01 10 .14 3.13 3.13.14 10 7.01 17.01 0 20 2.99 12.99 10l6.87 6.87-2.99 2.99L10 12.99 2.99 20 0 17.01z" />
        </g>
        <g className="icon">
          <path d="M0 17.01L7.01 10 .14 3.13 3.13.14 10 7.01 17.01 0 20 2.99 12.99 10l6.87 6.87-2.99 2.99L10 12.99 2.99 20 0 17.01z" />
        </g>
      </>
    ) : (
      <path d="M0 17.01L7.01 10 .14 3.13 3.13.14 10 7.01 17.01 0 20 2.99 12.99 10l6.87 6.87-2.99 2.99L10 12.99 2.99 20 0 17.01z" />
    )}
  </svg>
);

export default Modal;
