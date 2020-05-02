interface Options {
  timeout?: number;
  shouldKeepAlive?: () => boolean;
}

export default function keepAlive<T> (
  getKeepAliveValue: () => T,
  options?: Options,
): (source: AsyncIterable<T>) => AsyncIterable<T>
