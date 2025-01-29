import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar";

App.start({
  css: style,
  // icons: "./icons",
  main() {
    App.get_monitors().map(Bar);
  },
});
