# Quickstart

## Installation

Install the package:

```bash
#npm
npm i calendar-bits

#yarn
yarn add calendar-bits
```

The library is also available via the CDN:

```html
<script src="https://unpkg.com/calendar-bits"></script>
```

## Initialization

```typescript
import { calendar } from 'calendar-bits';

calendar.init({
    dataValue: new Date(), //
    dateChanged: (res) =>  {}
})
```

In the browser, the global object `ClndrBits` is initialized.

```html
<script>
    ClndrBits.calendar.init({
        dataValue: new Date(), //
        dateChanged: (res) =>  {}
    })
</script>
```

The `dateChanged` callback is called after the date has be set with the parameter for the generated [calendar month](generated-data).
