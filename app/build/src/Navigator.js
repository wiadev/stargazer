import React from "react";
import { createAppContainer, createStackNavigator, } from "react-navigation";
import { STARGAZER_INIT } from "./constants";
import StartScreen from "./StartScreen";
import { getStackNavigatorConfig } from "./utils";
/* =============================================================================
Root navigator for Stargazer App.
============================================================================= */
/**
 * Method to create the Stargazer routes.
 *
 * TODO: Convert these arguments to an object with named fields.
 *
 */
const getStargazerRoutes = (routes, autoStart, logger, initialRouteName) => {
    return Object.assign({ [STARGAZER_INIT]: {
            screen: (props) => (<StartScreen logger={logger} autoStart={autoStart} navigation={props.navigation} nextScreen={initialRouteName} routesLength={Object.keys(routes).length}/>),
        } }, routes);
};
/**
 * Root navigator for the Stargazer tool.
 *
 * TODO: Convert these arguments to an object with named fields.
 *
 */
export default (routes, autoStart, logger, initialRouteName, backgroundColor, defaultNavigationOptions) => createAppContainer(createStackNavigator(getStargazerRoutes(routes, autoStart, logger, initialRouteName), getStackNavigatorConfig(STARGAZER_INIT, backgroundColor, defaultNavigationOptions)));
//# sourceMappingURL=Navigator.js.map