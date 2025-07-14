import { 
  formatRelativeTime, 
  isToday, 
  isYesterday, 
  isThisWeek, 
  isThisMonth,
  getDaysBetween,
  getHoursBetween,
  getMinutesBetween,
  formatDate,
  formatTime
} from '../../src/utils/date';

describe('Date Utilities', () => {
  const now = new Date('2024-01-15T12:00:00Z');
  const today = new Date('2024-01-15T10:00:00Z');
  const yesterday = new Date('2024-01-14T10:00:00Z');
  const lastWeek = new Date('2024-01-08T10:00:00Z');
  const lastMonth = new Date('2023-12-15T10:00:00Z');

  beforeEach(() => {
    // Mock current date
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatRelativeTime', () => {
    it('should format time as "just now" for very recent times', () => {
      const recent = new Date('2024-01-15T11:59:30Z');
      expect(formatRelativeTime(recent)).toBe('just now');
    });

    it('should format time as "X minutes ago"', () => {
      const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z');
      const thirtyMinutesAgo = new Date('2024-01-15T11:30:00Z');
      
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
      expect(formatRelativeTime(thirtyMinutesAgo)).toBe('30 minutes ago');
    });

    it('should format time as "X hours ago"', () => {
      const twoHoursAgo = new Date('2024-01-15T10:00:00Z');
      const sixHoursAgo = new Date('2024-01-15T06:00:00Z');
      
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
      expect(formatRelativeTime(sixHoursAgo)).toBe('6 hours ago');
    });

    it('should format time as "yesterday"', () => {
      expect(formatRelativeTime(yesterday)).toBe('yesterday');
    });

    it('should format time as "X days ago"', () => {
      const threeDaysAgo = new Date('2024-01-12T12:00:00Z');
      const sevenDaysAgo = new Date('2024-01-08T12:00:00Z');
      
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
      expect(formatRelativeTime(sevenDaysAgo)).toBe('7 days ago');
    });

    it('should format time as "X weeks ago"', () => {
      const twoWeeksAgo = new Date('2024-01-01T12:00:00Z');
      const fourWeeksAgo = new Date('2023-12-18T12:00:00Z');
      
      expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago');
      expect(formatRelativeTime(fourWeeksAgo)).toBe('4 weeks ago');
    });

    it('should format time as "X months ago"', () => {
      const twoMonthsAgo = new Date('2023-11-15T12:00:00Z');
      const sixMonthsAgo = new Date('2023-07-15T12:00:00Z');
      
      expect(formatRelativeTime(twoMonthsAgo)).toBe('2 months ago');
      expect(formatRelativeTime(sixMonthsAgo)).toBe('6 months ago');
    });

    it('should format time as "X years ago"', () => {
      const oneYearAgo = new Date('2023-01-15T12:00:00Z');
      const threeYearsAgo = new Date('2021-01-15T12:00:00Z');
      
      expect(formatRelativeTime(oneYearAgo)).toBe('1 year ago');
      expect(formatRelativeTime(threeYearsAgo)).toBe('3 years ago');
    });

    it('should handle future dates', () => {
      const future = new Date('2024-01-16T12:00:00Z');
      expect(formatRelativeTime(future)).toBe('in 1 day');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      expect(isToday(today)).toBe(true);
    });

    it('should return false for other days', () => {
      expect(isToday(yesterday)).toBe(false);
      expect(isToday(lastWeek)).toBe(false);
      expect(isToday(lastMonth)).toBe(false);
    });

    it('should handle different times on the same day', () => {
      const morning = new Date('2024-01-15T06:00:00Z');
      const evening = new Date('2024-01-15T18:00:00Z');
      
      expect(isToday(morning)).toBe(true);
      expect(isToday(evening)).toBe(true);
    });
  });

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('should return false for other days', () => {
      expect(isYesterday(today)).toBe(false);
      expect(isYesterday(lastWeek)).toBe(false);
      expect(isYesterday(lastMonth)).toBe(false);
    });
  });

  describe('isThisWeek', () => {
    it('should return true for dates this week', () => {
      const monday = new Date('2024-01-15T12:00:00Z'); // Monday
      const wednesday = new Date('2024-01-17T12:00:00Z');
      const sunday = new Date('2024-01-21T12:00:00Z');
      
      expect(isThisWeek(monday)).toBe(true);
      expect(isThisWeek(wednesday)).toBe(true);
      expect(isThisWeek(sunday)).toBe(true);
    });

    it('should return false for dates not this week', () => {
      expect(isThisWeek(lastWeek)).toBe(false);
      expect(isThisWeek(lastMonth)).toBe(false);
    });
  });

  describe('isThisMonth', () => {
    it('should return true for dates this month', () => {
      const firstOfMonth = new Date('2024-01-01T12:00:00Z');
      const middleOfMonth = new Date('2024-01-15T12:00:00Z');
      const lastOfMonth = new Date('2024-01-31T12:00:00Z');
      
      expect(isThisMonth(firstOfMonth)).toBe(true);
      expect(isThisMonth(middleOfMonth)).toBe(true);
      expect(isThisMonth(lastOfMonth)).toBe(true);
    });

    it('should return false for dates not this month', () => {
      expect(isThisMonth(lastMonth)).toBe(false);
    });
  });

  describe('getDaysBetween', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-18T12:00:00Z');
      
      expect(getDaysBetween(date1, date2)).toBe(3);
      expect(getDaysBetween(date2, date1)).toBe(3);
    });

    it('should return 0 for same day', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-15T18:00:00Z');
      
      expect(getDaysBetween(date1, date2)).toBe(0);
    });

    it('should handle different times on different days', () => {
      const date1 = new Date('2024-01-15T23:59:59Z');
      const date2 = new Date('2024-01-16T00:00:01Z');
      
      expect(getDaysBetween(date1, date2)).toBe(1);
    });
  });

  describe('getHoursBetween', () => {
    it('should calculate hours between dates', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-15T15:00:00Z');
      
      expect(getHoursBetween(date1, date2)).toBe(3);
      expect(getHoursBetween(date2, date1)).toBe(3);
    });

    it('should return 0 for same hour', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-15T12:30:00Z');
      
      expect(getHoursBetween(date1, date2)).toBe(0);
    });

    it('should handle cross-day hours', () => {
      const date1 = new Date('2024-01-15T23:00:00Z');
      const date2 = new Date('2024-01-16T01:00:00Z');
      
      expect(getHoursBetween(date1, date2)).toBe(2);
    });
  });

  describe('getMinutesBetween', () => {
    it('should calculate minutes between dates', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-15T12:30:00Z');
      
      expect(getMinutesBetween(date1, date2)).toBe(30);
      expect(getMinutesBetween(date2, date1)).toBe(30);
    });

    it('should return 0 for same minute', () => {
      const date1 = new Date('2024-01-15T12:00:00Z');
      const date2 = new Date('2024-01-15T12:00:30Z');
      
      expect(getMinutesBetween(date1, date2)).toBe(0);
    });

    it('should handle cross-hour minutes', () => {
      const date1 = new Date('2024-01-15T12:55:00Z');
      const date2 = new Date('2024-01-15T13:05:00Z');
      
      expect(getMinutesBetween(date1, date2)).toBe(10);
    });
  });

  describe('formatDate', () => {
    it('should format date in default format', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should format date in custom format', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/15/2024');
      expect(formatDate(date, 'DD-MM-YYYY')).toBe('15-01-2024');
    });

    it('should handle different date formats', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
      expect(formatDate(date, 'MM/DD/YY')).toBe('01/15/24');
      expect(formatDate(date, 'MMMM DD, YYYY')).toBe('January 15, 2024');
    });
  });

  describe('formatTime', () => {
    it('should format time in default format', () => {
      const date = new Date('2024-01-15T14:30:45Z');
      expect(formatTime(date)).toBe('14:30');
    });

    it('should format time in custom format', () => {
      const date = new Date('2024-01-15T14:30:45Z');
      expect(formatTime(date, 'HH:mm:ss')).toBe('14:30:45');
      expect(formatTime(date, 'hh:mm A')).toBe('02:30 PM');
    });

    it('should handle different time formats', () => {
      const date = new Date('2024-01-15T14:30:45Z');
      
      expect(formatTime(date, 'HH:mm')).toBe('14:30');
      expect(formatTime(date, 'hh:mm A')).toBe('02:30 PM');
      expect(formatTime(date, 'HH:mm:ss')).toBe('14:30:45');
      expect(formatTime(date, 'h:mm A')).toBe('2:30 PM');
    });

    it('should handle midnight and noon', () => {
      const midnight = new Date('2024-01-15T00:00:00Z');
      const noon = new Date('2024-01-15T12:00:00Z');
      
      expect(formatTime(midnight, 'hh:mm A')).toBe('12:00 AM');
      expect(formatTime(noon, 'hh:mm A')).toBe('12:00 PM');
    });
  });
}); 