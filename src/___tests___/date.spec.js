import CBDate from '../date';
import dateConsts from '../constants/days'

function formatCalendarValues(result) {
    const endResult = {}
    Object.keys(result).forEach(key => {
        endResult[key] = result[key].map(item => {
            return item.value;
        })
    })
    return endResult;
}

describe('date.js', () => {
    it('sets default date to now', () => {
        const d = new CBDate();
        expect(typeof d.date.current).toBe('object');
    }),

    it('should throw invalid dateValue error', () => {
        try {
            const d = new CBDate({ dateValue: 'ss' });
        } catch (e) {
            expect(e.message).toBe('Invalid argument: dateValue');
        }
    })

    it('sets value', () => {
        const d = new CBDate({ dateValue: '2020-8-28' });
        expect(typeof d.date.current).toBe('object');
        expect(d.date.currentYear).toBe(2020);
        expect(d.date.currentMonth).toBe(7);
        expect(d.date.nextMonth).toBe(8);
        expect(d.date.nextYear).toBe(2021);
        expect(d.date.prevMonth).toBe(6);
        expect(d.date.prevYear).toBe(2019);
    });

    it('should trigger callback after each update', () => {
        const callback = jest.fn();
        const d = new CBDate({ dateChanged: callback });
        d.getPrevMonth();
        d.getNextMonth();
        d.getNextYear();
        d.getPrevYear();
        expect(callback).toHaveBeenCalledTimes(5);
    });

    it('should return formatted date object', () => {
        const d = new CBDate({ dateValue: '2020-8-1' });
        const result = d.getDateValues();
        expect(result.hasOwnProperty('date')).toBe(true);
        expect(result.hasOwnProperty('calendarValues')).toBe(true);
        expect(result.date.currentDate).toBe(1);
        expect(result.date.currentYear).toBe(2020);
        expect(result.date.nextYear).toBe(2021);
        expect(result.date.currentMonth.value).toBe(8);
        expect(result.date.currentMonth.name).toBe('august');
        expect(result.date.nextMonth.name).toBe('september');
        expect(result.date.nextMonth.value).toBe(9);
        expect(result.date.prevMonth.value).toBe(7);
        expect(result.date.prevMonth.name).toBe('july');
        expect(result.date.prevYear).toBe(2019);
    });

    it('set prev month', () => {
        const d = new CBDate({ dateValue: '2020-8-1' });
        d.getPrevMonth();
        expect(d.date.currentMonth).toBe(6);
        expect(d.date.currentYear).toBe(2020);
        expect(d.date.nextMonth).toBe(7);
        expect(d.date.prevMonth).toBe(5);
    });

    it('set next month', () => {
        const d = new CBDate({ dateValue: '2020-8-1' });
        d.getNextMonth();
        expect(d.date.currentMonth).toBe(8);
        expect(d.date.currentYear).toBe(2020);
        expect(d.date.nextMonth).toBe(9);
        expect(d.date.prevMonth).toBe(7);
    });

    it('set next month (currently december)', () => {
        const d = new CBDate({ dateValue: '2020-12-1' });
        d.getNextMonth();
        expect(d.date.currentMonth).toBe(0);
        expect(d.date.currentYear).toBe(2021);
        expect(d.date.nextMonth).toBe(1);
        expect(d.date.nextYear).toBe(2022);
        expect(d.date.prevMonth).toBe(11);
        expect(d.date.prevYear).toBe(2020);
    });

    it('set prev month (currently january)', () => {
        const d = new CBDate({ dateValue: '2020-1-1' });
        d.getPrevMonth();
        expect(d.date.currentMonth).toBe(11);
        expect(d.date.currentYear).toBe(2019);
        expect(d.date.nextMonth).toBe(0);
        expect(d.date.nextYear).toBe(2020);
        expect(d.date.prevMonth).toBe(10);
        expect(d.date.prevYear).toBe(2018);
    });

    it('set next year', () => {
        const d = new CBDate({ dateValue: '2020-1-8' });
        d.getNextYear();
        expect(d.date.currentYear).toBe(2021);
        expect(d.date.nextYear).toBe(2022);
        expect(d.date.prevYear).toBe(2020);

    });

    it('set prev year', () => {
        const d = new CBDate({ dateValue: '2020-1-8' });
        d.getPrevYear();
        expect(d.date.currentYear).toBe(2019);
        expect(d.date.nextYear).toBe(2020);
        expect(d.date.prevYear).toBe(2018);
    });

    it('get number of days for March/2024 (leap year)', () => {
        const d = new CBDate({ dateValue: '2024-3-1' });
        // Feb
        expect(d.getNumberOfDays(dateConsts.monthType.PREV_MONTH)).toBe(29);
        // Mar
        expect(d.getNumberOfDays(dateConsts.monthType.CURRENT_MONTH)).toBe(31);
        // Apr
        expect(d.getNumberOfDays(dateConsts.monthType.NEXT_MONTH)).toBe(30);
    })

    it('should start date Feb/2024 (leap year)', () => {
        // feb
        let d = new CBDate({ dateValue: '2024-2-1' });
        expect(d.getStartDay().name).toBe(dateConsts.days[4]); // thu
        // oct
        d = new CBDate({ dateValue: '2021-10-6' });
        expect(d.getStartDay().name).toBe(dateConsts.days[5]); // fri
    })

    it('should generate calendar values should be correct and in the right format', () => {
        const d = new CBDate({ dateValue: '2021-10-6' });
        const result = d.generateCalendarValues();
        expect(result['1'][0].type).toBe('prev')
        expect(result['1'][0].dateValue).toBe('2021-9-26')
        expect(result['1'][0].value).toBe(26)
        expect(result['6'][6].type).toBe('next')
        expect(result['6'][6].dateValue).toBe('2021-11-6')
        expect(result['6'][6].value).toBe(6)
    })

    it('should generate calendar value', () => {
        let d, result;

        //Feb 2024 (1st day is thu)
        d = new CBDate({ dateValue: '2024-2-1' });
        result = {
            "1": [28, 29, 30, 31, 1, 2, 3],
            "2": [4, 5, 6, 7, 8, 9, 10],
            "3": [11, 12, 13, 14, 15, 16, 17],
            "4": [18, 19, 20, 21, 22, 23, 24],
            "5": [25, 26, 27, 28, 29, 1, 2],
            "6": [3, 4, 5, 6, 7, 8, 9]
        };
        expect(JSON.stringify(formatCalendarValues(d.generateCalendarValues()))).toBe(JSON.stringify(result));

        // March 2024 (Fri)
        d = new CBDate({ dateValue: '2024-3-1' });
        result = {
            "1": [25, 26, 27, 28, 29, 1, 2],
            "2": [3, 4, 5, 6, 7, 8, 9],
            "3": [10, 11, 12, 13, 14, 15, 16],
            "4": [17, 18, 19, 20, 21, 22, 23],
            "5": [24, 25, 26, 27, 28, 29, 30],
            "6": [31, 1, 2, 3, 4, 5, 6]
        };
        expect(JSON.stringify(formatCalendarValues(d.generateCalendarValues()))).toBe(JSON.stringify(result));

        // Sept 2024 (Sun)
        d = new CBDate({ dateValue: '2024-9-1' });
        result = {
            "1": [1, 2, 3, 4, 5, 6, 7],
            "2": [8, 9, 10, 11, 12, 13, 14],
            "3": [15, 16, 17, 18, 19, 20, 21],
            "4": [22, 23, 24, 25, 26, 27, 28],
            "5": [29, 30, 1, 2, 3, 4, 5],
            "6": [6, 7, 8, 9, 10, 11, 12]
        };
        expect(JSON.stringify(formatCalendarValues(d.generateCalendarValues()))).toBe(JSON.stringify(result));

        // April 2022 (Fri)
        d = new CBDate({ dateValue: '2022-04-01' });
        result = {
            "1": [27, 28, 29, 30, 31, 1, 2],
            "2": [3, 4, 5, 6, 7, 8, 9],
            "3": [10, 11, 12, 13, 14, 15, 16],
            "4": [17, 18, 19, 20, 21, 22, 23],
            "5": [24, 25, 26, 27, 28, 29, 30],
            "6": [1, 2, 3, 4, 5, 6, 7]
        };
        expect(JSON.stringify(formatCalendarValues(d.generateCalendarValues()))).toBe(JSON.stringify(result));

        // May 2022 (Sun)
        d = new CBDate({ dateValue: '05-01-2022' });
        result = {
            "1": [1, 2, 3, 4, 5, 6, 7],
            "2": [8, 9, 10, 11, 12, 13, 14],
            "3": [15, 16, 17, 18, 19, 20, 21],
            "4": [22, 23, 24, 25, 26, 27, 28],
            "5": [29, 30, 31, 1, 2, 3, 4],
            "6": [5, 6, 7, 8, 9, 10, 11]
        };
        expect(JSON.stringify(formatCalendarValues(d.generateCalendarValues()))).toBe(JSON.stringify(result));

        // July 2019 (Mon)
        d = new CBDate({ dateValue: '07-01-2019' });
        result = {
            "1": [30, 1, 2, 3, 4, 5, 6],
            "2": [7, 8, 9, 10, 11, 12, 13],
            "3": [14, 15, 16, 17, 18, 19, 20],
            "4": [21, 22, 23, 24, 25, 26, 27],
            "5": [28, 29, 30, 31, 1, 2, 3],
            "6": [4, 5, 6, 7, 8, 9, 10]
        };
        expect(JSON.stringify(formatCalendarValues(d.generateCalendarValues()))).toBe(JSON.stringify(result));

        // Jan 2000 (Sat)
        d = new CBDate({ dateValue: '01-01-2000' });
        result = {
            "1": [26, 27, 28, 29, 30, 31, 1],
            "2": [2, 3, 4, 5, 6, 7, 8],
            "3": [9, 10, 11, 12, 13, 14, 15],
            "4": [16, 17, 18, 19, 20, 21, 22],
            "5": [23, 24, 25, 26, 27, 28, 29],
            "6": [30, 31, 1, 2, 3, 4, 5]
        };
        expect(JSON.stringify(formatCalendarValues(d.generateCalendarValues()))).toBe(JSON.stringify(result));
    })

    it('should generate calendar values correctly', () => {
        //Feb 2024 (1st day is thu)
        const d = new CBDate({ dateValue: '2024-2-1' });
        const result = d.generateCalendarValues();
        expect(result[1][0].dateValue).toBeDefined();
    })

})
