# Generated data

## Calendar month

The `getCalendarMonth` function returns an object with the data needed to generate the calendar month.

|Property|Description|
|-|-|
|`date`|See the __date__ section below. |
|`calendarValues`|See the __calendarValues__ section below.|

### <a name="date"></a>`date`

This property holds information about the current date of the month (ex: 2022-02-01).

#### object

`Date` object ex: Wed Feb 02 2022 01:00:00 GMT+0100 (Central European Standard Time)

#### currentDate

Number from 1 - 31

#### currentDay
Values: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`

#### currentMonth

Returns an object with the `value` (0-11 match January - December) and `name` (ex: january, febuary etc.) properties.

#### prevMonth

Returns the same object structure as `currentMonth` with information for the previous month.

#### nextMonth

Returns the same object structure as `currentMonth` with information for the previous month.

#### currentYear

Current Year ex: 2022

#### prevYear: number

Previous Year ex: 2021

#### nextYear: number

Previous Year ex: 2023

### <a name="calenderValues"></a>`calendarValues`

The `calendarValues` property has six keys (rows) ranging from 1-6. Each key (row) has an array of seven data fields (columns) for the dates from Sunday to Saturday.

|Sun|Mon|Tue|Wed|Thu|Fri|Sat|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |
| x | x | x | x | x | x | x |

\* _x represent a cell (data[rowNumber][columnNumber]) is a date in the month_

A cell is a data field with the following properties: `type`, `value` and `dataValue`.

### data field attributes

#### `type`

The `type` attribute has a value of `prev`, `current`, or `next`, indicating if the field belongs to the preceding, current or subsequent month.

#### `value`

The `value` attribute is the actual date in the month (1-31).

#### `dateValue`

The `dateValue` attribute is the date string with the format `YYYY-MM-DD`.

## Calendar year

The `getCalendarYear` function returns the calendar year as an object with keys ranging from 0 - 11 (Jan - Feburary). The value corresponds to the data for the calendar month.

Each calendar month object has a `key` property ranging from 0 to 11 (January to December), a `name` (month) property and a [`calenderValues`](#calenderValues) property with data for each day of the month.

```json
[
    {
        "0": {
            "key": 0,
            "name": "january",
            "calendarValues": {
                "1": [
                    {
                        "type": "prev",
                        "value": 1,
                        "dateValue": "2023-01-01"
                    }
                    //...
                ]
                //...
            }
        }
        //...
    }
]
```
