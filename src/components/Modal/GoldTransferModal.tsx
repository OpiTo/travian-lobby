import { useState, useEffect, useRef, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from './Modal';
import { useI18n } from '../../localization/i18n';
import { ValidIcon, InvalidIcon } from './Icons';
import {
  gtlVerifyOwnership,
  gtlFindTargets,
  gtlTransfer,
  getMetadata,
  getGameworldInfo,
  GtlFindTargetsResponse,
} from '../../services/lobby';

// Notice component types
type NoticeType = 'success' | 'info' | 'error';

interface NoticeProps {
  type: NoticeType;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const Notice = ({ type, icon, className, children }: NoticeProps) => (
  <div className={['notice', type, className].filter(Boolean).join(' ')}>
    {icon}
    <div className="message">{children}</div>
  </div>
);

// Icons
const SuccessIcon = <ValidIcon className="success" />;
const ErrorIcon = <InvalidIcon className="error" />;
const InfoIcon = (
  <svg className="info" viewBox="0 0 20 20">
    <path d="M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71S10.28 5 10 5s-.52.1-.71.29S9 5.72 9 6s.1.52.29.71c.19.19.43.29.71.29Zm0 13c-1.38 0-2.68-.26-3.9-.79-1.22-.52-2.28-1.24-3.18-2.14-.9-.9-1.61-1.96-2.14-3.18-.52-1.22-.79-2.52-.79-3.9s.26-2.68.79-3.9c.53-1.22 1.24-2.28 2.14-3.18.9-.9 1.96-1.61 3.18-2.14C7.32.25 8.62-.02 10-.02s2.68.26 3.9.79c1.22.53 2.27 1.24 3.18 2.14.9.9 1.61 1.96 2.14 3.18.52 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9-1.24 2.27-2.14 3.18c-.9.9-1.96 1.61-3.18 2.14S11.38 20 10 20Zm0-2c2.23 0 4.12-.77 5.67-2.33C17.22 14.12 18 12.23 18 10s-.77-4.12-2.33-5.68C14.12 2.77 12.23 2 10 2s-4.12.78-5.68 2.32C2.77 5.87 2 7.76 2 10s.78 4.12 2.32 5.67C5.87 17.22 7.76 18 10 18Z" />
  </svg>
);
const ClipboardIcon = (
  <svg className="clipboard" viewBox="0 0 18 22">
    <path d="M16 2h-4.2C11.4.8 10.3 0 9 0S6.6.8 6.2 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 2c.6 0 1 .5 1 1s-.4 1-1 1-1-.5-1-1 .4-1 1-1zm7 18H2V4h2v3h10V4h2v16z" />
  </svg>
);

// Gold coin icon
const GoldCoinIcon = ({ className }: { className?: string }) => (
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
    <path fill="#b4772a" d="M41 25C40.62 3.67 9.38 3.67 9 25c.38 21.33 31.62 21.33 32 0Z" />
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

// Button component matching original C component
interface ButtonProps {
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  withLoadingIndicator?: boolean;
  isLoading?: boolean;
  title?: string;
  children: React.ReactNode;
}

const Button = ({
  type = 'button',
  onClick,
  disabled,
  withLoadingIndicator,
  isLoading,
  title,
  children,
}: ButtonProps) => {
  const classNames = [
    'green',
    'buttonFramed',
    'withText',
    withLoadingIndicator && 'withLoadingIndicator',
    isLoading && 'loading',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <div>{children}</div>
    </button>
  );
};


// Gameworld interface
interface Gameworld {
  uuid: string;
  name: string;
  subtitle?: string;
  speed?: number;
  region?: string;
  url?: string;
  mainpageGroups?: string[];
  targetAvatarId?: string;
}

interface GameworldInfoData {
  ageInDays?: number;
  tribes?: Array<{ id: string }>;
}

// Get gold transfer rules URL
const getGtlRulesUrl = (language: string) =>
  `https://support.travian.com/${language.split('-')[0]}/support/solutions/articles/7000060364-gold-transfer`;

// Tribe ID to class name mapping
const tribeClassMap: Record<string, string> = {
  '1': 'roman',
  '2': 'teuton',
  '3': 'gaul',
  '4': 'nature',
  '5': 'natar',
  '6': 'egyptian',
  '7': 'hun',
  '8': 'spartan',
};

// Hidden tribes (nature, natar)
const hiddenTribes = ['4', '5'];

// Step 1: Verify Ownership
interface VerifyOwnershipStepProps {
  code: string;
  onSuccess: (email: string, amount: number) => void;
}

const VerifyOwnershipStep = ({ code, onSuccess }: VerifyOwnershipStepProps) => {
  const { translate } = useI18n();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    if (!email || isLoading) return;

    setIsLoading(true);
    try {
      const result = await gtlVerifyOwnership(code, email);
      onSuccess(email, result.amount);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(translate(error.body?.message || 'Unexpected Error'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(undefined);

  return (
    <form onSubmit={handleSubmit}>
      <div className="transferInfo">
        <strong>{translate('Please verify your code')}</strong>
        <br />
        {translate(
          'To transfer your unspent bought gold to an existing avatar, please first verify your ownership of the gold, by entering the relevant email address.'
        )}
      </div>
      <label className={`text ${error ? 'withCustomValidationRenderElement' : ''}`}>
        <input
          type="text"
          name="email"
          ref={emailRef}
          placeholder={translate('Email Address')}
          onFocus={clearError}
          onChange={clearError}
          defaultValue={searchParams.get('email') || undefined}
        />
        <div className="label">{translate('Email Address')}:</div>
        <ValidIcon className="valid" />
        <InvalidIcon className="invalid" />
        <div className="validation" data-rule="NOT_EMPTY">
          {translate('Please enter your email address in format yourname@mail.com')}
        </div>
        <div className="validation" data-rule="AT_LEAST" data-parameter="5">
          {translate(
            'We are sorry but this email seems to be too short. It should contain at least {min} characters.',
            { min: '5' }
          )}
        </div>
        <div className="validation" data-rule="SHORTER_THAN" data-parameter="200">
          {translate(
            'We are sorry but this email seems to be too long. It should contain at most {max} characters.',
            { max: '200' }
          )}
        </div>
        {error && (
          <div className="validation custom" data-rule="NO_CUSTOM_ERROR">
            {error}
          </div>
        )}
      </label>
      <div className="actions">
        <Button
          type="submit"
          disabled={isLoading}
          withLoadingIndicator
          isLoading={isLoading}
        >
          {translate('Verify Ownership')}
        </Button>
      </div>
    </form>
  );
};


// Step 2: Search Avatar
interface SearchAvatarStepProps {
  code: string;
  email: string;
  amount: number;
  onSuccess: (name: string, targets: GtlFindTargetsResponse & { transferTargets: Record<string, string> }) => void;
}

const SearchAvatarStep = ({ code, email, amount, onSuccess }: SearchAvatarStepProps) => {
  const { translate, locale } = useI18n();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [infoMessage, setInfoMessage] = useState<React.ReactNode>();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    if (!name || isLoading) return;

    setIsLoading(true);
    setError(undefined);
    setInfoMessage(undefined);

    try {
      const result = await gtlFindTargets(code, email, name);
      if (result.targets.length === 0) {
        throw { body: 'noAvatarWithThisName' };
      }

      // Filter transfer targets - in original this filters by game world rules
      const transferTargets = result.transferTargets || {};

      if (Object.values(transferTargets).length === 0) {
        setInfoMessage(
          <div>
            {translate('One or more avatars found on a game world excluded by our rules.')}{' '}
            <a href={getGtlRulesUrl(locale.language)} target="_blank" rel="noopener noreferrer">
              {translate('Read more here')}
            </a>
          </div>
        );
        return;
      }

      onSuccess(name, { ...result, transferTargets });
    } catch (err: unknown) {
      const error = err as { body?: string };
      setError(translate(error.body || 'Unexpected Error'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(undefined);

  return (
    <form onSubmit={handleSubmit}>
      {infoMessage && <Notice type="info" icon={InfoIcon}>{infoMessage}</Notice>}
      <div className="transferInfo">
        <strong>{translate('Search new avatar')}</strong>
        <br />
        {translate('Please enter the name of the avatar to whom you wish to transfer the gold.')}
        <br />
        <div className="goldInfo">
          <div>{translate('Gold')}:</div>
          <GoldCoinIcon className="goldCoin" />
          <strong>{amount}</strong>
        </div>
      </div>
      <label className={`text ${error ? 'withCustomValidationRenderElement' : ''}`}>
        <input
          type="text"
          name="name"
          ref={nameRef}
          placeholder={translate('Avatarname')}
          onFocus={clearError}
          onChange={clearError}
          defaultValue={searchParams.get('name') || undefined}
        />
        <div className="label">{translate('Avatarname')}:</div>
        <ValidIcon className="valid" />
        <InvalidIcon className="invalid" />
        <div className="validation" data-rule="NOT_EMPTY">
          {translate(
            'Please enter your desired avatarname. It has to be between {min} and {max} characters long.',
            { min: '3', max: '15' }
          )}
        </div>
        <div className="validation" data-rule="AT_LEAST" data-parameter="3">
          {translate(
            'We are sorry but your desired avatarname is too short. It has to be at least {min} characters long.',
            { min: '3' }
          )}
        </div>
        <div className="validation" data-rule="SHORTER_THAN" data-parameter="16">
          {translate(
            'We are sorry but your desired avatarname is too long. It should contain at most {max} characters.',
            { max: '15' }
          )}
        </div>
        {error && (
          <div className="validation custom" data-rule="NO_CUSTOM_ERROR">
            {error}
          </div>
        )}
      </label>
      <div className="actions">
        <Button
          type="submit"
          disabled={isLoading}
          withLoadingIndicator
          isLoading={isLoading}
        >
          {translate('Search avatar')}
        </Button>
      </div>
    </form>
  );
};


// Gameworld card component
interface GameworldCardProps {
  gameworld: Gameworld;
  onClick?: (gameworld: Gameworld) => void;
}

const GameworldCard = ({ gameworld, onClick }: GameworldCardProps) => {
  const { translate } = useI18n();
  const [info, setInfo] = useState<GameworldInfoData>({});

  useEffect(() => {
    getGameworldInfo(gameworld.uuid)
      .then((data) => setInfo(data as GameworldInfoData))
      .catch(() => {});
  }, [gameworld.uuid]);

  const handleClick = () => {
    if (onClick) {
      onClick(gameworld);
    }
  };

  return (
    <div
      className="gameworld"
      data-wuid={gameworld.uuid}
      onClick={handleClick}
    >
      <div className="background normal" />
      <div className="content">
        <div className="title">
          <div className="gameworldName">{gameworld.name}</div>
          {gameworld.subtitle && <div className="subtitle">{gameworld.subtitle}</div>}
        </div>
        <div className="serverStart" title={translate('Server age in days')}>
          <i />
          <span>{info.ageInDays || '?'}</span>
        </div>
        <div className="speed" title={translate('Server speed')}>
          <i />
          <span>×{gameworld.speed || 1}</span>
        </div>
        <div className="tribes">
          {(info.tribes || [])
            .filter((t) => !hiddenTribes.includes(t.id))
            .map((tribe) => (
              <i
                key={tribe.id}
                className={`tribe ${tribeClassMap[tribe.id] || ''}`}
                title={translate(`tribe${tribe.id}`)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

// Step 3: Select Gameworld (when multiple found)
interface SelectGameworldStepProps {
  targets: GtlFindTargetsResponse & { transferTargets: Record<string, string> };
  onClickChangePlayer: () => void;
  onSuccess: (gameworld: Gameworld) => void;
}

const SelectGameworldStep = ({
  targets,
  onClickChangePlayer,
  onSuccess,
}: SelectGameworldStepProps) => {
  const { translate, locale } = useI18n();
  const [gameworlds, setGameworlds] = useState<Gameworld[]>([]);

  useEffect(() => {
    // Load gameworlds metadata
    getMetadata()
      .then((data) => {
        const worlds = (data as { gameworlds?: Gameworld[] }).gameworlds || [];
        setGameworlds(worlds);
      })
      .catch(() => {});
  }, []);

  const transferTargetUuids = Object.keys(targets.transferTargets);
  const filteredGameworlds = gameworlds.filter((gw) =>
    transferTargetUuids.includes(gw.uuid)
  );

  const handleSelect = (gameworld: Gameworld) => {
    const targetAvatarId = targets.transferTargets[gameworld.uuid];
    onSuccess({ ...gameworld, targetAvatarId });
  };

  const changeAvatarText = translate('Change avatar');

  return (
    <>
      {Object.values(targets.transferTargets).length < targets.targets.length && (
        <Notice type="info" icon={ErrorIcon}>
          {translate('One or more avatars found on a game world excluded by our rules.')}{' '}
          <a href={getGtlRulesUrl(locale.language)} target="_blank" rel="noopener noreferrer">
            {translate('Read more here')}
          </a>
        </Notice>
      )}
      <Notice type="info" icon={ClipboardIcon}>
        {translate('Multiple avatars with that name were found')}
      </Notice>
      {filteredGameworlds.length > 1 && (
        <div>
          <p>
            <strong>{translate('Please select game world')}</strong>
            <br />
            {translate(
              'We found that avatar on multiple game worlds in your region. You can only transfer the gold to one new avatar, please select a game world.'
            )}
          </p>
          <div className="WorldSelection shown">
            <div className="transformWrapper">
              <div className="worldGroup">
                {filteredGameworlds.map((gw) => (
                  <GameworldCard
                    key={gw.uuid}
                    gameworld={gw}
                    onClick={handleSelect}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="linkWrapper">
            <a className="change" onClick={onClickChangePlayer} title={changeAvatarText}>
              {changeAvatarText}
            </a>
          </div>
        </div>
      )}
    </>
  );
};


// Step 4: Confirm Transfer
interface ConfirmTransferStepProps {
  code: string;
  email: string;
  amount: number;
  targets: GtlFindTargetsResponse & { transferTargets: Record<string, string> };
  targetPlayer: string;
  targetGameworld: Gameworld;
  onClickChangePlayer: () => void;
  onClickChangeGameworld: () => void;
  onSuccess: (state: 'consumed' | 'pending') => void;
}

const ConfirmTransferStep = ({
  code,
  email,
  amount,
  targets,
  targetPlayer,
  targetGameworld,
  onClickChangePlayer,
  onClickChangeGameworld,
  onSuccess,
}: ConfirmTransferStepProps) => {
  const { translate, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const canChangeGameworld = Object.values(targets.transferTargets).length > 1;
  const changeAvatarText = translate('Change avatar');

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await gtlTransfer(code, email, targetGameworld.targetAvatarId!);
      onSuccess(result.state);
    } catch (err: unknown) {
      const error = err as { body?: string };
      setError(translate(error.body || 'Unexpected Error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {Object.values(targets.transferTargets).length < targets.targets.length && (
        <Notice type="info" icon={ErrorIcon}>
          {translate('One or more avatars found on a game world excluded by our rules.')}{' '}
          <a href={getGtlRulesUrl(locale.language)} target="_blank" rel="noopener noreferrer">
            {translate('Read more here')}
          </a>
        </Notice>
      )}
      {Object.values(targets.transferTargets).length === 1 && (
        <Notice type="success" icon={SuccessIcon}>
          {translate('Avatar name found on one game world')}
        </Notice>
      )}
      <div className="confirmInfo">
        <strong>{translate('Please confirm selection')}</strong>
        <br />
        {translate('Please check the displayed data and confirm the gold transfer to continue.')}
      </div>
      <GameworldCard
        gameworld={targetGameworld}
        onClick={canChangeGameworld ? onClickChangeGameworld : undefined}
      />
      <div className="linkWrapper">
        <a className="change" onClick={onClickChangePlayer} title={changeAvatarText}>
          {changeAvatarText}
        </a>
      </div>
      <div className="goldInfo">
        <div>{translate('Gold')}:</div>
        <GoldCoinIcon className="goldCoin" />
        <strong>{amount}</strong>
        <div>{translate('Avatarname')}:</div>
        <strong>{targetPlayer}</strong>
        <div>{translate('Game World')}:</div>
        <strong>{targetGameworld.name}</strong>
      </div>
      <br />
      <div className="actions">
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          withLoadingIndicator
          isLoading={isLoading}
        >
          {translate('Confirm transfer')}
        </Button>
      </div>
      {error && (
        <div>
          <br />
          <Notice type="error" icon={ErrorIcon}>
            <strong>{translate('error')}</strong>
          </Notice>
        </div>
      )}
    </>
  );
};


// Step 5: Success
interface SuccessStepProps {
  amount: number;
  targetPlayer: string;
  targetGameworldName: string;
  success: 'consumed' | 'pending';
  onSuccess: () => void;
}

const SuccessStep = ({
  amount,
  targetPlayer,
  targetGameworldName,
  success,
  onSuccess,
}: SuccessStepProps) => {
  const { translate } = useI18n();
  const closeText = translate('Close window');

  const goldIcon = <GoldCoinIcon className="goldCoin" />;
  const amountEl = <strong>{amount}</strong>;
  const avatarEl = <strong>{targetPlayer}</strong>;
  const worldEl = <strong>{targetGameworldName}</strong>;

  const message =
    success === 'consumed'
      ? translate(
          '{icon} {amount} was transferred to the avatar {avatar} on the game world {world}.',
          {
            avatar: avatarEl as unknown as string,
            icon: goldIcon as unknown as string,
            amount: amountEl as unknown as string,
            world: worldEl as unknown as string,
          }
        )
      : translate(
          'To complete the transfer of {icon} {amount}, the avatar {avatar} has to complete the instructions received via IGM.',
          {
            avatar: avatarEl as unknown as string,
            icon: goldIcon as unknown as string,
            amount: amountEl as unknown as string,
          }
        );

  return (
    <>
      <Notice type="success" icon={SuccessIcon}>
        {translate('Gold transfer successful')}
      </Notice>
      <div className="transferInfo" dangerouslySetInnerHTML={{ __html: message as string }} />
      <div className="actions">
        <Button onClick={onSuccess} title={closeText}>
          {closeText}
        </Button>
      </div>
    </>
  );
};

// Main Gold Transfer Modal
interface GoldTransferModalProps {
  code: string;
  onClose: () => void;
}

const GoldTransferModal = ({ code, onClose }: GoldTransferModalProps) => {
  const { translate } = useI18n();
  const [gameworlds, setGameworlds] = useState<Gameworld[]>([]);

  // State for each step
  const [verified, setVerified] = useState<{ email: string; amount: number }>();
  const [targetName, setTargetName] = useState<string>();
  const [targets, setTargets] = useState<GtlFindTargetsResponse & { transferTargets: Record<string, string> }>();
  const [selectedGameworld, setSelectedGameworld] = useState<Gameworld>();
  const [transferResult, setTransferResult] = useState<'consumed' | 'pending'>();

  useEffect(() => {
    getMetadata()
      .then((data) => {
        const worlds = (data as { gameworlds?: Gameworld[] }).gameworlds || [];
        setGameworlds(worlds);
      })
      .catch(() => {});
  }, []);

  const handleVerifySuccess = (email: string, amount: number) => {
    setVerified({ email, amount });
  };

  const handleSearchSuccess = (
    name: string,
    foundTargets: GtlFindTargetsResponse & { transferTargets: Record<string, string> }
  ) => {
    setTargetName(name);
    setTargets(foundTargets);

    // If only one target, auto-select it
    const targetUuids = Object.keys(foundTargets.transferTargets);
    if (targetUuids.length === 1) {
      const uuid = targetUuids[0];
      const gw = gameworlds.find((g) => g.uuid === uuid);
      if (gw) {
        setSelectedGameworld({
          ...gw,
          targetAvatarId: foundTargets.transferTargets[uuid],
        });
      }
    }
  };

  const handleChangePlayer = () => {
    setSelectedGameworld(undefined);
    setTargetName(undefined);
  };

  const handleSelectGameworld = (gameworld: Gameworld) => {
    setSelectedGameworld(gameworld);
  };

  const handleChangeGameworld = () => {
    setSelectedGameworld(undefined);
  };

  const handleTransferSuccess = (state: 'consumed' | 'pending') => {
    setTransferResult(state);
  };

  // Determine which step to show
  const renderStep = () => {
    if (!verified) {
      return <VerifyOwnershipStep code={code} onSuccess={handleVerifySuccess} />;
    }

    if (!targetName) {
      return (
        <SearchAvatarStep
          code={code}
          email={verified.email}
          amount={verified.amount}
          onSuccess={handleSearchSuccess}
        />
      );
    }

    if (targets && !selectedGameworld) {
      return (
        <SelectGameworldStep
          targets={targets}
          onClickChangePlayer={handleChangePlayer}
          onSuccess={handleSelectGameworld}
        />
      );
    }

    if (verified && targetName && targets && selectedGameworld && !transferResult) {
      return (
        <ConfirmTransferStep
          code={code}
          email={verified.email}
          amount={verified.amount}
          targets={targets}
          targetPlayer={targetName}
          targetGameworld={selectedGameworld}
          onClickChangePlayer={handleChangePlayer}
          onClickChangeGameworld={handleChangeGameworld}
          onSuccess={handleTransferSuccess}
        />
      );
    }

    if (transferResult) {
      return (
        <SuccessStep
          amount={verified.amount}
          targetPlayer={targetName}
          targetGameworldName={selectedGameworld!.name}
          success={transferResult}
          onSuccess={onClose}
        />
      );
    }

    return null;
  };

  return (
    <Modal id="goldTransfer" onClose={onClose} closeButton>
      <h1>{translate('Gold Transfer')}</h1>
      {renderStep()}
    </Modal>
  );
};

export default GoldTransferModal;
