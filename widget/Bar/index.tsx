import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable, bind } from "astal";
import Hyprland from "gi://AstalHyprland";
import { styles } from "../../utils";
import WorkspaceDisplay from "./WorkspaceDisplay";
import Clock from "./Clock";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const hypr = Hyprland.get_default();

  const workspaces = bind(hypr, "workspaces");

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox cssName="centerbox">
        <box
          hexpand
          halign={Gtk.Align.START}
          cssClasses={["workspace-display-container"]}
        >
          <WorkspaceDisplay workspaces={workspaces} />
        </box>
        <box />
        <box hexpand halign={Gtk.Align.END} cssClasses={["clock-container"]}>
          <Clock />
        </box>
      </centerbox>
    </window>
  );
}
