/**
 * Base Date Formatter class (v class in original)
 * Handles date formatting with locale and timezone support.
 */
export class DateFormatter {
  date: Date;
  locale: string;
  timeZone: string;

  constructor(timestamp: number, locale: string, timeZone: string) {
    this.date = new Date(timestamp * 1000);
    this.locale = locale;
    this.timeZone = timeZone;
  }

  getDateTime(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      minute: '2-digit',
      hour: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(this.date);
  }

  getDateTimeShort(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      minute: '2-digit',
      hour: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(this.date);
  }

  getDay(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      day: '2-digit',
    }).format(this.date);
  }

  getWeekday(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      weekday: 'short',
    }).format(this.date);
  }

  getDate(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(this.date);
  }

  getDateShort(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      day: '2-digit',
      month: '2-digit',
    }).format(this.date);
  }

  getDateTitle(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      month: 'long',
      year: 'numeric',
    }).format(this.date);
  }

  getTimeShort(): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      hour: '2-digit',
      minute: '2-digit',
    }).format(this.date);
  }

  getTimezone(): string | undefined {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      timeZoneName: 'short',
    })
      .formatToParts(this.date)
      .find((e) => e.type === 'timeZoneName')?.value;
  }
}

/**
 * UTC Date Formatter class (j class in original)
 * Extends DateFormatter with Europe/London timezone and UTC display.
 */
export class UTCDateFormatter extends DateFormatter {
  constructor(timestamp: number, locale: string) {
    super(timestamp, locale, 'Europe/London');
  }

  getTimezone(): string | undefined {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(this.date)
      .find((e) => e.type === 'timeZoneName')
      ?.value?.replace('GMT', 'UTC');
  }
}

/**
 * Gameworld Start Date Formatter class (f class in original)
 * Extends UTCDateFormatter with special handling for gameworld start times.
 * Hides time if it's exactly midnight (00:00).
 */
export class GameworldStartDateFormatter extends UTCDateFormatter {
  isValidAsGameworldStart: boolean;

  constructor(timestamp: number, locale: string) {
    super(timestamp, locale);

    // Check if time is exactly midnight (00:00)
    this.isValidAsGameworldStart =
      '00:00' !==
      new Intl.DateTimeFormat('de-DE', {
        timeZone: this.timeZone,
        hour: '2-digit',
        minute: '2-digit',
      }).format(this.date);
  }

  getDateTime(): string {
    const options: Intl.DateTimeFormatOptions = this.isValidAsGameworldStart
      ? {
        minute: '2-digit',
        hour: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
      : {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };

    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      ...options,
    }).format(this.date);
  }

  getDateTimeShort(): string {
    const options: Intl.DateTimeFormatOptions = this.isValidAsGameworldStart
      ? {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
      : {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };

    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      ...options,
    }).format(this.date);
  }

  getTimeShort(): string {
    if (!this.isValidAsGameworldStart) {
      return '';
    }

    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      hour: '2-digit',
      minute: '2-digit',
    }).format(this.date);
  }
}
