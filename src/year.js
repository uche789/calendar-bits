import dateConsts from './constants/days'

/**
 * @typedef CalendarYear
 * @type {Object.<number, CalendarMonth>}
 * 
 * @typedef CalendarMonth
 * @property {number} key
 * @property {string} name
 * @property {CalendarValues} calendarValues
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

export default class Year {
    /** @type CalendarValues */
    calendarYear;

    /**
     * 
     * @param {string | number | Date} dateValue 
     */
    setDate(dateValue) {
        if (dateValue && (new Date(dateValue)).toDateString() === 'Invalid Date') {
            throw new Error("Invalid argument: dateValue");
        }
        
        this.date = dateValue ? new Date(dateValue) : new Date();
        this.generate();
    }

    /**
     * Get day index (0 = mon, 1 = tue etc.)
     * @typedef {Object} StartDay
     * @property {number} key - key number for date ex: 0, 1, 2 etc...
     * @property {string} name - Day name ex: sun, mon, tue, etc...
     */
    /**
     * 
     * @param {number} year 
     * @param {number} month 
     * @returns {StartDay}
     */
    getStartDay(year, month) {
        const key = new Date(year, month, 1).getDay();
        return {
            key,
            name: dateConsts.days[key],
        };
    }

    /**
     * @param {number} type - nextMonth or lastMonth type 
     * @param {number} currentMonth
     * @param {number} month - next or previous month
     * @param {number} currentYear 
     * @returns 
     */
    getValidYearForMonth(type, currentMonth, month, currentYear) {
        if (type === dateConsts.monthType.PREV_MONTH) {
            return (
                currentMonth === 0 && month === 11
                ? currentYear -= 1
                : currentYear
            );
        }
    
        if (type === dateConsts.monthType.NEXT_MONTH) {
            return (
                currentMonth === 11 && month === 0
                ? currentYear += 1
                : currentYear
            );
        }

        return currentYear;
    }

    /**
     * @param {number} currentMonth - current
     * @param {number | null} month - previous or next month
     * @param {number} year - current year
     * @param {number} type - nextMonth or lastMonth type
     * @returns {Date}
     */

    getNumberOfDays(currentMonth, month, year, type = null) {
        if (type === dateConsts.monthType.NEXT_MONTH || type === dateConsts.monthType.PREV_MONTH) {
            return new Date(this.getValidYearForMonth(type, currentMonth, month, year), month + 1, 0)
                .getDate();
        }

        return new Date(year, currentMonth + 1, 0).getDate();
    }

    /**
     * @param {number} type - nextMonth or lastMonth type
     * @param {number} currentMonth 
     * @returns {number}
     */
    getMonth(type, currentMonth) {
        if (type === dateConsts.monthType.PREV_MONTH) {
            if (currentMonth === 0) {
                return 11;
            } else {
                return currentMonth - 1;
            }
        }

        if (type === dateConsts.monthType.NEXT_MONTH) {
            if (currentMonth === 11) {
                return 0;
            } else {
                return currentMonth + 1;
            }
        }

        return 0;
    }

    generate() {
        /** @type {CalendarYear} */
        const months = {};

        for (let i = 0; i <= 11; i++) {
            months[i] = {
                key: i,
                name: dateConsts.months[i],
                calendarValues: this.generateCalendarValues(i)
            };
        }

        this.calendarYear = months;
    }

    /**
     * @returns {CalendarYear}
     */
    getCalendarYear() {
        return this.calendarYear;
    }

    /**
     * 
     * @param {number} month 
     * @returns {CalendarValues}
     */
     generateCalendarValues(month) {
        const year = this.date.getFullYear();
        const nextMonth = this.getMonth(dateConsts.monthType.NEXT_MONTH, month);
        const prevMonth = this.getMonth(dateConsts.monthType.PREV_MONTH, month);
        const startDay = this.getStartDay(year, month);
        const noOfDaysCurrentMnth = this.getNumberOfDays(
            month,
            month,
            year,
            dateConsts.monthType.CURRENT_MONTH,

        );
        const noOfDaysPrevMnth = this.getNumberOfDays(
            month,
            prevMonth,
            year,
            dateConsts.monthType.PREV_MONTH
        );

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
                        `${this.getValidYearForMonth(
                            dateConsts.monthType.PREV_MONTH,
                            month,
                            prevMonth,
                            year
                        )}-${prevMonth+1}-${startingValueForPrevMnth}`
                });
                startingValueForPrevMnth++;
            } else if (currentDate <= noOfDaysCurrentMnth) {
                // fill in the rows for the current date

                rows[nextRow].push({
                    type: 'current',
                    value: currentDate,
                    dateValue: `${year}-${month+1}-${currentDate}`
                });
                currentDate++;
            } else {
                // fill in the rest
                rows[nextRow].push({
                    type: 'next',
                    value: nextDate,
                    dateValue: 
                        `${this.getValidYearForMonth(
                            dateConsts.monthType.NEXT_MONTH,
                            month,
                            nextMonth,
                            year,
                        )}-${nextMonth+1}-${nextDate}`
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
}