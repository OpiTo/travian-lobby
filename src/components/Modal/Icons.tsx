interface IconProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  outline?: boolean;
}

/**
 * Valid/Checkmark icon (B component in original)
 * viewBox: 0 0 20 20
 */
export const ValidIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20">
    <path d="M14.59 5.58L8 12.17 4.41 8.59 3 10l5 5 8-8zM10 0a10 10 0 1010 10A10 10 0 0010 0zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
  </svg>
);

/**
 * Invalid/Warning icon (V component in original)
 * viewBox: 0 0 22 19
 */
export const InvalidIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 22 19">
    <path d="M11 4l7.5 13h-15L11 4m0-4L0 19h22L11 0z" />
    <path d="M12 14h-2v2h2zM12 8h-2v5h2z" />
  </svg>
);

/**
 * Info icon (L component in original)
 * viewBox: 0 0 20 20
 */
export const InfoIcon = ({ className, outline }: IconProps) => {
  const path = (
    <path d="M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71S10.28 5 10 5s-.52.1-.71.29S9 5.72 9 6s.1.52.29.71c.19.19.43.29.71.29Zm0 13c-1.38 0-2.68-.26-3.9-.79-1.22-.52-2.28-1.24-3.18-2.14-.9-.9-1.61-1.96-2.14-3.18-.52-1.22-.79-2.52-.79-3.9s.26-2.68.79-3.9c.53-1.22 1.24-2.28 2.14-3.18.9-.9 1.96-1.61 3.18-2.14C7.32.25 8.62-.02 10-.02s2.68.26 3.9.79c1.22.53 2.27 1.24 3.18 2.14.9.9 1.61 1.96 2.14 3.18.52 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9-1.24 2.27-2.14 3.18c-.9.9-1.96 1.61-3.18 2.14S11.38 20 10 20Zm0-2c2.23 0 4.12-.77 5.67-2.33C17.22 14.12 18 12.23 18 10s-.77-4.12-2.33-5.68C14.12 2.77 12.23 2 10 2s-4.12.78-5.68 2.32C2.77 5.87 2 7.76 2 10s.78 4.12 2.32 5.67C5.87 17.22 7.76 18 10 18Z" />
  );

  return (
    <svg className={className} viewBox="0 0 20 20">
      {outline ? (
        <>
          <g className="outline">{path}</g>
          <g className="icon">{path}</g>
        </>
      ) : (
        path
      )}
    </svg>
  );
};

/**
 * Visibility/Eye icon (Re component in original)
 * viewBox: 0 0 16.5 11.3
 */
export const VisibilityIcon = ({ className, onClick }: IconProps) => (
  <svg className={className} viewBox="0 0 16.5 11.3" onClick={onClick}>
    <path d="M8.2 9c.9 0 1.7-.3 2.4-1s1-1.5 1-2.4c0-.9-.3-1.7-1-2.4s-1.5-1-2.4-1c-.9 0-1.7.3-2.4 1s-1 1.5-1 2.4c0 .9.3 1.7 1 2.4s1.5 1 2.4 1zm0-1.3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.5s.2-1 .6-1.4c.4-.4.9-.6 1.4-.6.6 0 1 .2 1.4.6.4.4.6.9.6 1.4s-.2 1-.6 1.4c-.3.5-.8.7-1.4.7zm0 3.6c-1.8 0-3.5-.5-5-1.5C1.8 8.7.7 7.3 0 5.6c.7-1.7 1.8-3.1 3.3-4.1C4.8.5 6.5 0 8.3 0c1.8 0 3.5.5 5 1.5s2.6 2.4 3.3 4.1c-.7 1.7-1.8 3.1-3.3 4.1-1.5 1-3.3 1.6-5.1 1.6zm0-1.5c1.4 0 2.7-.4 3.9-1.1 1.2-.7 2.1-1.8 2.7-3-.6-1.2-1.5-2.3-2.7-3-1.1-.8-2.5-1.2-3.9-1.2s-2.7.4-3.9 1.1c-1.2.7-2.1 1.8-2.7 3 .6 1.2 1.5 2.3 2.7 3 1.2.8 2.6 1.2 3.9 1.2z" />
  </svg>
);

