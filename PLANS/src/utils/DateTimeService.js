import moment from "moment-timezone";
import store from "./store";

class DateTimeService {
  constructor() {
    let defaultTimezone = moment.tz.guess();

    //'Europe/Belgrade'
    //'America/Detroit'
    this.zone = defaultTimezone;
  }

  showDebug() {
    return false; // set true when debugging
  }

  getTimezone() {
    return moment.tz.guess();
  }

  now() {
    // returns moment object with local timezone and now date&time
    return moment.tz(this.getTimezone());
  }

  nowUtc() {
    // returns moment object with UTC and now date&time
    return moment.utc();
  }

  moment(unix) {
    // returns moment object with local timezone
    return moment.unix(unix).utc().tz(this.getTimezone());
  }

  momentUtc(unix) {
    // returns moment object as UTC
    return moment.unix(unix).utc();
  }

  getTimezoneOffset() {
    let zone = this.getTimezone();

    return this.nowUtc().tz(zone).utcOffset();
  }

  format(key) {
    // datetime or time
    return key;
  }

  getTimeformat() {
    if (store.get("timeformat") === "24") {
      return "24";
    }
    return "12";
  }
}

export default new DateTimeService();
