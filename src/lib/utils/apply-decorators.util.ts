export function applyMethodDecorators(...decorators: MethodDecorator[]) {
  return <Target extends object, Value>(
    target: Target,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Value>,
  ) => {
    for (const decorator of decorators) {
      decorator(target, propertyKey, descriptor);
    }
  };
}
