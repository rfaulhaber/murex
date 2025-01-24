import { Gtk } from "astal/gtk4";
import { Variable } from "astal";

export default function Clock() {
  const time = Variable("");

  const makeDateStr: string = (): string => {
    const dateFormat = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    return dateFormat.format(new Date());
  };

  setInterval(function () {
    const dateStr = makeDateStr();

    time.set(dateStr);
  }, 1000);

  return (
    <box>
      <label cssClasses={["neutral-text"]} label={time()} />
    </box>
  );
}
