export {};

declare global {
  module Date {
    type Interval = [Date, Date];

    interface BetweenOptions {
      start?: boolean;
      end?: boolean;
    }

    interface DateObject {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      second: number;
      millisecond: number;
    }
  }

  interface Date {
    toISODateString(): string;

    toObject(): Date.DateObject;

    isBefore(other: Date): boolean;

    isEqual(other: Date): boolean;

    isAfter(other: Date): boolean;

    isBetween(
      interval: Date.Interval,
      inclusive?: Date.BetweenOptions | boolean,
    ): boolean;
  }
}

Date.prototype.toISODateString = function (): string {
  return this.toISOString().split('T')[0];
};

Date.prototype.toObject = function (): Date.DateObject {
  return {
    year: this.getFullYear(),
    month: this.getMonth(),
    day: this.getDate(),
    hour: this.getHours(),
    minute: this.getMinutes(),
    second: this.getSeconds(),
    millisecond: this.getMilliseconds(),
  };
};

Date.prototype.isBefore = function (other: Date): boolean {
  return this.getTime() < other.getTime();
};

Date.prototype.isEqual = function (other: Date): boolean {
  return this.getTime() === other.getTime();
};

Date.prototype.isAfter = function (other: Date): boolean {
  return this.getTime() > other.getTime();
};

Date.prototype.isBetween = function (
  interval: Date.Interval,
  inclusive?: Date.BetweenOptions | boolean,
): boolean {
  const [start, end] = interval;

  if (inclusive === undefined) {
    inclusive = { start: true, end: true };
  }

  if (typeof inclusive === 'boolean') {
    inclusive = { start: inclusive, end: inclusive };
  }

  if (inclusive.start === undefined) {
    inclusive.start = true;
  }

  if (inclusive.end === undefined) {
    inclusive.end = true;
  }

  const conditionalStart = inclusive.start
    ? start.isBefore(this) || this.isEqual(start)
    : start.isBefore(this);

  const conditionalEnd = inclusive.end
    ? end.isAfter(this) || this.isEqual(end)
    : end.isAfter(this);

  return conditionalStart && conditionalEnd;
};
