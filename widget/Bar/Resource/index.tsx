import { Gtk } from "astal/gtk4";
import { Variable } from "astal";
import { makeClasses } from "../../../utils";

export interface ResourceProps<T> {
  cmd: string;
  symbol?: string;
  label?: string;
  formatter: (T) => string;
  refreshRate?: number;
}

export default function Resource<T>({
  cmd,
  symbol,
  label,
  formatter,
  refreshRate,
}: ResourceProps<T>) {
  const resourceLoad = Variable(0).poll(
    refreshRate ?? 1000,
    ["nu", "-c", cmd],
    (out, prev) => formatter(out),
  );

  const resourceTextStyles = Variable.derive([resourceLoad], (load) =>
    makeClasses({
      "resource-text": true,
      "resource-load-1": load <= 40,
      "resource-load-2": load > 40 && load <= 60,
      "resource-load-3": load > 60 && load <= 80,
      "resource-load-4": load > 80 && load <= 90,
      "resource-load-5": load > 90,
    }),
  );

  return (
    <box
      orientation={Gtk.Orientation.VERTICAL}
      cssClasses={["resource-container"]}
      onDestroy={() => {
        resourceLoad.drop();
      }}
    >
      <label
        halign={Gtk.Align.START}
        cssClasses={["resource-label"]}
        label={label}
      />
      <label
        cssClasses={resourceTextStyles()}
        label={resourceLoad((value) => `${value}%`)}
      />
    </box>
  );
}
