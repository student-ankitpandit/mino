import { useEffect, useRef, useState, useCallback } from "react";
import { WS_BASE_URL } from "@/lib/api";

interface UseBoardSocketProps {
  boardId?: string;
  token?: string | null;
  onIssueMoved?: (issueId: string, sectionId: string) => void;
  onBoardChanged?: () => void;
}

export function useBoardSocket({
  boardId,
  token,
  onIssueMoved,
  onBoardChanged,
}: UseBoardSocketProps) {
  const [connected, setConnected] = useState(false);
  const [activeUserIds, setActiveUserIds] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<Timer | null>(null);

  const onIssueMovedRef = useRef(onIssueMoved);
  const onBoardChangedRef = useRef(onBoardChanged);

  useEffect(() => {
    onIssueMovedRef.current = onIssueMoved;
    onBoardChangedRef.current = onBoardChanged;
  }, [onIssueMoved, onBoardChanged]);

  const connect = useCallback(() => {
    if (!boardId || !token) return;

    try {
      const wsUrl = `${WS_BASE_URL}?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        // Join the board room
        ws.send(
          JSON.stringify({
            type: "join",
            boardId,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "initial_state") {
            setActiveUserIds(Array.isArray(data.users) ? data.users : []);
          } else if (data.type === "join") {
            const joinedId = data.id || data.userId;
            if (joinedId) {
              setActiveUserIds((prev) => {
                if (prev.includes(joinedId)) return prev;
                return [...prev, joinedId];
              });
            }
          } else if (data.type === "leave") {
            const leftId = data.id || data.userId;
            if (leftId) {
              setActiveUserIds((prev) => prev.filter((id) => id !== leftId));
            }
          } else if (data.type === "issue_moved") {
            if (onIssueMovedRef.current && data.issueId && data.sectionId) {
              onIssueMovedRef.current(data.issueId, data.sectionId);
            }
          } else if (data.type === "board_changed") {
            if (onBoardChangedRef.current) {
              onBoardChangedRef.current();
            }
          }
        } catch (e) {
          console.error("Error parsing WS message:", e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Clean retry after 3s if still mounted
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };
    } catch (e) {
      console.error("Failed to establish WebSocket:", e);
    }
  }, [boardId, token]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendIssueMoved = useCallback((issueId: string, sectionId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "issue_moved",
          issueId,
          sectionId,
        })
      );
    }
  }, []);

  const sendBoardChanged = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "board_changed",
        })
      );
    }
  }, []);

  return {
    connected,
    activeUserIds,
    sendIssueMoved,
    sendBoardChanged,
  };
}