/**
 * Checkbox icon (xe component in original)
 * viewBox: 0 0 18 18
 */
export const CheckboxIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 18 18">
    <path
      className="box"
      d="M16 0H2a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V2a2 2 0 00-2-2z"
    />
    <rect className="indeterminate" width="10" height="2" x="4" y="8" />
    <path className="checkmark" d="M15.28 4.28l-8.27 8.27-4.3-4.26h0" />
  </svg>
);

/**
 * Arrow Circle Forward icon (me component in original)
 * viewBox: 0 0 24 24
 */
export const ArrowCircleForwardIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 21c-1.25 0-2.42-.24-3.51-.71s-2.04-1.12-2.85-1.93a9.259 9.259 0 0 1-1.93-2.85C3.23 14.42 3 13.25 3 12s.24-2.42.71-3.51 1.12-2.04 1.93-2.85c.81-.81 1.76-1.45 2.85-1.93S10.75 3 12 3h.15L10.6 1.45 12 0l4 4-4 4-1.4-1.45L12.15 5H12c-1.95 0-3.6.68-4.96 2.04C5.68 8.4 5 10.05 5 12s.68 3.6 2.04 4.96C8.4 18.32 10.05 19 12 19s3.6-.68 4.96-2.04C18.32 15.6 19 13.95 19 12h2c0 1.25-.24 2.42-.71 3.51-.48 1.09-1.12 2.04-1.93 2.85s-1.76 1.45-2.85 1.93S13.25 21 12 21Z" />
  </svg>
);

/**
 * Success/Check Circle icon (Ae component in original)
 * viewBox: 0 0 20 20
 */
export const SuccessIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20">
    <path d="m8.6 14.6 7.1-7.1-1.4-1.4-5.6 5.7-2.9-2.9-1.4 1.4 4.2 4.3zM10 20c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
  </svg>
);

/**
 * Error/X Circle icon (Me component in original)
 * viewBox: 0 0 20 20
 */
export const ErrorIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20">
    <path d="m6.4 15 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L15 6.4 13.6 5 10 8.6 6.4 5 5 6.4 8.6 10 5 13.6 6.4 15zm3.6 5c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
  </svg>
);

/**
 * Plus icon (Ge component in original)
 * viewBox: 0 0 14 14
 */
export const PlusIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 14 14">
    <path d="M6 8H0V6h6V0h2v6h6v2H8v6H6V8z" />
  </svg>
);

/**
 * Minus icon (Ie component in original)
 * viewBox: 0 0 14 2
 */
export const MinusIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 14 2">
    <path d="M0 2V0h14v2H0z" />
  </svg>
);

/**
 * Dice/Shuffle icon (Fe component in original)
 * viewBox: 0 0 20 19
 */
