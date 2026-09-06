"""In-memory event bus for backend realtime notifications."""
from __future__ import annotations

import asyncio
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, DefaultDict, Dict, Optional, Set

from fastapi import WebSocket
from pydantic import BaseModel, ConfigDict, Field


class EventEnvelope(BaseModel):
    """Serializable event payload used over the websocket contract."""

    event: str
    warehouse_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    data: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="allow")


class ConnectionManager:
    """Tracks authenticated websocket subscribers by warehouse."""

    def __init__(self) -> None:
        self._connections: DefaultDict[str, Set[WebSocket]] = defaultdict(set)

    def register(self, warehouse_id: Optional[str], websocket: WebSocket) -> None:
        if warehouse_id:
            self._connections[warehouse_id].add(websocket)

    def unregister(self, warehouse_id: Optional[str], websocket: WebSocket) -> None:
        if warehouse_id:
            self._connections.get(warehouse_id, set()).discard(websocket)

    def list_targets(self, warehouse_id: Optional[str]) -> list[WebSocket]:
        if warehouse_id:
            return list(self._connections.get(warehouse_id, set()))
        targets: list[WebSocket] = []
        for sockets in self._connections.values():
            targets.extend(sockets)
        return targets

    async def broadcast(self, envelope: EventEnvelope, warehouse_id: Optional[str] = None) -> None:
        for websocket in self.list_targets(warehouse_id):
            try:
                await websocket.send_json(envelope.model_dump(mode="json"))
            except Exception:
                self.unregister(warehouse_id, websocket)


class EventBus:
    """Thin publisher that dispatches typed guardrail events to the websocket manager."""

    def __init__(self, manager: Optional[ConnectionManager] = None) -> None:
        self.manager = manager or ConnectionManager()

    def publish(self, event: str, data: Dict[str, Any], warehouse_id: Optional[str] = None) -> EventEnvelope:
        envelope = EventEnvelope(event=event, warehouse_id=warehouse_id, data=data)
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            asyncio.run(self.manager.broadcast(envelope, warehouse_id=warehouse_id))
            return envelope

        if loop.is_running():
            loop.create_task(self.manager.broadcast(envelope, warehouse_id=warehouse_id))
        return envelope


connection_manager = ConnectionManager()
event_bus = EventBus(manager=connection_manager)
