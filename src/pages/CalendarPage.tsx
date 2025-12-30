import { useState, useEffect } from 'react';
import { useI18n } from '../localization/i18n';
import {
  getCalendar,
  getCalendarNotifications,
  readAllCalendarNotifications,
  CalendarEntry,
} from '../services/lobby';
import { useAuth } from '../hooks';

interface CalendarEntryWithNotification extends CalendarEntry {
  notification?: boolean;
}

const CalendarPage = () => {
  const { translate } = useI18n();
  const { isAuthenticated } = useAuth();
  const [calendar, setCalendar] = useState<CalendarEntryWithNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const calendarData = await getCalendar();

        // If authenticated, get notifications and mark entries
        if (isAuthenticated) {
          const notifications = await getCalendarNotifications();

          // Mark entries with notifications
          const calendarWithNotifications = calendarData.map((entry) => {
            const hasNotification = notifications.list.some(
              (n) => n.calendarGameworldId === entry._id
            );
            return { ...entry, notification: hasNotification };
          });

          setCalendar(calendarWithNotifications);

          // Mark all notifications as read
          if (notifications.unreadCount > 0) {
            readAllCalendarNotifications();
          }
        } else {
          setCalendar(calendarData);
        }
      } catch (error) {
        console.error('Failed to load calendar:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendar();
  }, [isAuthenticated]);

  // Group entries by month
  const groupedEntries: { [key: string]: CalendarEntry[] } = {};
  calendar.forEach(entry => {
    const date = new Date(entry.start * 1000);
    const monthKey = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    if (!groupedEntries[monthKey]) {
      groupedEntries[monthKey] = [];
    }
    groupedEntries[monthKey].push(entry);
  });

  return (
    <main id="gameworldCalendar">
      <h1>{translate('Game world calendar')}</h1>

      {isLoading ? (
        <div className="loading">{translate('Loading...')}</div>
      ) : calendar.length === 0 ? (
        <h2 className="noResults">{translate('Currently no entries')}</h2>
      ) : (
        Object.entries(groupedEntries).map(([monthTitle, entries]) => (
          <div key={monthTitle}>
            <h2>{monthTitle}</h2>
            {entries.map((entry) => (
              <CalendarGameworld key={entry._id} entry={entry} />
            ))}
          </div>
        ))
      )}
    </main>
  );
};

interface CalendarGameworldProps {
  entry: CalendarEntryWithNotification;
}

