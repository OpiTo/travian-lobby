import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from './Modal';
import { Button } from '../common';
import { InfoIcon, Flag } from './Icons';
import { useI18n } from '../../localization/i18n';
import { useAuth } from '../../hooks/useAuth';
import { GameworldStartDateFormatter } from '../../utils/DateFormatter';
import { getCalendar, CalendarEntry, registerAvatar } from '../../services/lobby';
import { LOCALES } from '../../data/locales';
import FormValidator from '../../utils/FormValidator';

interface CalendarGameworldModalProps {
  calendarGameworldId: string;
  onClose: () => void;
}

/**
 * Gameworld background type mapping (ie object in original)
 */
const BACKGROUND_TYPES: Record<string, string> = {
  default: 'default',
  speed: 'defaultSpeed',
  'new years special': 'newYearsSpecial',
  'new year special 2025': 'newYearSpecial2025',
  qualification: 'final',
  final: 'final',
  ptr: 'ptr',
  'domain special': 'domainSpecial',
  'tides of conquest': 'tidesOfConquest',
  'glory of sparta': 'gloryOfSparta',
  'codex victoria': 'codexVictoria',
  'shores of war': 'shoresOfWar',
  'northern legends': 'northernLegends',
  'reign of fire': 'reignOfFire',
};

/**
 * Excluded tribe IDs (re array in original)
 */
const EXCLUDED_TRIBES = [4, 5];

/**
 * Tribe ID to class name mapping (le object in original)
 */
const TRIBE_CLASSES: Record<number, string> = {
  1: 'roman',
  2: 'teuton',
  3: 'gaul',
  6: 'egyptian',
  7: 'hun',
  8: 'spartan',
  9: 'viking',
};

/**
 * Get background class for gameworld (oe function in original)
 */
const getBackgroundClass = (entry: CalendarEntry): string => {
  let background = BACKGROUND_TYPES.default;

  if (entry.metadata.mainpageBackground) {
    const bgKey = entry.metadata.mainpageBackground.toLowerCase();
    background = BACKGROUND_TYPES[bgKey] || background;
  }

  // Use speed background if speed > 1 and default background
  if (entry.metadata.speed && entry.metadata.speed > 1 && background === BACKGROUND_TYPES.default) {
    background = BACKGROUND_TYPES.speed;
  }

  return background;
};

/**
 * Calendar Gameworld Details Modal (ce component in original)
 * Shows detailed information about a specific gameworld from the calendar
 */
