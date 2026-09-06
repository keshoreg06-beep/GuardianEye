"""Realtime websocket stream for GuardianEye operational events."""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.app.core.security import decode_token
from backend.app.services.event_bus import connection_manager

router = APIRouter()


@router.websocket("/events")
async def event_stream(websocket: WebSocket, token: Optional[str] = None, warehouse_id: Optional[str] = None):
    """Open a websocket subscription for authenticated warehouse events.

    Supported message contract is intentionally narrow: a successful connection emits a
    connection_ok event and subsequently broadcasts status or alert events for the selected warehouse.
    """
    await websocket.accept()

    if not token:
        await websocket.send_json(
            {
                "event": "connection_error",
                "warehouse_id": warehouse_id,
                "data": {"message": "Authorization token required. Provide ?token=<JWT>."},
            }
        )
        await websocket.close()
        return

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        await websocket.send_json(
            {
                "event": "connection_error",
                "warehouse_id": warehouse_id,
                "data": {"message": "Invalid or expired access token."},
            }
        )
        await websocket.close()
        return

    connection_manager.register(warehouse_id, websocket)
    await websocket.send_json(
        {
            "event": "connection_ok",
            "warehouse_id": warehouse_id,
            "data": {"message": "Connected to GuardianEye event stream", "warehouse_id": warehouse_id},
        }
    )

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.unregister(warehouse_id, websocket)
