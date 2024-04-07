import dateConsts from './constants/days'

/**
 * @typedef {Object} DateObject
 * @property {Date} date.current - current date
 * @property {number} date.currentYear
 * @property {number} date.currentMonth
 * @property {number} date.prevMonth
 * @property {number} date.prevYear
 * @property {number} date.nextMonth
 * @property {number} date.nextYear
 */
/**
 * @typedef DateCell
 * @property {string} type
 * @property {number} value
 * @property {string} dateValue
 */
/**
 * @typedef CalendarValues
 * @type {Object.<number, Array.<DateCell>}
 */

/**
 * @returns {DateObject}
 */
function getDefaultDate() {
    return {
        current: null,
        currentYear: 0,
        currentMonth: 0,
        prevMonth: 0,
        prevYear: 0,
        nextMonth: 0,
        nextYear: 0
    }
}

export default class CBDate {
    /**
     * @param {object} options - date initialization object
     * @param {string | number | Date} options.dateValue - valid object
     * @param {string} options.dateChanged - function called after each update
     */
    constructor({ dateValue = '', dateChanged = () => { } } = {}) {
        this.init({ dateValue, dateChanged })
    }

    /**
     * @typedef CalendarConfig
     * @type {object}
     * @property {string | number | Date} dateValue
     * @property {Function} dateChanged
     * 
     * @param {CalendarConfig} param0
     */
    init({ dateValue = '', dateChanged = () => { } } = {}) {
        if (typeof dateChanged !== 'function') {
            throw new Error('Invalid argument: dateChanged should be a functon');
        }

        this.date = getDefaultDate();
        this.dateChanged = dateChanged;
        this.setDate(dateValue);
    }

    /**
     * set this.date values
     * @param {string | number | Date} dateValue 
     */
    setDate(dateValue) {
        if (dateValue && (new Date(dateValue)).toDateString() === 'Invalid Date') {
            throw new Error("Invalid argument: dateValue");
        }

        this.date.current = dateValue ? new Date(dateValue) : new Date();
        this.date.currentYear = this.date.current.getFullYear();
        this.date.currentMonth = this.date.current.getMonth();
        this.refreshDateValues();
    }

    setCurrentDate() {
        this.date.current = new Date(this.date.currentYear, this.date.currentMonth, 1);
    }

    getPrevYear() {
        this.date.currentYear--;
        this.setCurrentDate();
        this.refreshDateValues();
    }

    getNextYear() {
        this.date.currentYear++;
        this.setCurrentDate();
        this.refreshDateValues();
    }

    getPrevMonth() {
        // if the current month is January, set current month to December and subtract one from the year
        if (this.date.currentMonth === 0) {
            this.date.currentMonth = 11;
            this.date.currentYear = (new Date(this.date.current.setYear(this.date.currentYear - 1))).getFullYear();
        } else {
            this.date.currentMonth--;
        }

        this.date.current = new Date(this.date.currentYear, this.date.currentMonth, 1);
        this.setCurrentDate();
        this.refreshDateValues();
    }

    /**
     * Set to the next month
     */
    getNextMonth() {
        // if the current month is December, set current month to January and add one to the year
        if (this.date.currentMonth >= 11) {
            this.date.currentMonth = 0;
            this.date.currentYear = (new Date(this.date.current.setYear(this.date.currentYear + 1))).getFullYear();
        } else {
            this.date.currentMonth++;
        }

        this.setCurrentDate();
        this.refreshDateValues();
    }

    /**
     * Refreshes the date for the given day, month and year
     */
    refreshDateValues() {
        // If the current month is January, prev month should be December
        if (this.date.currentMonth === 0) {
            this.date.prevMonth = 11;
        } else {
            // Set to previous month
            this.date.prevMonth = this.date.currentMonth - 1;
        }

        // If the current month is December, next month should be January
        if (this.date.currentMonth === 11) {
            this.date.nextMonth = 0;
        } else {
            // Set to next month
            this.date.nextMonth = this.date.currentMonth + 1;
        }

        this.date.prevYear = this.date.currentYear - 1;
        this.date.nextYear = this.date.currentYear + 1;
        this.dateChanged(this.getDateValues());
    }

    /**
     * Get the number of days in a month in a year
     * @param {number} type - nextMonth or lastMonth type 
     * @returns {number}
     */
    getNumberOfDays(type) {
        if (type === dateConsts.monthType.CURRENT_MONTH) {
            return new Date(this.date.currentYear, this.date.currentMonth + 1, 0).getDate();
        }

        if (type === dateConsts.monthType.PREV_MONTH) {
            return new Date(this.getValidYearForMonth(type), this.date.prevMonth + 1, 0).getDate();
        }

        if (type === dateConsts.monthType.NEXT_MONTH) {
            return new Date(this.getValidYearForMonth(type), this.date.nextMonth + 1, 0).getDate();
        }
    }

