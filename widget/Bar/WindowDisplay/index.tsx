import { Variable, bind } from "astal";
import Hyprland from "gi://AstalHyprland";

export default function WindowDisplay() {
  const hypr = Hyprland.get_default();

  const activeWindowTitle = Variable.derive(
    [bind(hypr, "focusedClient"), bind(hypr, "clients")],
    (client) => client.title,
  );

  return (
    <box>
      <label
        cssClasses={["neutral-text", "window-display"]}
        label={activeWindowTitle()}
      />
    </box>
  );
}
