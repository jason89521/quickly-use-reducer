export type Action<T extends string = string> = { type: T };
export type PayloadAction<P = any, T extends string = string> = { payload: P; type: T };

export type ActionCreatorWithPayload<P = any, T extends string = string> = (payload: P) => PayloadAction<P, T>;
export type ActionCreatorWithoutPayload<T extends string = string> = () => Action<T>;
export type ActionCreatorFromCR<S, CR> = CR extends (state: S, action: infer A) => S
  ? A extends { payload: infer P }
    ? ActionCreatorWithPayload<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload;
export type ActionCreatorsFromCRs<State, CRs extends CaseReducers<State>> = {
  [Type in keyof CRs]: ActionCreatorFromCR<State, CRs[Type]>;
};

export type CaseReducer<S, A extends Action = PayloadAction> = (state: S, action: A) => S;
export type CaseReducers<S> = Record<string, CaseReducer<S, PayloadAction>>;
export type Reducer<S = any, A extends Action = PayloadAction> = (state: S, action: A) => S;

export type Slice<State, CRs extends CaseReducers<State>> = {
  initialState: State;
  actionCreators: ActionCreatorsFromCRs<State, CRs>;
  reducer: Reducer<State>;
};

export const createAction =
  <T extends string = string>(type: T) =>
  (...args: any[]) => ({ type, payload: args[0] });

export const createSlice = <State, CRs extends CaseReducers<State>>(
  initialState: State,
  reducers: CRs
): Slice<State, CRs> => {
  const reducerNames = Object.keys(reducers);
  const actionCreators = {} as any;

  reducerNames.forEach(reducerName => {
    actionCreators[reducerName] = createAction(reducerName);
  });

  const reducer = (state: State, action: { type: string; payload: any }) => {
    return reducerNames.reduce((prev, curr, index) => {
      const reducerName = reducerNames[index];
      if (action.type !== reducerName) return prev;

      return reducers[reducerName](state, action);
    }, state);
  };

  return {
    initialState,
    actionCreators,
    reducer,
  };
};
