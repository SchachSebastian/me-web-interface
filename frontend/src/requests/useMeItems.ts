import useSWRSubscription, {SWRSubscriptionOptions} from "swr/subscription";
import {Item} from "../types/Item";
import {useWebSocket} from "../WebsocketProvider";

function useSubscribe() {
    const socket = useWebSocket();
    const subscribe = (key:string, {next}: SWRSubscriptionOptions<any, any>) => {
        socket.addEventListener('message', (event) => {
            const received = JSON.parse(event.data);
            if (received.type === key) {
                next(null, received.data);
            }
        })

        socket.addEventListener('error', (event) => next("Error"))

        return () => socket.removeEventListener('message', () => {})
    }
    return subscribe;
}

export const useMeItems = () => {
    const subscribe = useSubscribe();
    return useSWRSubscription<Item[], any>("receive-item-data", subscribe)
}
