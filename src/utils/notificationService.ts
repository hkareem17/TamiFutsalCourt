// Sound chime and web push notification helper for Tami Futsal Ground

/**
 * Plays an audio chime using Web Audio API (zero external asset dependencies).
 */
export function playNotificationSound(type: 'confirmation' | 'reminder' | 'receipt' | 'alert' = 'confirmation') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'confirmation') {
      // Pleasant double chime (C5 -> G5)
      playTone(ctx, 523.25, 0.0, 0.15, 'sine');
      playTone(ctx, 783.99, 0.14, 0.35, 'sine');
    } else if (type === 'receipt') {
      // Triple ascending cash register / receipt chime (E5 -> G5 -> C6)
      playTone(ctx, 659.25, 0.0, 0.12, 'sine');
      playTone(ctx, 783.99, 0.1, 0.12, 'sine');
      playTone(ctx, 1046.5, 0.2, 0.35, 'triangle');
    } else if (type === 'reminder') {
      // Friendly double bell (A5 -> F5)
      playTone(ctx, 880.0, 0.0, 0.18, 'sine');
      playTone(ctx, 698.46, 0.16, 0.3, 'sine');
    } else {
      // Admin alert / attention chime
      playTone(ctx, 587.33, 0.0, 0.15, 'square', 0.08);
      playTone(ctx, 880.0, 0.15, 0.25, 'sine', 0.12);
    }
  } catch (err) {
    console.debug('Web audio unavailable or blocked by autoplay policy:', err);
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainLevel = 0.15
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
}

/**
 * Request permission for native Browser Push Notifications
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.warn('Error requesting notification permission', e);
    return 'denied';
  }
}

/**
 * Dispatches a native browser notification if granted
 */
export function dispatchBrowserNotification(title: string, body: string, tag?: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: tag || 'tami-futsal-notification',
      });
    } catch (e) {
      console.debug('Browser notification blocked or unsupported inside iframe:', e);
    }
  }
}
