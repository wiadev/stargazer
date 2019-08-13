import React from "react";
import { Animated, Easing, Platform } from "react-native";
import ScreenshotController from "./Screenshot";
/**
 * Helper to map props for Stargazer ScreenshotController component.
 *
 * @param props StargazerScreenshotControllerProps
 * @param props flattened props object
 */
export const renderPropsHelper = (props) => {
    return {
        navigation: props.navigation,
        viewRef: props.screenProps.viewRef,
        captureImage: props.screenProps.captureImage,
    };
};
/**
 * Method to process user provided route config and map this to a React Navigation
 * StackNavigator of routes, providing the Stargazer HOC Screenshot controller and
 * route information for each screen. Big function!
 *
 * TODO: Refactor this method to make it more readable.
 *
 * @param routeConfig Stargazer route config
 * @param appRouteConfig original app route configuration object
 * @returns NavigationRouteConfigMap for Stargazer App
 */
export const mapRouteConfigToStargazerRouteMap = (routeConfig, appRouteConfig) => {
    const nameSet = new Set();
    return routeConfig.reduce((finalConfig, stargazerRouteObject, currentIndex) => {
        const name = stargazerRouteObject.name;
        if (nameSet.has(name)) {
            console.warn(`Found duplicate name in provided route config: ${name}!`);
            console.warn("Please note that the name keys must be unique for the UI browser to work correctly!");
        }
        else {
            nameSet.add(name);
        }
        /**
         * Determine the screenName and nextScreenName to use for this
         * route, and the appropriate navigationOptions to use.
         */
        const screenName = routeConfig[currentIndex].screenName;
        const nextScreenName = currentIndex < routeConfig.length - 1
            ? routeConfig[currentIndex + 1].screenName
            : undefined;
        const RouteScreenComponent = stargazerRouteObject.screen;
        let defaultNavigationOptions = {};
        if (appRouteConfig && screenName in appRouteConfig) {
            if (appRouteConfig[screenName].navigationOptions !== undefined) {
                defaultNavigationOptions =
                    appRouteConfig[screenName].navigationOptions;
            }
        }
        else {
            console.warn(`Received screenName ${screenName} in routeConfig but no matching screenName exists in appRouteConfig. Is this a mistake? You should use matching screenNames in the Stargazer route config.`);
        }
        /**
         * Create route configuration object:
         */
        const configObject = {
            screen: (props) => {
                return (<ScreenshotController {...renderPropsHelper(props)} nextScreen={nextScreenName || ""} name={stargazerRouteObject.name} finalScreen={nextScreenName === undefined} paramsForNextScreen={stargazerRouteObject.paramsForNextScreen}>
              <RouteScreenComponent navigation={props.navigation}/>
            </ScreenshotController>);
            },
            navigationOptions: stargazerRouteObject.navigationOptions
                ? stargazerRouteObject.navigationOptions
                : defaultNavigationOptions,
        };
        return Object.assign({}, finalConfig, { [screenName]: configObject });
    }, {});
};
/**
 * Returns common configuration for a StackNavigator, including
 * a transparent header and provided initialRouteName.
 *
 * @param initialRouteName for initial stack route
 * @returns StackNavigatorConfig object
 */
export const getStackNavigatorConfig = (initialRouteName, backgroundColor = LIGHT, defaultNavigationOptions) => ({
    initialRouteName,
    headerMode: "screen",
    defaultNavigationOptions,
    cardStyle: {
        opacity: 1,
        backgroundColor,
    },
    // Use "native-like" transition on iOS
    transitionConfig: Platform.OS === "ios" ? undefined : transitionConfig(backgroundColor),
});
const LIGHT = "rgb(255, 255, 255)";
/**
 * Custom navigation animation settings to slide a screen in from right to left.
 * This animation is more fluid and faster than the default transition.
 *
 * Use this for Android only, since animations are usually performant on iOS.
 * The default transition is more "native-like" and we want to use it wherever possible.
 */
const transitionConfig = (backgroundColor = LIGHT) => () => {
    return {
        containerStyle: {
            backgroundColor,
        },
        transitionSpec: {
            duration: 300,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
        },
        screenInterpolator: (sceneProps) => {
            const { layout, position, scene } = sceneProps;
            const thisSceneIndex = scene.index;
            const width = layout.initWidth;
            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0],
            });
            return { transform: [{ translateX }] };
        },
    };
};
//# sourceMappingURL=utils.js.map