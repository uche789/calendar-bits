# API

CalenderBits exposes a couple of functions to refresh the date values.

## `init`

CalenderBits must first be initialized before it can be used.

```typescript
calendar.init({
    dataValue: new Date(), // Date object, number or YYYY-MM-DD string
    dateChanged: (res) =>  {} // callback after the date has been set
})
```

## `setDate`

You can set the date for the calendar. This will refresh the data to reflect the correct month and year.

```typescript
calendar.setDate('2020-01-21')
```

## `getNextMonth`

Generate values for the next month. This will refresh the calendar year data if necessary.

```typescript
calendar.getNextMonth()
```

## `getNextYear`

Generate values for the next year.

```typescript
calendar.getNextYear()
```

## `getPrevMonth`

Generate values for the previous month. This will refresh the calendar year data if necessary.

```typescript
calendar.getPrevMonth()
```

## `getPrevYear`

Generate values for the previous year.

```typescript
calendar.getPrevYear()
```

## `getCalendarMonth`

Returns the calendar month values.

```typescript
calendar.getCalendarMonth()
```

## `getCalendarYear`

Returns the calendar year values.

```typescript
calendar.getCalendarYear()
```
