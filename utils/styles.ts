type ClassValue = boolean | (() => boolean);

export interface MakeClassObject {
  [index: string]: ClassValue;
}

export function makeClasses(classObj: MakeClassObject): string[] {
  return Object.entries(classObj).reduce((acc: string[], [key, value]) => {
    let val;

    if (typeof value === "function") {
      val = value();
    } else {
      val = value;
    }

    if (val === true) {
      return acc.concat(key);
    }

    return acc;
  }, []);
}
