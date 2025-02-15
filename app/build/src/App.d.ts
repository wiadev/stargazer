import React from "react";
import { NavigationRouteConfig, NavigationRouteConfigMap } from "react-navigation";
import { defaultNavigationOptionsType } from "./utils";
export interface StargazerRouteConfigObject extends NavigationRouteConfig {
    name: string;
    screenName: string;
    paramsForNextScreen?: {
        [key: string]: any;
    };
}
export interface StargazerProps {
    backgroundColor?: string;
    autoStart?: boolean;
    disableLogging?: boolean;
    stargazerServerUrl: string;
    routeConfig: ReadonlyArray<StargazerRouteConfigObject>;
    appRouteConfig?: NavigationRouteConfigMap;
    imageAssets?: ReadonlyArray<any>;
    defaultNavigationOptions?: defaultNavigationOptionsType;
    fontAssets?: {
        [key: string]: any;
    };
}
export interface ScreenshotData {
    name: string;
    screenshot: string;
}
interface IState {
    loading: boolean;
}
declare class Stargazer extends React.Component<StargazerProps, IState> {
    view: any;
    constructor(props: StargazerProps);
    componentDidMount(): Promise<void>;
    render(): JSX.Element | null;
    preloadAssets(): Promise<void>;
    captureImage: (image: ScreenshotData, finalScreen: boolean) => Promise<void>;
    uploadImageData: () => Promise<void>;
    postScreenshots: () => Promise<void>;
    logger: (message: string) => void;
}
export default Stargazer;
