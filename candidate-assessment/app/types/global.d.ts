declare global {
  var test: (name: string, fn: () => void) => void;
  var expect: (actual: any) => {
    toBe: (expected: any) => void;
    toThrow: (message: string) => void;
  };
  var Post: any;
  var User: any;
  var Feed: any;
}

export {} 