# CalendarBits

CalendarBits is a lightweight library for building calendar or date picker UI without the tedious groundwork.

## Installation

- Via the CDN: `<script src="https://unpkg.com/calendar-bits"></script>`
- Npm package:

  ```bash
  #npm
  npm i calendar-bits

  #yarn
  yarn add calendar-bits
  ```

## Usage

```javascript
calendar.init({
    dateValue: new Date(), // Date object, number or YYYY-MM-DD string
    dateChanged: () => {}
});
```

## Documentation

See the [docs](./docs/index.md) for detailed information.

## License

[MIT](https://opensource.org/licenses/MIT)
