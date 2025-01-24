import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable, bind } from "astal";
import { makeClasses } from "../../../utils/styles";

interface Props {
  workspace: Hyprland.Workspace;
  active: boolean;
}

export default function WorkspaceButton({ workspace, active }: Props) {
  const classes = Variable.derive([active], (isActive) =>
    makeClasses({
      "workspace-button": true,
      focused: isActive,
    }),
  );

  return (
    <button cssClasses={classes()} onClicked={() => workspace.focus()}>
      <label label={workspace.id.toString()} />
    </button>
  );
}