export const ShuffleIcon = ({ className, outline }: IconProps) => {
  const path = (
    <path d="M11.83 8.35A2.23 2.23 0 0 0 10.05 7l-4.6-.6a2.24 2.24 0 0 0-2 .8L.51 10.74A2.2 2.2 0 0 0 .16 13l1.59 4a2.25 2.25 0 0 0 1.79 1.39l4.59.61a2.24 2.24 0 0 0 2-.79l2.94-3.58a2.23 2.23 0 0 0 .35-2.23ZM5 8.67c.6-.28 1.22-.23 1.37.1s-.21.83-.82 1.11-1.21.23-1.36-.11S4.4 9 5 8.67Zm-3.37 5.21c-.31-.52-.3-1.1 0-1.28s.82.09 1.13.62.29 1.11 0 1.29-.82-.1-1.13-.63ZM4 17.54c-.32.18-.82-.1-1.13-.63s-.29-1.1 0-1.29.82.1 1.12.63.3 1.1 0 1.29Zm1-3.15c-.31-.53-.3-1.11 0-1.29s.82.1 1.12.63.3 1.1 0 1.28-.82-.09-1.12-.62Zm2.32 3.48c-.31.18-.82-.09-1.12-.62s-.3-1.11 0-1.29.82.09 1.13.62.29 1.11 0 1.29Zm1.75.59a.45.45 0 0 1-.58-.25l-2.1-5.3a.47.47 0 0 1-.17 0l-5.36-.7a.44.44 0 0 1-.39-.48.44.44 0 0 1 .45-.39H1l5.36.66.15.06 3.55-4.33a.44.44 0 0 1 .62-.06.43.43 0 0 1 .06.62l-3.5 4.31 2.09 5.29a.43.43 0 0 1-.24.57Zm1.29-1.91c-.36.07-.74-.41-.86-1.06s.08-1.23.44-1.3.75.42.87 1.07-.08 1.22-.44 1.29Zm.69-5.19c-.36.07-.75-.41-.86-1.06s.08-1.23.44-1.3.75.41.86 1.07-.08 1.22-.44 1.29Zm8.45-6.95L16.57.82a2.19 2.19 0 0 0-2-.8L10 .59A2.28 2.28 0 0 0 8.18 2L6.82 5.38l4 .52h.06A2.21 2.21 0 0 1 12.47 7l.3-.74a.47.47 0 0 1-.13-.11L9.22 1.93a.44.44 0 0 1 .64-.6l3.42 4.19a.55.55 0 0 1 .08.15L19 5a.44.44 0 0 1 .11.87l-5.51.7-.6 1.55 1.27 3.2a2.34 2.34 0 0 1 .15 1l2.02-.32a2.23 2.23 0 0 0 1.79-1.38l1.61-4a2.22 2.22 0 0 0-.34-2.21ZM9.3 3c.36.09.54.64.39 1.23s-.55 1-.9.92-.53-.63-.39-1.23.6-1.01.9-.92Zm3.91-.89c-.12.35-.72.45-1.34.24s-1-.67-.92-1 .72-.46 1.34-.24 1 .66.92 1Zm4.94 2.24c-.12.35-.72.46-1.34.24s-1-.66-.92-1 .72-.45 1.34-.24 1 .67.92 1Zm-2 4.8c-.42.51-1 .72-1.27.49s-.17-.84.26-1.35 1-.72 1.28-.49.16.84-.27 1.35Z" />
  );

  return (
    <svg className={className} viewBox="0 0 20 19">
      {outline ? (
        <>
          <g className="outline">{path}</g>
          <g className="icon">{path}</g>
        </>
      ) : (
        path
      )}
    </svg>
  );
};

/**
 * Chevron/Arrow Down icon (Pe/La component in original)
 * viewBox: 0 0 12 7.41
 */
export const ChevronDownIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 12 7.41">
    <path d="M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6z" />
  </svg>
);

/**
 * Arrow Back icon (ot component in original)
 * viewBox: 0 0 20 36
 */
export const ArrowBackIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 36">
    <path d="M20 36 2 18 20 0v36ZM4.95 18l12.97 12.97V5.03L4.95 18Z" />
    <path d="m6 24-6-6 6-6 .41.41L.83 18l5.58 5.59L6 24z" />
  </svg>
);

/**
 * Play icon (ut component in original)
 * viewBox: 0 0 14 18
 */
export const PlayIcon = ({ className, outline }: IconProps) => {
  const path = (
    <path d="M1.134 1.456.75 1.212v16.183l.384-.244 12-7.637.332-.21-.332-.212-12-7.636Z" />
  );

  return (
    <svg className={className} viewBox="0 0 14 18">
      {outline ? (
        <>
          <g className="outline">{path}</g>
          <g className="icon">{path}</g>
        </>
      ) : (
        path
      )}
    </svg>
  );
};

/**
 * Radio button icon (ta component in original)
 * viewBox: 0 0 20 20
 */
export const RadioIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20">
    <path d="M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Z" />
    <circle cx="10" cy="10" r="5" />
  </svg>
);

/**
 * Gold Coin icon (ga component in original)
 * viewBox: 0 0 50 50
 */
