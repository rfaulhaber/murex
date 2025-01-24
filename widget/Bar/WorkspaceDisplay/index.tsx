import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable, bind } from "astal";
import Hyprland from "gi://AstalHyprland";
import { sortBy, map, compose } from "ramda";
import WorkspaceButton from "../WorkspaceButton";
import WindowDisplay from "../WindowDisplay";

interface Props {
  workspaces: Hyprland.Workspace[];
}

export default function WorkspaceDisplay({ workspaces }: Props) {
  const hypr = Hyprland.get_default();

  const workspaceToButton = (ws) => (
    <WorkspaceButton
      workspace={ws}
      active={Variable.derive(
        [bind(hypr, "focusedWorkspace")],
        (fws) => fws.id === ws.id,
      )}
    />
  );

  const arrangeButtons = compose(
    map(workspaceToButton),
    sortBy((ws) => ws.id),
  );

  return (
    <centerbox>
      <box hexpand halign={Gtk.Align.START}>
        {workspaces.as(arrangeButtons)}
      </box>
      <WindowDisplay hexapdn halign={Gtk.Align.END} />
    </centerbox>
  );
}
