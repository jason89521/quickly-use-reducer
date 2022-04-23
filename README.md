# Quickly Use Reducer

Use this package to generate reducer and action creators automatically. All you need to do is passing the initial state and an object which contains all case reducers.

## Example

```tsx
import type { PayloadAction } from 'quickly-use-reducer';
import { createSlice } from 'quickly-use-reducer';

const slice = createSlice([] as Todo[], {
  setTodos: (state, action: PayloadAction<Todo[]>) => action.payload,
  addTodo: (state, action: PayloadAction<Todo>) => [...state, action.payload],
  checkTodo: (state, action: PayloadAction<{ id: string; checked: boolean }>) => {
    const { id, checked } = action.payload;
    return state.map(todo => {
      if (todo.id === id) return { ...todo, isCompleted: checked };

      return todo;
    });
  },
  deleteTodo: (state, action: PayloadAction<string>) => state.filter(todo => todo.id !== action.payload),
});

const {
  initialState,
  actionCreators: { setTodos, addTodo, checkTodo, deleteTodo },
  reducer,
} = slice;

const TodoApp = () => {
  const [todos, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => dispatch(deleteTodo(todo.id))}>
          {todo.content}
        </div>
      ))}
    </div>
  );
};
```

## API reference

### `createSlice`

#### Parameters

`createSlice` accepts two parameters, and these parameters are all required.

##### `initialState`

The initial state of your reducer. It helps `createSlice` to generate correct action creators.

##### `reducers`

An object contains all your case reducers. A case reducer is a piece of the main reducer, it works like a normal reducer, but only handles one case.

A case reducer can accepts 0 ~ 2 parameters, and should return a new state with the same type of the initial state.

```ts
const slice = createSlice(0, {
  // 0 parameter
  reset: () => 0,
  // 1 parameter
  increment: state => state + 1,
  // 2 parameters
  // typescript: (state, action: PayloadAction<number>) => state + action.payload
  add: (state, action) => state + action.payload,
});
```

#### Return

`createSlice` will return an object which contains `initialState`, `actionCreators` and `reducer`.

##### `initialState`

The same as the first parameter.

##### `actionCreators`

A object contains all action creators, their name are the same as the `reducers`' property. For example the above `slice` will generate an `actionCreators` object which contains `reset`, `increment` and `add`.

```ts
const { reset, increment, add } = slice.actionCreators;
```

##### `reducer`

A reducer function. You can pass it to `useReducer` directly.

```ts
const [state, dispatch] = useReducer(slice.reducer, slice.initialState);
```
