---
"@salt-ds/lab": minor
---

- Changed `StepperInput`'s `onChange` to return a value and an optional event.
- Replaced functionality of Page up and Page down keys in `StepperInput` with Shift + Up arrow and Shift + Down arrow. These keyboard controls change the value by the `block` amount.

```tsx
<StepperInput
  value={value}
  onChange={(_event, value) => {
    setValue(value);
  }
/>
```