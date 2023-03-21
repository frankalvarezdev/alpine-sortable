# Alpine.js Sortable
Simple sortable list with Alpine.js

### Demo

🔗 [https://alpine-sortable.vercel.app](https://alpine-sortable.vercel.app)

## Installation

### CDN

```html
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/alpine-sortable@0.1.0/dist/alpine-sortable.min.js"></script>
<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

**ES6 Module on the browser**

```javascript
import Sortable from 'https://cdn.jsdelivr.net/npm/alpine-sortable@0.1.0/dist/alpine-sortable.esm.js'
import Alpine from 'https://esm.sh/alpinejs'
Alpine.plugin(Sortable)
Alpine.start()
```

### NPM

```
npm install alpine-sortable
```

```javascript
import Sortable from 'alpine-sortable'
import Alpine from 'alpinejs'
Alpine.plugin(Sortable)
Alpine.start()
```

## Usage

Directive
```html
<div x-sortable:items="index"></div>
```

Example

```html
<div x-data="{ items: ['Item 1', 'Item 2', 'Item 3', 'Item 4' }">
    <div>
        <template x-for="(item, index) in items" :key="index">
            <div
                x-text="item"
                x-sortable:items="index"
            ></div>
        </template>
    </div>
</div>
```
