import { AxiosInstance } from "axios";
import ziggyRoute from "ziggy-js";


declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof ziggyRoute;
}

declare module 'ziggy-js';
