import { act, renderHook } from '@testing-library/react';

import useQoloWidget from '@apps/borrower/hooks/useQoloWidget';

describe('useQoloWidget', () => {
  let container: HTMLDivElement;
  const onHideWidget = jest.fn();
  const onCleanup = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    onHideWidget.mockClear();
    onCleanup.mockClear();

    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.removeChild(container);
  });

  test('returns iframeReady=false initially when showWidget is true', () => {
    const { result } = renderHook(() =>
      useQoloWidget({
        containerId: 'test-container',
        showWidget: true,
        onHideWidget,
        onCleanup,
      }),
    );

    expect(result.current.iframeReady).toBe(false);
  });

  test('sets iframeReady=true when onWidgetSuccess is called', () => {
    const { result } = renderHook(() =>
      useQoloWidget({
        containerId: 'test-container',
        showWidget: true,
        onHideWidget,
        onCleanup,
      }),
    );

    act(() => {
      result.current.onWidgetSuccess();
    });

    expect(result.current.iframeReady).toBe(true);
  });

  test('calls onHideWidget and onCleanup after autoHideMs when iframe is ready', () => {
    const { result, rerender } = renderHook(
      ({ showWidget }) =>
        useQoloWidget({
          containerId: 'test-container',
          showWidget,
          onHideWidget,
          onCleanup,
          autoHideMs: 5000,
        }),
      { initialProps: { showWidget: true } },
    );

    act(() => {
      result.current.onWidgetSuccess();
    });

    expect(onHideWidget).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onHideWidget).toHaveBeenCalledTimes(1);

    // Simulate the parent responding to onHideWidget by setting showWidget=false,
    // which triggers the cleanup effect (onCleanup runs here, not in the timer).
    rerender({ showWidget: false });

    expect(onCleanup).toHaveBeenCalledTimes(1);
  });

  test('clears timer when showWidget goes false', () => {
    const { result, rerender } = renderHook(
      ({ showWidget }) =>
        useQoloWidget({
          containerId: 'test-container',
          showWidget,
          onHideWidget,
          onCleanup,
          autoHideMs: 5000,
        }),
      { initialProps: { showWidget: true } },
    );

    act(() => {
      result.current.onWidgetSuccess();
    });
    expect(result.current.iframeReady).toBe(true);

    rerender({ showWidget: false });
    expect(result.current.iframeReady).toBe(false);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onHideWidget).not.toHaveBeenCalled();
  });

  test('resets iframeReady on show-hide-show cycle', () => {
    const { result, rerender } = renderHook(
      ({ showWidget }) =>
        useQoloWidget({
          containerId: 'test-container',
          showWidget,
          onHideWidget,
          onCleanup,
        }),
      { initialProps: { showWidget: true } },
    );

    act(() => {
      result.current.onWidgetSuccess();
    });
    expect(result.current.iframeReady).toBe(true);

    rerender({ showWidget: false });
    expect(result.current.iframeReady).toBe(false);

    rerender({ showWidget: true });
    expect(result.current.iframeReady).toBe(false);
  });

  test('does not set iframeReady when showWidget is false', () => {
    const { result } = renderHook(() =>
      useQoloWidget({
        containerId: 'test-container',
        showWidget: false,
        onHideWidget,
        onCleanup,
      }),
    );

    act(() => {
      result.current.onWidgetSuccess();
    });

    expect(result.current.iframeReady).toBe(false);
  });

  test('calls onCleanup when showWidget goes false', () => {
    const { rerender } = renderHook(
      ({ showWidget }) =>
        useQoloWidget({
          containerId: 'test-container',
          showWidget,
          onHideWidget,
          onCleanup,
        }),
      { initialProps: { showWidget: true } },
    );

    rerender({ showWidget: false });

    expect(onCleanup).toHaveBeenCalledTimes(1);
  });
});
