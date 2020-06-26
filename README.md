# 📦 vue-props-deep-type
Recursive deep type checking for vuejs props.

## 🥇 Advantage
- You can describe the prop object and its properties.
- You can describe the prop array items.
- You can describe specific value for an prop.
- You can use several types for validation.
## ⚒ Usage

```vue
<script>
import VuePropsDeppType from 'vue-props-deep-type';

const phoneTypes = ['Mobile', 'Work'];

export default {
  props: {
    users: VuePropsDeppType.deep({
      type: Array,
      notClear: true, <!-- Array must have at least one item.
      item: { // <- Describing type for array item
        name: { type: String, required: true },
        age: Number,
        phones: {
          type: Array,
          item: {
            number: { type: [Number, String], required: true}, // <-- number is required and its can be Number or String.
            phone_type: { type: phoneTypes, default: phoneTypes[0] }, // <-- If number_type doesnt exist it will be "Mobile"
          }
        },
      },
      default: [{ // <-- Default value for users.
        name: 'm0ksem',
        age: 20,
        phones: [
          {
            number: 123,
            phone_type: 'Work',
          },
          { number: '1234' }
        ]
      }],
    }),
  },
  
  ...
};
</script>
```
#### TypeScript type
```ts
declare type Phone = {
  number: number
  phone_type: 'Mobile' | 'Work'
}

declare type User = {
  name: string
  age: number
  phones: Phone[]
}
```

## 📄 Docs
// Later.
