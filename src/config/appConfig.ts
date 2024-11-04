import getEnvVar from "../helpers/util";

interface AppConfig {
    port: string;
    socketPort: string;
}

const AppConfig: AppConfig = {
    port: getEnvVar("PORT"),
    socketPort: getEnvVar("SOCKET_PORT"),
};

export default AppConfig;
