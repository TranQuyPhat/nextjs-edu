import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { CommentEvent } from "../type";

const WS_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

if (!WS_URL) {
    console.warn("⚠️ NEXT_PUBLIC_SOCKET_URL is not defined");
}

let stompClient: Client | null = null;

export function connectCommentSocket(
    onMessage: (msg: CommentEvent) => void
): Promise<{
    subscribeToAssignment: (assignmentId: number) => () => void;
    subscribeToThread: (rootId: number) => () => void;
}> {
    return new Promise((resolve, reject) => {
        try {
            if (!WS_URL) {
                throw new Error("WebSocket URL is not configured");
            }

            stompClient = new Client({
                webSocketFactory: () => new SockJS(WS_URL!),
                reconnectDelay: 5000,
                debug: (str) => console.log("[WebSocket]", str),
                onStompError: (frame) => {
                    console.error("❌ STOMP error:", frame);
                    reject(new Error(`STOMP error: ${frame.headers.message}`));
                },
                onWebSocketError: (error) => {
                    console.error("❌ WebSocket error:", error);
                    reject(error);
                },
            });

            stompClient.onConnect = () => {
                console.log("✅ WebSocket connected");

                const subscribeToAssignment = (assignmentId: number) => {
                    if (!stompClient) {
                        console.error("❌ STOMP client is not initialized");
                        return () => { };
                    }

                    const sub = stompClient.subscribe(
                        `/topic/assignments/${assignmentId}/comments`,
                        (msg: IMessage) => {
                            try {
                                const data: CommentEvent = JSON.parse(msg.body);
                                onMessage(data);
                            } catch (error) {
                                console.error("❌ Error parsing comment message:", error);
                            }
                        }
                    );

                    return () => {
                        if (sub && typeof sub.unsubscribe === "function") {
                            sub.unsubscribe();
                        }
                    };
                };

                const subscribeToThread = (rootId: number) => {
                    if (!stompClient) {
                        console.error("❌ STOMP client is not initialized");
                        return () => { };
                    }

                    const sub = stompClient.subscribe(
                        `/topic/comments/${rootId}`,
                        (msg: IMessage) => {
                            try {
                                const data: CommentEvent = JSON.parse(msg.body);
                                onMessage(data);
                            } catch (error) {
                                console.error("❌ Error parsing thread message:", error);
                            }
                        }
                    );

                    return () => {
                        if (sub && typeof sub.unsubscribe === "function") {
                            sub.unsubscribe();
                        }
                    };
                };

                resolve({
                    subscribeToAssignment,
                    subscribeToThread,
                });
            };

            stompClient.activate();
        } catch (error) {
            console.error("❌ Error connecting to WebSocket:", error);
            reject(error);
        }
    });
}

/**
 * Disconnect WebSocket
 */
export function disconnectCommentSocket(): void {
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
        stompClient = null;
        console.log("✅ WebSocket disconnected");
    }
}

/**
 * Check if WebSocket is connected
 */
export function isCommentSocketConnected(): boolean {
    return stompClient?.active ?? false;
}