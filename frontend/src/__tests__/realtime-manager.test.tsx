import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RealtimeSocketManager, buildRealtimeConnectionUrl, routeRealtimeEvent } from '../services/realtime';
import { useAppStore } from '../stores/app-store';

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  public readyState = 0;
  public onopen: ((event?: Event) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event?: Event) => void) | null = null;
  public onclose: ((event?: CloseEvent) => void) | null = null;
  public close = vi.fn(() => {
    this.readyState = 3;
    this.onclose?.(new CloseEvent('close'));
  });

  constructor(public url: string) {
    MockWebSocket.instances.push(this);
  }
}

describe('realtime websocket contract', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useAppStore.setState({ connectionState: 'LIVE' });
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('builds a websocket URL with the JWT and selected warehouse', () => {
    const url = buildRealtimeConnectionUrl('token-123', 'warehouse-01');

    expect(url).toContain('ws://');
    expect(url).toContain('token=token-123');
    expect(url).toContain('warehouse_id=warehouse-01');
    expect(url).toContain('/api/v1/ws/events');
  });

  it('connects when authenticated and sets the live state on connection_ok', () => {
    const states: string[] = [];
    const manager = new RealtimeSocketManager(
      new QueryClient(),
      () => 'token-123',
      () => 'warehouse-01',
      (state) => states.push(state),
    );

    manager.connect();

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(MockWebSocket.instances[0].url).toContain('token=token-123');
    expect(MockWebSocket.instances[0].url).toContain('warehouse_id=warehouse-01');

    MockWebSocket.instances[0].readyState = 1;
    MockWebSocket.instances[0].onopen?.();

    expect(states).toContain('LIVE');
  });

  it('tracks connection_error as degraded', () => {
    const states: string[] = [];
    const manager = new RealtimeSocketManager(new QueryClient(), () => 'token-123', () => 'warehouse-01', (state) => states.push(state));

    manager.connect();
    MockWebSocket.instances[0].onerror?.(new Event('error'));

    expect(states).toContain('DEGRADED');
  });

  it('invalidates only the supported alert and incident queries', () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    routeRealtimeEvent({
      event: 'ALERT_CREATED',
      warehouse_id: 'warehouse-01',
      data: { alert_id: 'alert-1' },
    }, queryClient, 'warehouse-01');

    routeRealtimeEvent({
      event: 'ALERT_ACKNOWLEDGED',
      warehouse_id: 'warehouse-01',
      data: { alert_id: 'alert-1' },
    }, queryClient, 'warehouse-01');

    routeRealtimeEvent({
      event: 'INCIDENT_CREATED',
      warehouse_id: 'warehouse-01',
      data: { incident_id: 'incident-1' },
    }, queryClient, 'warehouse-01');

    routeRealtimeEvent({
      event: 'INCIDENT_STATUS_CHANGED',
      warehouse_id: 'warehouse-01',
      data: { incident_id: 'incident-1', from_status: 'DETECTED', to_status: 'ALERTED' },
    }, queryClient, 'warehouse-01');

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['alerts'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['incidents'] });
  });

  it('ignores unsupported and malformed payloads without crashing', () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    expect(() => routeRealtimeEvent({ event: 'UNKNOWN_EVENT', data: {} }, queryClient, 'warehouse-01')).not.toThrow();
    expect(() => routeRealtimeEvent({} as never, queryClient, 'warehouse-01')).not.toThrow();
    expect(() => routeRealtimeEvent({ event: 'ALERT_CREATED', warehouse_id: 'warehouse-02', data: {} }, queryClient, 'warehouse-01')).not.toThrow();
    expect(() => routeRealtimeEvent({ event: 'ALERT_CREATED', warehouse_id: null, data: {} }, queryClient, 'warehouse-01')).not.toThrow();

    const manager = new RealtimeSocketManager(
      queryClient,
      () => 'token-123',
      () => 'warehouse-01',
      () => undefined,
    );

    manager.connect();
    MockWebSocket.instances[0].onmessage?.({ data: '{bad json' } as MessageEvent);

    expect(invalidate).not.toHaveBeenCalled();
  });

  it('ignores warehouse mismatch events and preserves current warehouse state', () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    routeRealtimeEvent({
      event: 'ALERT_CREATED',
      warehouse_id: 'warehouse-02',
      data: { alert_id: 'alert-1' },
    }, queryClient, 'warehouse-01');

    routeRealtimeEvent({
      event: 'INCIDENT_STATUS_CHANGED',
      warehouse_id: 'warehouse-02',
      data: { incident_id: 'incident-1', from_status: 'DETECTED', to_status: 'ALERTED' },
    }, queryClient, 'warehouse-01');

    expect(invalidate).not.toHaveBeenCalled();
  });

  it('creates no socket when unauthenticated', () => {
    const manager = new RealtimeSocketManager(new QueryClient(), () => null, () => 'warehouse-01', vi.fn());

    manager.connect();

    expect(MockWebSocket.instances).toHaveLength(0);
  });

  it('closes the previous socket when the warehouse changes and creates a new connection', () => {
    let currentWarehouse = 'warehouse-01';
    const manager = new RealtimeSocketManager(
      new QueryClient(),
      () => 'token-123',
      () => currentWarehouse,
      vi.fn(),
    );

    manager.connect();
    const firstSocket = MockWebSocket.instances[0];
    expect(firstSocket).toBeDefined();

    currentWarehouse = 'warehouse-02';
    manager.connect();

    expect(firstSocket.close).toHaveBeenCalledTimes(1);
    expect(MockWebSocket.instances).toHaveLength(2);
    expect(MockWebSocket.instances[1].url).toContain('warehouse_id=warehouse-02');
  });

  it('logout closes the socket and prevents reconnects', () => {
    const manager = new RealtimeSocketManager(
      new QueryClient(),
      () => 'token-123',
      () => 'warehouse-01',
      vi.fn(),
    );

    manager.connect();
    expect(MockWebSocket.instances).toHaveLength(1);

    manager.disconnect();
    expect(MockWebSocket.instances[0].close).toHaveBeenCalledTimes(1);

    MockWebSocket.instances[0].onclose?.(new CloseEvent('close'));
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it('unexpected close triggers a bounded reconnect using current token and warehouse', () => {
    let currentToken = 'token-123';
    let currentWarehouse = 'warehouse-01';
    const states: string[] = [];
    const manager = new RealtimeSocketManager(
      new QueryClient(),
      () => currentToken,
      () => currentWarehouse,
      (state) => states.push(state),
    );

    manager.connect();
    expect(MockWebSocket.instances).toHaveLength(1);

    MockWebSocket.instances[0].onclose?.(new CloseEvent('close'));
    expect(states).toContain('RECONNECTING');

    vi.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(2);
    expect(MockWebSocket.instances[1].url).toContain('token=token-123');
    expect(MockWebSocket.instances[1].url).toContain('warehouse_id=warehouse-01');

    MockWebSocket.instances[1].readyState = 1;
    MockWebSocket.instances[1].onopen?.(new Event('open'));

    currentToken = 'token-456';
    currentWarehouse = 'warehouse-02';
    MockWebSocket.instances[1].onclose?.(new CloseEvent('close'));
    vi.advanceTimersByTime(1000);

    expect(MockWebSocket.instances).toHaveLength(3);
    expect(MockWebSocket.instances[2].url).toContain('token=token-456');
    expect(MockWebSocket.instances[2].url).toContain('warehouse_id=warehouse-02');
  });

  it('does not create duplicate sockets during reconnect and cleans up timers', () => {
    const manager = new RealtimeSocketManager(new QueryClient(), () => 'token-123', () => 'warehouse-01', vi.fn());

    manager.connect();
    MockWebSocket.instances[0].onclose?.(new CloseEvent('close'));

    vi.advanceTimersByTime(500);
    vi.advanceTimersByTime(500);
    expect(MockWebSocket.instances).toHaveLength(2);

    manager.disconnect();
    vi.advanceTimersByTime(10_000);
    expect(MockWebSocket.instances).toHaveLength(2);
  });
});
