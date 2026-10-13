'use client';

// Sound Engine - Audio Cues Completely Disabled (No Clicking / Hover Sounds)
class SoundEngine {
  private muted: boolean = true;

  public toggleMute(): boolean {
    this.muted = true;
    return true;
  }

  public isMuted(): boolean {
    return true;
  }

  // Disabled clicking sound
  public playClick() {
    // Disabled per user request
    return;
  }

  // Disabled hover tone
  public playHover() {
    // Disabled per user request
    return;
  }

  // Disabled success chime
  public playSuccess() {
    // Disabled per user request
    return;
  }
}

export const soundEngine = new SoundEngine();
