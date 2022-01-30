import Calendar from './date';
import Year from './year';


const c = new Calendar();
const y = new Year();

// todo: update year if necessary

/**
 * @typedef KeyName
 * @property {string} name
 * @property {number} value
 * 
 * Date property containing information about prev date/month, current date/month and next date/month
 * @typedef DateProp
 * @property {object} current
 * @property {number} currentDate
 * @property {string} currentDay
 * @property {KeyName} currentMonth
 * @property {number} currentYear
 * @property {KeyName} prevMonth
 * @property {number} prevYear
 * @property {KeyName} nextMonth
 * @property {number} nextYear
 */
/**
 * Data property and values for calendar creation
 * @typedef FormattedDateProp
 * @property {DateProp} date - date properties
 * @property {CalendarValues} calendarValues - values to generate calendar
 */
/**
 * @typedef DateCell
 * @property {string} type
 * @property {number} value
 * @property {string} dateValue
 */
 /**
 * Value that can be used to generate a calendar
 * Consists of 6 rows with 7 columns each
 * Each row represents a week
 * Each column represents a day in the week starting from sun - mon
 * @typedef CalendarValues
 * @type {Object.<number, Array.<DateCell>}
 */

const calendar = {
    /**
     * @callback DateChangedFn
     * @param {FormattedDateProp} param
     */
    /**
     * @typedef CalendarConfig
     * @property {string | number | Date} dateValue
     * @property {DateChangedFn} dateChanged
     * 
     * @param {CalendarConfig} args
     */
    init: (args) => {
        c.init(args);
        y.setDate(args.dateValue);
    },
    /**
     * @param {string | number | Date} dateValue 
     */
    setDate: (dateValue) => {
        c.setDate(dateValue);
        y.setDate(dateValue);
    },
    getNextMonth: () => {
        c.getNextMonth()
        resetYear();
    },
    getNextYear: () => {
        c.getNextYear();
        resetYear();
    },
    getPrevMonth: () => {
        c.getPrevMonth();
        resetYear();
    },
    getPrevYear: () => {
        c.getPrevYear();
        resetYear();
    },
    getCalendarMonth: () => c.getDateValues(),
    getCalendarYear: () => y.getCalendarYear(),
}

function resetYear() {
    if (c.date.currentYear !== y.date.getFullYear()) {
        y.setDate(c.date.current);
    }
}

export { calendar };