    /**
     * Returns valid for the prev, current or next month
     * @param {number} type - prev = 0, current = 1, next = 2
     * @returns {string} valid year
     */
    getValidYearForMonth(type) {
        if (type === dateConsts.monthType.PREV_MONTH) {
            return (
                this.date.currentMonth === 0 && this.date.prevMonth === 11
                    ? this.date.prevYear
                    : this.date.currentYear
            );
        }

        if (type === dateConsts.monthType.NEXT_MONTH) {
            return (
                this.date.currentMonth === 11 && this.date.nextMonth === 0
                    ? this.date.nextYear
                    : this.date.currentYear
            );
        }

        return this.date.currentYear;
    }

    /**
     * Get day index (0 = mon, 1 = tue etc.)
     * @typedef {Object} StartDay
     * @property {number} key - key number for date ex: 0, 1, 2 etc...
     * @property {string} name - Day name ex: sun, mon, tue, etc...
     */
    /**
     * @returns {StartDay}
     */
    getStartDay() {
        const key = new Date(this.date.currentYear, this.date.currentMonth, 1).getDay();
        return {
            key,
            name: dateConsts.days[key],
        };
    }

    /**
     * Generates an object with a 6 rows, each contain exactly 7 items (6x7)
     * The dates are generated using values from previous, current and next month
     * Each row represents a week
     * Each column represents a day in the week starting from sun - mon
     * 
     * @returns {CalendarValues} - values to generate calendar
     */
    generateCalendarValues() {
        const startDay = this.getStartDay(); // goes from 0 - 6 (sun - sat)
        const noOfDaysCurrentMnth = this.getNumberOfDays(dateConsts.monthType.CURRENT_MONTH);
        const noOfDaysPrevMnth = this.getNumberOfDays(dateConsts.monthType.PREV_MONTH);

        // get the number of days carried over from the prev month
        const carryOverDaysFromPrevMnth = startDay.key - 1;
        // calculate the earliest possible start date
        let startingValueForPrevMnth = noOfDaysPrevMnth - carryOverDaysFromPrevMnth;

        // Set first row
        let nextRow = 1;
        const rows = {
            [nextRow]: [],
        };

        // value used to fill array
        let currentDate = 1;
        let nextDate = 1;

        // fill row
        for (let col = 1; col <= 42; col++) {
            // start by filling columns with carry over from previous month
            if (startingValueForPrevMnth <= noOfDaysPrevMnth) {
                rows[nextRow].push({
                    type: 'prev',
                    value: startingValueForPrevMnth,
                    dateValue:
                        `${this.getValidYearForMonth(dateConsts.monthType.PREV_MONTH)}-${this.date.prevMonth + 1}-${startingValueForPrevMnth}`
                });
                startingValueForPrevMnth++;
            } else if (currentDate <= noOfDaysCurrentMnth) {
                // fill in the rows for the current date

                rows[nextRow].push({
                    type: 'current',
                    value: currentDate,
                    dateValue: `${this.date.currentYear}-${this.date.currentMonth + 1}-${currentDate}`
                });
                currentDate++;
            } else {
                // fill in the rest
                rows[nextRow].push({
                    type: 'next',
                    value: nextDate,
                    dateValue:
                        `${this.getValidYearForMonth(dateConsts.monthType.NEXT_MONTH)}-${this.date.nextMonth + 1}-${nextDate}`
                });
                nextDate++;
            }

            // fill until you reach the end of the row which has 7 columns
            // then continue to the next row 
            if (col % 7 === 0 && nextRow !== 6) {
                nextRow++;
                rows[nextRow] = [];
            }
        }
        return rows;
    }

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
     * Returns a formatted object that contains the necessary date information
     * to generate a calendar for a given month
     * @returns {FormattedDateProp} date properties and calendar values
     */
    getDateValues() {
        return {
            date: {
                object: this.date.current,
                currentDate: this.date.current.getDate(),
                currentDay: dateConsts.days[this.date.current.getDay()],
                currentMonth: {
                    value: this.date.currentMonth + 1,
                    name: dateConsts.months[this.date.currentMonth]
                },
                prevMonth: {
                    value: this.date.prevMonth + 1,
                    name: dateConsts.months[this.date.prevMonth]
                },
                nextMonth: {
                    value: this.date.nextMonth + 1,
                    name: dateConsts.months[this.date.nextMonth],
                },
                currentYear: this.date.currentYear,
                prevYear: this.date.prevYear,
                nextYear: this.date.nextYear,
            },
            calendarValues: this.generateCalendarValues(),
        }
    }
}
