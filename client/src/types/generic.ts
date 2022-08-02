type ExclusiveUnion<T extends object, U extends object> = Record<
    Exclude<keyof (T & U), Extract<keyof T, keyof U>>,
    unknown
>;

type NonEmptyObject<T extends object> = keyof T extends never ? never : T;

type NonOverlappingKeys<T extends object, M extends object> = Extract<
    keyof T,
    keyof M
> extends never // empty extract returns never
    ? T & M
    : never;

type HeadArgument<T extends CallableFunction> = T extends (
    a1: infer A1,
    ...rest: unknown[]
) => any
    ? A1
    : never;

export type {
    ExclusiveUnion,
    NonEmptyObject,
    NonOverlappingKeys,
    HeadArgument,
};
