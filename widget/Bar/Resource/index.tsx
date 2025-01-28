import { Variable } from "astal";
import { makeClasses } from "../../../utils";

export interface ResourceProps<T> {
  cmd: string;
  symbol: string;
  formatter: (T) => string;
  refreshRate?: number;
}

export default function Resource<T>({
  cmd,
  symbol,
  formatter,
  refreshRate,
}: ResourceProps<T>) {
  const resourceLoad = Variable(0).poll(
    refreshRate ?? 1000,
    ["nu", "-c", cmd],
    (out, prev) => formatter(out),
  );

  const resourceSymbolStyles = Variable.derive([resourceLoad], (load) =>
    makeClasses({
      "resource-symbol": true,
      "resource-load-1": load <= 40,
      "resource-load-2": load > 40 && load <= 60,
      "resource-load-3": load > 60 && load <= 80,
      "resource-load-4": load > 80 && load <= 90,
      "resource-load-5": load > 90,
    }),
  );

  return (
    <box halign cssClasses={["resource-container"]}>
      <image cssClasses={resourceSymbolStyles()} iconName={symbol} />
      <label
        cssClasses={["resource-text"]}
        label={resourceLoad((value) => `${value}%`)}
      />
    </box>
  );
}
