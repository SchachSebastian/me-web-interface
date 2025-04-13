export type MessageCallback = {
    type: string;
    callback: (data: any) => boolean | void;
};
