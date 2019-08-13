import { Asset, Font } from "expo";
import React from "react";
import { Dimensions, Platform, View } from "react-native";
import StargazerNavigator from "./Navigator";
import { mapRouteConfigToStargazerRouteMap, } from "./utils";
let SCREENSHOTS = [];
/* =============================================================================
Root component for the Stargazer App.
============================================================================= */
class Stargazer extends React.Component {
    constructor(props) {
        super(props);
        this.captureImage = async (image, finalScreen) => {
            /**
             *
             * NOTE: Just mutate SCREENSHOTS array so we don't incur the performance
             * cost of copying it every time we add an image.
             */
            // @ts-ignore
            SCREENSHOTS.push(image);
            this.logger(`(${SCREENSHOTS.length}) - Snapshot recorded for screen: ${image.name}`);
            if (finalScreen) {
                await this.uploadImageData();
            }
        };
        this.uploadImageData = async () => {
            try {
                await Promise.race([timeoutUploadSafeguard(), this.postScreenshots()]);
            }
            catch (err) {
                console.log(err);
            }
            /**
             * Reset screenshots array.
             */
            SCREENSHOTS = [];
        };
        this.postScreenshots = async () => {
            const { height, width } = Dimensions.get("window");
            this.logger(`\nUploading ${SCREENSHOTS.length} screenshots to Stargazer Server at URL: ${this.props.stargazerServerUrl}`);
            try {
                await fetch(this.props.stargazerServerUrl, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        width,
                        height,
                        os: Platform.OS,
                        photos: SCREENSHOTS,
                    }),
                });
                this.logger("Upload complete!!! Stargazer idle 🔭\n");
            }
            catch (err) {
                console.log("Upload failed... Did you provide the correct stargazerServerUrl prop and run the Stargazer Server (npm run stargazer:server)? The stargazerServerUrl must be your current computer's IP address.", err);
            }
        };
        this.logger = (message) => {
            if (!this.props.disableLogging) {
                console.log(message);
            }
        };
        this.state = {
            loading: true,
        };
    }
    async componentDidMount() {
        await this.preloadAssets();
        /**
         * TODO: We should add some validation for the stargazerServerUrl when
         * this component mounts to validate that the provided value is valid
         * and uses an IP.
         *
         * We could even add a GET health check to the server and make a fetch
         * request here to verify we can talk to the server as soon as the app
         * starts up, and immediately give the user feedback the provided
         * stargazerServerUrl is invalid. This would be ideal.
         *
         * This should allow us to then remove the timeoutUploadSafeguard method
         * used in the upload process below.
         */
        this.setState({
            loading: false,
        });
    }
    render() {
        if (this.state.loading) {
            return <View style={{ flex: 1 }}/>;
        }
        const { autoStart, routeConfig, appRouteConfig, backgroundColor, defaultNavigationOptions, } = this.props;
        /**
         * Get final route map for Stargazer.
         */
        const routes = mapRouteConfigToStargazerRouteMap(routeConfig, appRouteConfig);
        /**
         * Default initialRouteName to the first provided screenName.
         */
        const initialRouteName = routeConfig[0].screenName;
        /**
         * Create the app navigator.
         */
        const Navigator = StargazerNavigator(routes, Boolean(autoStart), this.logger, initialRouteName, backgroundColor, defaultNavigationOptions);
        return (<View style={{ flex: 1 }} collapsable={false} /* <- WIP! (Android) */ ref={ref => {
            /* tslint:disable-next-line */
            this.view = ref;
        }}>
        <Navigator screenProps={{
            /**
             * For some reason just passing the reference to this.view
             * doesn’t work, but passing a function like this does.
             *
             * The ref must be provided here so it wraps the navigation
             * header, to capture this for the screenshot.
             */
            viewRef: () => this.view,
            captureImage: this.captureImage,
        }}/>
      </View>);
    }
    async preloadAssets() {
        try {
            if (this.props.fontAssets) {
                // @ts-ignore - prop type should be correct I think the Expo type is wrong
                await Font.loadAsync(this.props.fontAssets);
            }
        }
        catch (err) {
            console.log("Error fetching providing fontAssets - please check they match the expected format. Error:", err);
        }
        try {
            await Asset.loadAsync([require("./stargazer.png")].concat(this.props.imageAssets || []));
        }
        catch (err) {
            console.log("Error fetching providing imageAssets - please check they match the expected format. Error:", err);
        }
    }
}
/**
 * If a user provides an incorrect IP address the request will just hang for a long
 * time and there will be no result. Eventually it will probably time out. We
 * provide this 30 second time method to race against the fetch upload to try to catch
 * this condition and warn the user.
 */
const timeoutUploadSafeguard = async () => {
    return new Promise((_, reject) => setTimeout(() => reject("Uploaded timeout exceeded! Please double check the provided IP address in the stargazerServerUrl."), 30 * 1000 /* Wait 30 seconds */));
};
/* =============================================================================
Export
============================================================================= */
export default Stargazer;
//# sourceMappingURL=App.js.map