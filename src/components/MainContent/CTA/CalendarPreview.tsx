import GoldenFrameCorners from './GoldenFrameCorners';
import { useI18n } from '../../../localization/i18n';
import { useNextGameworld, useNavigateWithParams } from '../../../hooks';

const CalendarPreview = () => {
  const { translate, locale } = useI18n();
  const { nextGameworld, loading, error } = useNextGameworld();
  const navigate = useNavigateWithParams();

  const handleShowCalendar = () => {
    navigate(`/${locale.name}/calendar`);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const getTribeClass = (tribe: string) => {
    const tribeMap: Record<string, string> = {
      '1': 'roman',
      '2': 'teuton',
      '3': 'gaul',
      '4': 'nature',
      '5': 'natar',
      '6': 'egyptian',
      '7': 'hun',
      '8': 'spartan',
      roman: 'roman',
      teuton: 'teuton',
      gaul: 'gaul',
      egyptian: 'egyptian',
      hun: 'hun',
      spartan: 'spartan',
    };
    return tribeMap[tribe.toLowerCase()] || tribe.toLowerCase();
  };

  const getTribeName = (tribe: string) => {
    const nameMap: Record<string, string> = {
      '1': 'Roman',
      '2': 'Teuton',
      '3': 'Gaul',
      '6': 'Egyptian',
      '7': 'Hun',
      '8': 'Spartan',
      roman: 'Roman',
      teuton: 'Teuton',
      gaul: 'Gaul',
      egyptian: 'Egyptian',
      hun: 'Hun',
      spartan: 'Spartan',
    };
    return nameMap[tribe.toLowerCase()] || tribe;
  };

  if (loading) {
    return (
      <div className="calendarGameworldWrapper infoBoxWrapper">
        <div className="goldenFrame calendarGameworldPreviewContainer">
          <GoldenFrameCorners />
          <div className="calendarGameworldPreview">
            <div className="loading">{translate('Loading...')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !nextGameworld) {
    return (
      <div className="calendarGameworldWrapper infoBoxWrapper">
        <div className="goldenFrame calendarGameworldPreviewContainer">
          <GoldenFrameCorners />
          <div className="calendarGameworldPreview">
            <h3>{translate('No upcoming servers')}</h3>
          </div>
        </div>
        <button
          className="gold decorative buttonSecondary withText"
          type="button"
          onClick={handleShowCalendar}
        >
          <div>
            <span>{translate('Show game world calendar')}</span>
            <svg viewBox="0 0 18 20">
              <path d="M1.96 20c-.538 0-1-.196-1.384-.587A1.945 1.945 0 0 1 0 18V4c0-.55.192-1.02.576-1.413A1.87 1.87 0 0 1 1.961 2h.98V0h1.961v2h7.843V0h1.96v2h.981c.54 0 1.001.196 1.385.587.384.392.576.863.576 1.413v14c0 .55-.192 1.02-.576 1.413a1.87 1.87 0 0 1-1.385.587H1.961Zm0-2h13.726V8H1.961v10Zm0-12h13.726V4H1.961v2Zm6.864 6a.939.939 0 0 1-.699-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713A.939.939 0 0 1 8.824 10c.277 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm-3.922 0a.939.939 0 0 1-.699-.287.978.978 0 0 1-.281-.713c0-.283.094-.52.281-.713A.939.939 0 0 1 4.902 10c.278 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm7.843 0a.939.939 0 0 1-.698-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713a.939.939 0 0 1 .698-.287c.278 0 .51.096.699.287.188.192.281.43.281.713s-.093.52-.281.713a.939.939 0 0 1-.699.287Zm-3.921 4a.939.939 0 0 1-.699-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713A.939.939 0 0 1 8.824 14c.277 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm-3.922 0a.939.939 0 0 1-.699-.287.978.978 0 0 1-.281-.713c0-.283.094-.52.281-.713A.939.939 0 0 1 4.902 14c.278 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm7.843 0a.939.939 0 0 1-.698-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713a.939.939 0 0 1 .698-.287c.278 0 .51.096.699.287.188.192.281.43.281.713s-.093.52-.281.713a.939.939 0 0 1-.699.287Z"></path>
            </svg>
          </div>
        </button>
      </div>
    );
  }

  const { metadata, flags } = nextGameworld;
  const tribes = metadata.tribes || ['1', '2', '3'];
  const speed = metadata.speed || 1;
  const name = metadata.name || 'Unknown';
  const subtitle = metadata.subtitle || (flags.registrationClosed ? translate('Registration closed') : translate('Details to come'));

  return (
    <div className="calendarGameworldWrapper infoBoxWrapper">
      <div className="goldenFrame calendarGameworldPreviewContainer">
        <GoldenFrameCorners />
        <div className="calendarGameworldPreview">
          <h3>{translate('Next upcoming server')}</h3>
          <div className="day"><div>{formatDate(nextGameworld.start)}</div></div>
          <div className="title">
            <div className="text">
              <span className="name">{name.toUpperCase()}</span>
              <span className="subtitle">{subtitle}</span>
            </div>
          </div>
          <div className="speed">×{speed}</div>
          <div className="tribes">
            <div className="tribeImages">
              {tribes.map((tribe, index) => (
                <i
                  key={index}
                  className={`tribe ${getTribeClass(tribe)}`}
                  title={translate(getTribeName(tribe))}
                ></i>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        className="gold decorative buttonSecondary withText"
        type="button"
        onClick={handleShowCalendar}
      >
        <div>
          <span>{translate('Show game world calendar')}</span>
          <svg viewBox="0 0 18 20">
            <path d="M1.96 20c-.538 0-1-.196-1.384-.587A1.945 1.945 0 0 1 0 18V4c0-.55.192-1.02.576-1.413A1.87 1.87 0 0 1 1.961 2h.98V0h1.961v2h7.843V0h1.96v2h.981c.54 0 1.001.196 1.385.587.384.392.576.863.576 1.413v14c0 .55-.192 1.02-.576 1.413a1.87 1.87 0 0 1-1.385.587H1.961Zm0-2h13.726V8H1.961v10Zm0-12h13.726V4H1.961v2Zm6.864 6a.939.939 0 0 1-.699-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713A.939.939 0 0 1 8.824 10c.277 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm-3.922 0a.939.939 0 0 1-.699-.287.978.978 0 0 1-.281-.713c0-.283.094-.52.281-.713A.939.939 0 0 1 4.902 10c.278 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm7.843 0a.939.939 0 0 1-.698-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713a.939.939 0 0 1 .698-.287c.278 0 .51.096.699.287.188.192.281.43.281.713s-.093.52-.281.713a.939.939 0 0 1-.699.287Zm-3.921 4a.939.939 0 0 1-.699-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713A.939.939 0 0 1 8.824 14c.277 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm-3.922 0a.939.939 0 0 1-.699-.287.978.978 0 0 1-.281-.713c0-.283.094-.52.281-.713A.939.939 0 0 1 4.902 14c.278 0 .51.096.698.287.188.192.282.43.282.713s-.094.52-.282.713a.939.939 0 0 1-.698.287Zm7.843 0a.939.939 0 0 1-.698-.287.978.978 0 0 1-.282-.713c0-.283.094-.52.282-.713a.939.939 0 0 1 .698-.287c.278 0 .51.096.699.287.188.192.281.43.281.713s-.093.52-.281.713a.939.939 0 0 1-.699.287Z"></path>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default CalendarPreview;
