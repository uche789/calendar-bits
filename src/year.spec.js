import Year from './year';

describe('year.js', () => {
    it('should set date', () => {
        const y = new Year();
        y.setDate(new Date(1643379945427));
        expect(y.date.getFullYear()).toBe(2022);
        expect(y.date.getMonth()).toBe(0);
        expect(y.date.getDate()).toBe(28);
    })

    it('should generate values after setting date', () => {
        const y = new Year();
        const stubGenerate = jest.spyOn(y, 'generate');
        y.setDate(new Date(1643379945427));
        expect(stubGenerate).toHaveBeenCalled();
    })

    it('should generate data', () => {
        const y = new Year();
        y.setDate(new Date(1643379945427)); //2022-01-28
        const result = y.getCalendarYear();

        expect(Object.keys(result).length).toBe(12);
        expect(result[0].key).toEqual(0);
        expect(result[0].name).toEqual('january');
        expect(Array.isArray(result[0].calendarValues[1])).toBeTruthy();
        expect(result[0].calendarValues[1][0].dateValue).toBeTruthy();
        expect(!!result[0].calendarValues[1][0].type).toBeTruthy();
        expect(!!result[0].calendarValues[1][0].value).toBeTruthy();
    })

    it('should correct fetch dates from previous year', () => {
        const y = new Year();
        y.setDate(new Date(1643379945427)); //2022-01-28
        const result = y.getCalendarYear();

        // get last month
        expect(result[0].name).toEqual('january');
        // fetch first cell in first row of month calendar
        expect(result[0].calendarValues[1][0].dateValue).toMatch(/2021-12-26/);
    })

    it('should correct fetch dates from next year', () => {
        const y = new Year();
        y.setDate(new Date(1643379945427)); //2022-01-28
        const result = y.getCalendarYear();

        // get last month
        expect(result[11].name).toEqual('december');
        // fetch last cell in last row of month calendar
        expect(result[11].calendarValues[6][6].dateValue).toMatch(/2023-1-7/);
    })
});