const CalendarGameworld = ({ entry }: CalendarGameworldProps) => {
  const date = new Date(entry.start * 1000);
  
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  const day = date.getDate();
  const time = new Intl.DateTimeFormat('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(date);

  const isSpecial = entry.metadata.type === 'special';
  const isActive = entry.flags.isActive || isNearStart(entry.start);
  const tribes = entry.metadata.tribes || ['roman', 'teuton', 'gaul'];

  return (
    <div className={`calendarGameworld gameworldDetails ${entry.notification ? 'notification' : ''}`}>
      <div className={`day${isActive ? ' active' : ''}`}>
        <div className="weekday">{weekday}</div>
        <div>{day}</div>
      </div>

      <div className={`title tag ${isSpecial ? 'special' : 'normal'}`}>
        <div className="text">
          <span className="name">{entry.metadata.name || 'Unknown'}</span>
          {entry.metadata.subtitle && <span className="subtitle">{entry.metadata.subtitle}</span>}
        </div>
        {isSpecial && <i className="special"></i>}
      </div>

      <div className="speed">
        <i className="speed"></i>
        ×{entry.metadata.speed || 1}
      </div>

      <div className="tribes">
        <div className="tribeImages">
          {tribes.map((tribe, idx) => (
            <i key={idx} className={`tribe ${tribe}`} title={capitalize(tribe)}></i>
          ))}
        </div>
      </div>

      <div className="startTime">
        <i className="serverStart"></i>
        <div>{time}&nbsp;<span>(UTC)</span></div>
      </div>

      <div className="artefacts">
        <i className="artefacts"></i>
        {entry.metadata.artefacts || '?'}
      </div>

      <div className="constructionPlans">
        <i className="constructionPlans"></i>
        {entry.metadata.constructionPlans || '?'}
      </div>

      <div className="endCondition">
        <i className="ww"></i>
        <span>{entry.metadata.endCondition || 100}</span>
      </div>

      <ActionButton entry={entry} />
    </div>
  );
};

const ActionButton = ({ entry }: { entry: CalendarEntryWithNotification }) => {
  const isActive = entry.flags.isActive || isNearStart(entry.start);

  const handleClick = () => {
    if (entry.uuid) {
      // Navigate to gameworld or show details
      window.location.href = `/gameworld/${entry.uuid}`;
    }
  };

  return (
    <button className="green buttonFramed action withText" type="button" onClick={handleClick}>
      <div>
        {isActive ? <PlayIcon /> : <InfoIcon />}
      </div>
    </button>
  );
};

const isNearStart = (startTimestamp: number): boolean => {
  const now = Date.now() / 1000;
  const sevenDays = 7 * 24 * 60 * 60;
  return startTimestamp <= now + sevenDays && startTimestamp >= now - sevenDays;
};

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const PlayIcon = () => (
  <svg viewBox="0 0 14 18">
    <g className="outline">
      <path d="M1.134 1.456.75 1.212v16.183l.384-.244 12-7.637.332-.21-.332-.212-12-7.636Z"></path>
    </g>
    <g className="icon">
      <path d="M1.134 1.456.75 1.212v16.183l.384-.244 12-7.637.332-.21-.332-.212-12-7.636Z"></path>
    </g>
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 20 20">
    <g className="outline">
      <path d="M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71S10.28 5 10 5s-.52.1-.71.29S9 5.72 9 6s.1.52.29.71c.19.19.43.29.71.29Zm0 13c-1.38 0-2.68-.26-3.9-.79-1.22-.52-2.28-1.24-3.18-2.14-.9-.9-1.61-1.96-2.14-3.18-.52-1.22-.79-2.52-.79-3.9s.26-2.68.79-3.9c.53-1.22 1.24-2.28 2.14-3.18.9-.9 1.96-1.61 3.18-2.14C7.32.25 8.62-.02 10-.02s2.68.26 3.9.79c1.22.53 2.27 1.24 3.18 2.14.9.9 1.61 1.96 2.14 3.18.52 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9-1.24 2.27-2.14 3.18c-.9.9-1.96 1.61-3.18 2.14S11.38 20 10 20Zm0-2c2.23 0 4.12-.77 5.67-2.33C17.22 14.12 18 12.23 18 10s-.77-4.12-2.33-5.68C14.12 2.77 12.23 2 10 2s-4.12.78-5.68 2.32C2.77 5.87 2 7.76 2 10s.78 4.12 2.32 5.67C5.87 17.22 7.76 18 10 18Z"></path>
    </g>
    <g className="icon">
      <path d="M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71S10.28 5 10 5s-.52.1-.71.29S9 5.72 9 6s.1.52.29.71c.19.19.43.29.71.29Zm0 13c-1.38 0-2.68-.26-3.9-.79-1.22-.52-2.28-1.24-3.18-2.14-.9-.9-1.61-1.96-2.14-3.18-.52-1.22-.79-2.52-.79-3.9s.26-2.68.79-3.9c.53-1.22 1.24-2.28 2.14-3.18.9-.9 1.96-1.61 3.18-2.14C7.32.25 8.62-.02 10-.02s2.68.26 3.9.79c1.22.53 2.27 1.24 3.18 2.14.9.9 1.61 1.96 2.14 3.18.52 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9-1.24 2.27-2.14 3.18c-.9.9-1.96 1.61-3.18 2.14S11.38 20 10 20Zm0-2c2.23 0 4.12-.77 5.67-2.33C17.22 14.12 18 12.23 18 10s-.77-4.12-2.33-5.68C14.12 2.77 12.23 2 10 2s-4.12.78-5.68 2.32C2.77 5.87 2 7.76 2 10s.78 4.12 2.32 5.67C5.87 17.22 7.76 18 10 18Z"></path>
    </g>
  </svg>
);

export default CalendarPage;
