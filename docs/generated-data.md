# Using calendar values

## Calendar month

`getCalendarMonth` function returns all the data needed to generate the calendar month.

Each calendar month object has a `key` attribute ranging from 0 to 11 (January to December), a `name` attribute and a `data` attribute to generate each field in the calendar.

```typescript
interface CalendarMonth {
    key: number,
    name: string, // january, febuary, march ...
    data: Record<number, Array<{
        type: string, //prev, next or current
        value: number,
        dateValue: string
    }>>
}
```

### `data`

The `data` attribute is an object with 6 keys ranging from 1-6. Each number indicates a row in the calendar. Each key (row) has an array of 7 data fields (columns) for the dates from Sunday to Saturday.

|Sun|Mon|Tue|Wed|Thu|Fri|Sat|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |

\* _x represent a field or a cell with location data[rowNumber][columnNumber]_

Each cell in the calendar represents a data field. A data field has the `type`, `value` and `dataValue` attributes.

### data field attributes

#### `type`

The `type` attribute has a value of `prev`, `current`, or `next`, indicating if the field belongs to the preceding, current or subsequent month.

#### `value`

The `value` attribute is the actual date in the month (0-31).

#### `dateValue`

The `dateValue` attribute is the date string with the format `YYYY-MM-DD`.

## Calendar year

The `getCalendarYear` function returns the calendar year as an object with keys ranging from 0 - 11 (Jan - Feburary). The value corresponds to the data for the calendar month.

```typescript
type CalendarYear = Record<number, CalendarMonth>
```
