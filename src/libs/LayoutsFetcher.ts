import Layout from "../ui/Layout";

export default class LayoutFetcher {
  static fetchLayouts(): Promise<Layout[]> {
    return fetch("./maps/index.json")
      .then((response) => response.json())
      .then((data) => {
        return Promise.all(data.map((x: string) => {
          return fetch(`./maps/${x}`)
            .then((response) => response.json())
            .then((data) => {
              return Layout.fromJson(data);
            });
        }));
      });
  }
}