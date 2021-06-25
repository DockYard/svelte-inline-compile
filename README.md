# svelte-inline-compile

This babel transforms allows for a much more pleasant experience when testing svelte components
using Jest and `@testing-library/svelte`.


## Why does this exists

This is how you use our components when developing your app:

```html
<script>
  import Rental from './Rental.svelte';
  let item = {
    search: 'Country cottage',
    location: {name: 'Orange County'},
    results: [{name: 'one'}, {name: 'two'}]
  };
</script>

<Rental {item} />
```

However, you are expected to test your components using this totally different API:

```js
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'
import Rental from './Rental.svelte'

let item = {
  search: 'Country cottage',
  location: {name: 'Orange County'},
  results: [{name: 'one'}, {name: 'two'}]
};

test('Renders the detailed info of the list', async () => {
  const { getByTestId } = render(Rental, { item });
  expect(getByTestId('rental-header')).toHaveTextContent('Results in Orange County');
});
```

It's not ideal that you have to test use your components in tests in a very different way from how you
use them regularly.

But that's not all. This syntax doesn't support many of the features that make svelte components so flexible,
like having slots or yielding properties back up to the parent scope using those slots. Not to mention that some 
components are meant to be used in conjunction with other components or DOM elements.

Imagine want to test a component that you use like this:
```html
<script>
  import Rental from './Rental.svelte';
  import CompanionComponent from './Rental.svelte';
  let item = {
    search: 'Country cottage',
    location: {name: 'Orange County'},
    results: [{name: 'one'}, {name: 'two'}]
  };
</script>

<div>Some content before</div>
<Rental {item} let:location let:results>
  <h1 slot="header">{results.length} results in {location.name}</h1>
  <p slot="footer">Copyright (c) DockYard</p>      
</Rental>
<div>Some more content after</div>
<CompanionComponent />
```

Well, good look with that, you can't. 

Component testing should not be that hard. You should be able to test your components the same way you use them.

## Installing svelte-inline-compile

Steps:
1. Install the component as a dev dependency with `npm install --save-dev svelte-inline-compile`.
2. Add `svelte-inline-compile` to the list of babel plugins in your `babel.config.js` (or similar config file):
```js
module.exports = {
  "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]],
  "plugins": ["svelte-inline-compile"]
}%
```
3. Add `import svelte from 'svelte-intl-compile'` and start writing tests like you write your application code:

```js
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'
import svelte from 'svelte-inline-compile';

test('Renders the detailed info of the list', async () => {
  const { getByTestId } = render(svelte`
    <script>
      import Rental from './Rental.svelte';
      import CompanionComponent from './Rental.svelte';
      let item = {
        search: 'Country cottage',
        location: {name: 'Orange County'},
        results: [{name: 'one'}, {name: 'two'}]
      };
    </script>

    <div>Some content before</div>
    <Rental {item} let:location let:results>
      <h1 slot="header">{results.length} results in {location.name}</h1>
      <p slot="footer">Copyright (c) DockYard</p>      
    </Rental>
    <div>Some more content after</div>
    <CompanionComponent />  
  `);
  expect(getByTestId('rental-header')).toHaveTextContent('7 results in Orange County');
});
```

It's not only much nicer, it allows you to test things you couldn't even consider testing before.

