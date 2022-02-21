const assertDefined = <T, K extends keyof T>(obj: Partial<T>, prop: K): void => {
    if (obj[prop] === undefined || obj[prop] === null) {
        throw new Error(`Environment is missing variable ${prop}`);
    }
};

// Validate required environment variables
[
    "REACT_APP_WEB_API_HOST"
    // Currently only runtime config defined
].forEach((v) => assertDefined(process.env, v));


export interface Config {
    webApiHost: string;
}

declare global {
    interface Window {
        PARODY_POLICE_CONFIG: Config;
    }
}

export const config: Config = {
    webApiHost: process.env.REACT_APP_WEB_API_HOST || ''
}

export default { ...config, ...window.PARODY_POLICE_CONFIG }