export const GoldCoinIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="25" fill="#522d1c" />
    <path
      fill="#e9bf60"
      d="M48 25c0 .59 0 1.17-.1 1.76-.2 2.45-.78 4.8-1.66 7.05-1.08 2.74-2.74 5.19-4.7 7.24-.39.39-.78.78-1.27 1.17-.98.88-2.06 1.66-3.13 2.35C33.62 46.72 29.51 48 25 48s-8.61-1.27-12.14-3.43c-1.08-.69-2.15-1.47-3.13-2.35-.39-.39-.88-.78-1.27-1.17-1.96-2.06-3.62-4.5-4.7-7.24-.88-2.15-1.47-4.6-1.66-7.05C2 26.17 2 25.59 2 25c0-.98.1-1.86.2-2.74C3.57 10.81 13.26 2 25 2s21.43 8.81 22.8 20.26c.1.88.2 1.76.2 2.74Z"
    />
    <path fill="#be8b34" d="M2.59 30C8 53.76 41.81 54.3 47.39 30H2.59Z" />
    <circle cx="25" cy="25" r="17" fill="#f9fbfc" />
    <path
      fill="#824d26"
      d="M9.2 27.43c-.04-.31-.08-.63-.11-.95-.05-.48-.09-.97-.1-1.49.38-21.33 31.62-21.33 32 0 0 .51-.05 1-.1 1.49-.03.32-.07.63-.11.94l.45 2.57c.49-1.58.75-3.26.75-5 0-9.39-7.61-17-17-17S8 15.61 8 25c0 1.74.26 3.42.75 5l.46-2.56Z"
    />
    <path
      fill="#b4772a"
      d="M41 25C40.62 3.67 9.38 3.67 9 25c.38 21.33 31.62 21.33 32 0Z"
    />
    <path
      fill="#522d1c"
      d="m32.36 19.12 2.6 3.97 1.74-2.73-1.21-7.01h-3.18l-.4.6H18.08l-.4-.6H14.5l-1.22 7.08 2.04 2.49 2.55-3.77h3.77v13.57c-.06.74-2.18 1.16-3.1 1.22v2.72l1 1v.46h11v-.36l1-1.14v-2.75c-.91.01-3.17-.72-3.1-1.23V19.11h3.91Z"
    />
    <path
      fill="#f7ce7c"
      d="m34.95 21.25.7-1.1-1-5.8h-1.8l-.4.6h-14.9l-.4-.6h-1.8l-1 5.8.9 1.1 2.1-3.1h5.3v14.6c0 1.7-3.1 2.1-3.1 2.1v1.4l.8.8h9.5l.7-.8v-1.5s-3.1-.4-3.1-2.1v-14.6h5.4l2.1 3.2Z"
    />
    <path
      fill="#eff8f9"
      d="m14.45 20.25-.1-.1 1-5.8h1.8l.4.6h14.9l.4-.6h1.8l1 5.8-.1.1-.9-5.3h-1.8l-.4.6h-14.9l-.4-.6h-1.8l-.9 5.3Zm5.1 15.17c.2.1 3.7-.8 3.1-2.7 0 1.7-3.1 2.1-3.1 2.1v.6Zm7.9-2.76c-.6 2 2.8 2.8 3.1 2.7v-.6s-3.1-.5-3.1-2.1Z"
    />
  </svg>
);

/**
 * Clipboard icon (ia component in original)
 * viewBox: 0 0 18 22
 */
export const ClipboardIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 18 22">
    <path d="M16 2h-4.2C11.4.8 10.3 0 9 0S6.6.8 6.2 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 2c.6 0 1 .5 1 1s-.4 1-1 1-1-.5-1-1 .4-1 1-1zm7 18H2V4h2v3h10V4h2v16z" />
  </svg>
);

/**
 * Close/X icon (N component in original)
 * viewBox: 0 0 20 20
 */
export const CloseIcon = ({ className, outline }: IconProps) => {
  const path = (
    <path d="M0 17.01L7.01 10 .14 3.13 3.13.14 10 7.01 17.01 0 20 2.99 12.99 10l6.87 6.87-2.99 2.99L10 12.99 2.99 20 0 17.01z" />
  );

  return (
    <svg className={className} viewBox="0 0 20 20">
      {outline ? (
        <>
          <g className="outline">{path}</g>
          <g className="icon">{path}</g>
        </>
      ) : (
        path
      )}
    </svg>
  );
};

/**
 * Flag component (E component in original)
 */
interface FlagProps {
  name: string;
  title?: string;
}

export const Flag = ({ name, title }: FlagProps) => (
  <i className={`flag ${name}`} title={title} />
);
