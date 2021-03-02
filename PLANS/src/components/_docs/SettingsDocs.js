import React from "react";
import Settings from "../../utils/SettingsService";
import history from "../../utils/history";

class SettingsDocs extends React.Component {
  componentDidMount() {
    let historyObj = history; // Note: usually you use this.props.history from router

    //examples how to use it, just uncomment those

    Settings.getAll(historyObj).then(function (data) {
      console.log(data);
    });

    // Get full settings object
    Settings.setAll(historyObj, {
      user: {
        device: "MacBook PRO",
        os: "linux",
      },
      timestamp: 123456789,
    });

    // Set key with value (js object)
    // Note .catch is not necessary since is handled via ApiService layer (goes to /error#...)

    // "shortcuts_123": [
    //   {
    //     "id": 34774,
    //     "url": "/api/v2/menu.json?groups%5B%5D=sections&section=intervention.text&organisationId=328&sectionId=34773",
    //     "customTitle": "TEXT PAGE"
    //   },
    //   {
    //     "id": 34778,
    //     "url": "/api/v2/menu.json?groups%5B%5D=sections&section=intervention.text&organisationId=328&sectionId=34778"
    //   },
    //   {
    //     "id": 34775,
    //     "url": "/api/v2/menu.json?groups%5B%5D=sections&section=intervention.text&organisationId=328&sectionId=34775",
    //     "customTitle": "SHORTCUT NAME"
    //   }
    // ]

    Settings.set(historyObj, "shortcuts_1045", [
      {
        id: 34774,
        url:
          "/api/v2/menu.json?groups%5B%5D=sections&section=intervention.text&organisationId=328&sectionId=34773",
      },
      {
        id: 34778,
        url:
          "/api/v2/menu.json?groups%5B%5D=sections&section=intervention.text&organisationId=328&sectionId=34778",
      },
      {
        id: 34775,
        url:
          "/api/v2/menu.json?groups%5B%5D=sections&section=intervention.text&organisationId=328&sectionId=34775",
      },
    ]);
    Settings.set(historyObj, "user", [{ width: 1235 }, { height: 1888 }]);

    // Get specific key (prefix is added automatically)
    Settings.get(historyObj, "shortcuts_1045").then(function (data) {
      console.log(data);
    });
    Settings.get(historyObj, "user").then(function (data) {
      console.log(data);
    });

    // Remove a key
    Settings.remove(historyObj, "shortcuts_123");

    // Remove a key with callback with the remaining settings object
    Settings.remove(historyObj, "shortcuts_123").then(function (obj) {
      // get remaining object without the deleted key
      console.log(obj);
    });

    // Remove whole settings (might be danger)
    Settings.removeAll(historyObj);
  }

  render() {
    return <div>See console.log</div>;
  }
}

export default SettingsDocs;