const CalendarGameworldModal = ({
  calendarGameworldId,
  onClose,
}: CalendarGameworldModalProps) => {
  const { translate, locale } = useI18n();
  const [entry, setEntry] = useState<CalendarEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const calendar = await getCalendar();
        const found = calendar.find((e) => e._id === calendarGameworldId);
        setEntry(found || null);
      } catch (error) {
        console.error('Failed to load calendar entry:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntry();
  }, [calendarGameworldId]);

  if (isLoading) {
    return <></>;
  }

  if (!entry) {
    return <></>;
  }

  const dateFormatter = new GameworldStartDateFormatter(entry.start, locale.locale);
  const hasEndDate = typeof entry.end === 'number';

  // Check if details are incomplete (c variable in original)
  const isIndeterminate = !(
    entry.metadata.speed &&
    entry.info?.tribes &&
    dateFormatter.isValidAsGameworldStart &&
    (entry.info?.artefactsDate || hasEndDate) &&
    (entry.info?.constructionPlansDate || hasEndDate)
  );

  // Check if gameworld has started
  let hasStarted = false;
  if (entry.uuid) {
    hasStarted = entry.start < Date.now() / 1000;
  }

  const isMobileOnly = !!entry.metadata.filter?.includes('mobile');
  const isInviteOnly = !!entry.flags?.registrationKeyRequired;
  const isSpecialType = entry.metadata.type !== 'normal';

  return (
    <Modal
      id="calendarGameworldDetails"
      className="gameworldDetails"
      onClose={onClose}
      closeButton
    >
      {/* Header with background */}
      <div className="header">
        <div className={`background ${getBackgroundClass(entry)}`} />
        <div className="content">
          <div className="title">
            <div className="gameworldName">
              {entry.metadata.name || entry.name}
            </div>
            <div className="subtitle">{entry.metadata.subtitle}</div>
          </div>
          <div className="tribes">
            {entry.info?.tribes &&
              entry.info.tribes
                .filter((t) => !EXCLUDED_TRIBES.includes(t))
                .map((t) => (
                  <i
                    key={t}
                    className={`tribe ${TRIBE_CLASSES[t]}`}
                    title={translate(`tribe${t}`)}
                  />
                ))}
          </div>
        </div>
      </div>

      {/* Indeterminate notice */}
      {isIndeterminate && (
        <section className="indeterminate">
          <InfoIcon />
          <span>
            {translate(
              'Not all gameworld details have been defined yet. You will receive a notification in your lobby once they are updated.'
            )}
          </span>
        </section>
      )}

      {/* Details section */}
      <section className={`details ${hasStarted ? 'hasAction' : ''}`}>
        {/* Server Start */}
        <div className="serverStart">
          <i className="serverStart" />
          <span>
            {translate('Date')}:
            <strong>
              {dateFormatter.getDateTimeShort()}
              {dateFormatter.isValidAsGameworldStart && (
                <>
                  {' '}
                  <span>({dateFormatter.getTimezone()})</span>
                </>
              )}
            </strong>
          </span>
        </div>

        {/* Speed */}
        <div className="speed" title={translate('Speed')}>
          <i className="speed" />
          <span>
            {translate('Speed')}:
            <strong>
              {entry.metadata?.speed ? (
                <>{String.fromCharCode(215)}{entry.metadata.speed}</>
              ) : (
                '?'
              )}
            </strong>
          </span>
        </div>

        {/* Artefacts & Construction Plans (only if no end date) */}
        {!hasEndDate && (
          <>
            <div className="artefacts">
              <i className="artefacts" />
              <span>
                {translate('Artefacts')}:
                <strong>
                  {entry.info?.artefactsDate
                    ? new GameworldStartDateFormatter(entry.info.artefactsDate, locale.locale).getDate()
                    : '?'}
                </strong>
              </span>
            </div>
            <div className="constructionPlans">
              <i className="constructionPlans" />
              <span>
                {translate('Construction plans')}:
                <strong>
                  {entry.info?.constructionPlansDate
                    ? new GameworldStartDateFormatter(entry.info.constructionPlansDate, locale.locale).getDate()
                    : '?'}
                </strong>
              </span>
            </div>
          </>
        )}

        {/* End Condition */}
        <div className="endCondition">
          <i className="serverEnd" />
          <span>
            {translate('Gameworld end')}:
            {typeof entry.end === 'number' ? (
              <strong>
                {new GameworldStartDateFormatter(entry.end, locale.locale).getDate()}
              </strong>
            ) : (
              <strong>{translate('Wonder of the World, level 100')}</strong>
            )}
          </span>
        </div>

        {/* Local gameworld languages */}
        {entry.info?.serverConfiguration?.languages &&
          entry.info.serverConfiguration.languages.length > 0 && (
            <div className="gameworldLanguages">
              <span>{translate('Local gameworld languages')}:</span>
              <div className="flags">
                {entry.info.serverConfiguration.languages.map((langCode) => {
                  const localeData = LOCALES[langCode];
                  if (!localeData) return null;
                  return (
                    <Flag
                      key={localeData.language}
                      name={localeData.flag}
                      title={`${localeData.langNative} ${localeData.countryNative ? '(' + localeData.countryNative + ')' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

        {/* Tags */}
        {(isMobileOnly || isInviteOnly || isSpecialType) && (
          <div className="tagList">
            {isMobileOnly && (
              <div className="tag mobileOnly">
                <i className="mobileOnly" />
                <span>
                  {translate('This gameworld is only accessible for mobile players.')}
                </span>
              </div>
            )}
            {isInviteOnly && (
              <div className="tag inviteOnly">
                <i className="inviteOnly" />
                <span>
                  {translate('This gameworld is restricted to players with a special invitation code.')}
                </span>
              </div>
            )}
            {isSpecialType && (
              <div className={`tag ${entry.metadata.type}`}>
                <i className={entry.metadata.type} />
                <span>
                  {translate(
                    'This is a special gameworld that might only be available time limited and could have different features than classic gameworlds.'
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Action section */}
      <CalendarGameworldAction calendarEntry={entry} />
    </Modal>
  );
};

/**
 * Calendar Gameworld Action component (ne component in original)
 * Handles the action button for joining/playing a gameworld
 */
interface CalendarGameworldActionProps {
  calendarEntry: CalendarEntry;
}

const CalendarGameworldAction = ({ calendarEntry: entry }: CalendarGameworldActionProps) => {
  const { translate } = useI18n();
  const { account } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [gameworld, setGameworld] = useState<CalendarEntry | null>(null);

  const isLoggedIn = account !== null;

  useEffect(() => {
    loadGameworld();
  }, []);

  const loadGameworld = async () => {
    setIsLoading(true);
    try {
      if (!entry.uuid) return;
      const calendar = await getCalendar();
      const gw = calendar.find((c) => c.uuid === entry.uuid);
      if (gw) {
        setGameworld(gw);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinClick = async () => {
    await trackClick();
    window.location.href = '#registration';
  };

  const trackClick = async () => {
    if (entry.trackingUrl) {
      try {
        const url = new URL(entry.trackingUrl);
        if (!url.searchParams.has('ping')) {
          url.searchParams.set('ping', '');
        }
        await fetch(url.toString(), { credentials: 'include' });
      } catch {
        // Ignore tracking errors
      }
    }
  };

  const handlePlayClick = async () => {
    await trackClick();
    searchParams.set('server', entry.uuid!);
    // Navigate to play - this would trigger the play flow
    window.location.href = `${window.Config?.lobby?.host || ''}/account/join?${searchParams.toString()}`;
  };

  if (isLoading) {
    return <></>;
  }

  // Check if gameworld is playable
  const isPlayable = (gw: CalendarEntry) =>
    gw.start < Date.now() / 1000 && !gw.flags.registrationClosed;

  if (!gameworld || !isPlayable(gameworld)) {
    return <></>;
  }

  // Mobile only message
  if (entry.metadata.filter?.includes('mobile')) {
    return (
      <section className="action">
        <p>
          {translate('This gameworld can only be joined via the Travian Legends mobile app.')}
        </p>
      </section>
    );
  }

  // Logged in - show play or registration key form
  if (isLoggedIn) {
    if (gameworld.flags.registrationKeyRequired) {
      return (
        <section className="action">
          <RegistrationKeyForm gameworld={gameworld} />
        </section>
      );
    }

    return (
      <section className="action">
        <Button onClick={handlePlayClick}>
          {translate('Play now')}
        </Button>
      </section>
    );
  }

  // Not logged in - show join button
  return (
    <section className="action">
      <Button onClick={handleJoinClick}>
        {translate('Join Gameworld')}
      </Button>
    </section>
  );
};

/**
 * Registration Key Form component (se component in original)
 * Form for entering invitation code to join restricted gameworlds
 */
interface RegistrationKeyFormProps {
  gameworld: CalendarEntry;
}

const RegistrationKeyForm = ({ gameworld }: RegistrationKeyFormProps) => {
  const { translate } = useI18n();
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const validatorRef = useRef(new FormValidator(formRef));

  const [error, setError] = useState<string | undefined>();
  const [invitationCode, setInvitationCode] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState<number | undefined>();

  useEffect(() => {
    if (gameworld.flags.registrationKeyRequired) {
      validatorRef.current?.attach();
    }
    return () => {
      validatorRef.current?.detach();
    };
  }, [gameworld.flags.registrationKeyRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validatorRef.current?.validateForm();
    if (!validatorRef.current?.formValid) return;

    setError(undefined);
    setCooldown(undefined);

    try {
      const adCode = searchParams.get('ad') || undefined;
      const ucCode = searchParams.get('uc') || undefined;

      const { redirectTo } = await registerAvatar(
        gameworld.uuid!,
        adCode,
        ucCode,
        invitationCode
      );

      const redirectUrl = new URL(redirectTo, gameworld.metadata.url || gameworld.url);
      window.location.href = redirectUrl.toString();
    } catch (err: unknown) {
      const error = err as { body?: { error?: string; at?: string; message?: string } };
      if (error.body?.error === 'try_again') {
        const cooldownDate = new Date(error.body.at!);
        const seconds = Math.ceil((cooldownDate.getTime() - Date.now()) / 1000);
        setCooldown(seconds > 0 ? seconds : undefined);
      } else {
        setError(translate(error.body?.message || 'Unexpected error'));
      }
    }
  };

  const isCodeComplete = !!invitationCode && invitationCode.length === 22;
  const isValid = !error && (!gameworld.flags.registrationKeyRequired || (isCodeComplete && cooldown === undefined));

  return (
    <form ref={formRef}>
      {gameworld.flags.registrationKeyRequired && (
        <>
          <p>
            {translate(
              'This gameworld is restricted to players with a special invitation code. If you have one, please enter it to join the gameworld.'
            )}
          </p>
          <label className={`text search ${error ? 'invalid' : ''}`}>
            <input
              type="text"
              onChange={(e) => {
                setError(undefined);
                setInvitationCode(e.target.value);
              }}
              placeholder={translate('Your invitation code')}
              maxLength={22}
            />
            <div className="label">{translate('Enter invitation code')}</div>
            <svg className="valid" viewBox="0 0 20 20">
              <path d="M14.59 5.58L8 12.17 4.41 8.59 3 10l5 5 8-8zM10 0a10 10 0 1010 10A10 10 0 0010 0zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
            </svg>
            <svg className="invalid" viewBox="0 0 22 19">
              <path d="M11 4l7.5 13h-15L11 4m0-4L0 19h22L11 0z" />
              <path d="M12 14h-2v2h2zM12 8h-2v5h2z" />
            </svg>
            <DigitsDisplay length={22} code={invitationCode} />
            {error && (
              <div
                className="validation custom show"
                data-rule={FormValidator.NO_CUSTOM_ERROR}
              >
                {error}
              </div>
            )}
            <div className="validation" data-rule={FormValidator.NOT_EMPTY}>
              {translate('Please enter the invitation code that you received.')}
            </div>
            <div
              className="validation"
              data-rule={FormValidator.AT_LEAST}
              data-parameter="22"
            >
              {translate('The invitation code is too short. Please enter all {INT} characters.', {
                INT: '22',
              })}
            </div>
          </label>
        </>
      )}

      <Button
        type="submit"
        disabled={!isValid}
        onClick={handleSubmit}
        onSubmit={handleSubmit}
      >
        {translate('Join Gameworld')}
      </Button>

      {cooldown !== undefined && (
        <p className="cooldown">
          {translate('Invitation code cooldown')}
          {'  ('}
          <Timer
            seconds={cooldown}
            direction="down"
            onComplete={() => {
              setError(undefined);
              setCooldown(undefined);
            }}
          />
          {')'}
        </p>
      )}
    </form>
  );
};

/**
 * Digits Display component (ae component in original)
 */
interface DigitsDisplayProps {
  length: number;
  code?: string;
}

const DigitsDisplay = ({ length, code }: DigitsDisplayProps) => {
  const { translate, locale } = useI18n();

  const digitsMissing = !code || code.length < length;

  return (
    <div className={`digitsDisplay ${digitsMissing ? 'digitsMissing' : ''}`}>
      {code && (
        <>
          <Fraction
            locale={locale}
            nominator={code.length}
            denominator={length}
          />{' '}
          {translate('digits')}
        </>
      )}
    </div>
  );
};

/**
 * Fraction component (ee component in original)
 */
interface FractionProps {
  locale: { language: string; direction: string };
  nominator: number;
  denominator: number;
}

const Fraction = ({ locale, nominator, denominator }: FractionProps) => {
  const isLTR = locale.direction !== 'rtl';
  const separator = isLTR ? '/' : '\\';
  const dirChar = isLTR ? '\u202D' : '\u202E'; // LRO or RLO
  const popChar = '\u202C'; // PDF

  return (
    <>
      {dirChar}
      {nominator}
      {separator}
      {denominator}
      {popChar}
    </>
  );
};

/**
 * Timer component (te component in original)
 */
interface TimerProps {
  seconds: number;
  direction: 'up' | 'down';
  className?: string;
  onComplete?: () => void;
}

const Timer = ({ seconds, direction, className, onComplete }: TimerProps) => {
  const [display, setDisplay] = useState('??:??:??');
  const [startTime, setStartTime] = useState<number>();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setStartTime(Math.floor(Date.now() / 1000));
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const tick = () => {
      if (startTime && !completed) {
        const elapsed = Math.floor(Date.now() / 1000) - startTime;
        const remaining = direction === 'up' ? seconds + elapsed : seconds - elapsed;

        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const secs = remaining % 60;

        if (direction === 'down' && remaining <= 0) {
          setDisplay('00:00:00');
          setCompleted(true);
          onComplete?.();
          if (interval) clearInterval(interval);
        } else {
          setDisplay(
            [hours, minutes, secs].map((n) => n.toString().padStart(2, '0')).join(':')
          );
        }
      }
    };

    tick();
    interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [startTime, completed, seconds, direction, onComplete]);

  return <span className={`timer ${className || ''}`}>{display}</span>;
};

export default CalendarGameworldModal;
