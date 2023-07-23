import "primereact/resources/themes/arya-green/theme.css";
import "primereact/resources/primereact.min.css";

import { applyConfig } from "./utils";
import { Bar } from "./components/bar";
import { Layout } from "./components/layout";
import { Drawer } from "./components/drawer";
import { View } from "./components/view";

export const App = () => {
  applyConfig();
  return (
    <div className="app">
      <Bar />
      <Layout>
        <Drawer />
        <View />
      </Layout>
    </div>
  );
};
