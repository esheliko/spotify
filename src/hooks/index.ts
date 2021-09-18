import React, { useState } from "react";

type Empty<T> = { [K in keyof T]: undefined };
type MaybeEmpty<T> = NonNullable<T | { [K in keyof T]: undefined }>;

type DefaultModifiers<S> = { set: (newState: Partial<S>) => void, clear: () => void };
type DefaultModifiersParameters<S, D = DefaultModifiers<S>> = { [K in keyof D]: D[K] extends (...args: infer I) => any ? I : [] };
type ModifierParameters<State, Modifiers> = Modifiers extends (...args: any) => any ?
    Modifiers extends (oldState: MaybeEmpty<State>, ...args: infer I) => any ? I : Parameters<Modifiers> : [];

const emptyObject = <T>(obj: T): Empty<T> => Object.fromEntries(Object.keys(obj).map(key => [key, undefined])) as Empty<T>;

const isFunction = (fn: unknown): fn is Function => (typeof fn === 'function');
const isKey = <T>(key: keyof any, obj: T): key is keyof T => (key in obj);

export function useModifier<State,
    Modifiers extends { [key: string]: Partial<State> | ((...args: [MaybeEmpty<State>, ...any]) => Partial<State>) },
    ModifiersParameters extends DefaultModifiersParameters<State> & { [name in keyof Modifiers]: ModifierParameters<State, Modifiers[name]> },
    SetState extends React.Dispatch<React.SetStateAction<State>> | undefined>
    (initialState: State, modifiers: Modifiers, setState?: SetState): [
        state: State,
        modifyState: <M extends keyof ModifiersParameters>(modifierName: M, ...modifierParameters: ModifiersParameters[M]) => void,
        setState: React.Dispatch<React.SetStateAction<State>>
    ] {
    const [state, defaultSetState] = useState(initialState);

    const stateSetter = setState ?? defaultSetState;

    // Default modifiers
    const setPartialState = (newState: Partial<State>) => {
        stateSetter({
            ...state,
            ...newState
        });
    };
    const clearState = () => {
        let newState: any = {};
        Object.keys(state).forEach(key => {
            newState[key] = undefined
        });
        stateSetter(newState);
    };

    const defaultModifiers: DefaultModifiers<State> = { set: setPartialState, clear: clearState };
    const extendedModifiers: DefaultModifiers<State> & Modifiers = { ...defaultModifiers, ...modifiers };

    const modifyState = <M extends keyof ModifiersParameters>(modifierName: M, ...modifierParameters: ModifiersParameters[M]): void => {
        if (isKey(modifierName, extendedModifiers)) {
            const modifier = extendedModifiers[modifierName];

            const newPartialState = isFunction(modifier) ? modifier(state ?? emptyObject(state), ...modifierParameters) : modifier;
            stateSetter({
                ...state,
                ...newPartialState
            });
        }
    };

    return [state, modifyState, stateSetter];
}