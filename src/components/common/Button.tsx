import { forwardRef, ReactNode, MouseEvent, FormEvent } from 'react';

/**
 * Button component (C component in original)
 * Matches the original button implementation exactly.
 */
interface ButtonProps {
  children: ReactNode;
  className?: string;
  appearance?: string;
  secondaryButton?: boolean;
  disabledClass?: boolean;
  disabledAttribute?: boolean;
  disabled?: boolean;
  iconButton?: boolean;
  type?: 'button' | 'submit' | 'reset';
  withLoadingIndicator?: boolean;
  isLoading?: boolean;
  href?: string;
  id?: string;
  title?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: (e: FormEvent<HTMLButtonElement>) => void;
  tabIndex?: number;
  target?: string;
  // Data attributes
  [key: `data-${string}`]: string | undefined;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      appearance,
      disabledClass,
      disabledAttribute,
      disabled,
      iconButton,
      type,
      withLoadingIndicator,
      isLoading,
      secondaryButton,
      href,
      ...rest
    },
    ref
  ) => {
    // Build class name exactly like original
    let classNames = '';
    classNames += appearance ? ' ' + appearance : ' green';
    classNames += secondaryButton ? ' buttonSecondary' : ' buttonFramed';
    classNames += className ? ' ' + className : '';
    classNames += disabledClass ? ' disabled' : '';
    classNames += iconButton ? ' withIcon' : ' withText';

    if (withLoadingIndicator) {
      classNames += ' withLoadingIndicator';
      if (isLoading) {
        classNames += ' loading';
      }
    }

    // Filter allowed props (matching original g array)
    const allowedProps = ['key', 'id', 'title', 'onClick', 'onSubmit', 'tabIndex', 'target', 'disabled'];
    const dataAttrRegex = /^data-/;

    const filteredProps: Record<string, unknown> = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (allowedProps.includes(key) || dataAttrRegex.test(key)) {
        filteredProps[key] = value;
      }
    });

    // Handle href prop - convert to onClick
    if (href) {
      filteredProps.onClick = () => {
        window.location.href = href;
      };
    }

    return (
      <button
        className={classNames.trim()}
        type={type || 'button'}
        ref={ref}
        disabled={disabledAttribute || disabled}
        {...filteredProps}
      >
        {iconButton ? children : <div>{children}</div>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
