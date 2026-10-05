export type Bubble = string
export type Mood = 'normal' | 'happy' | 'angry' | 'panic' | 'sleepy' | 'laugh' | 'peek'
export type Level = 0 | 1 | 2
export type Who = 'clippy' | 'stajyer' | 'java'
export type Stats = { tools: number; turns: number; escapes: number; pokes: number }
export type Run = { running: boolean; elapsed: number; tool: string }

declare module 'claude-code' {
  interface PluginState {
    sidekick: {
      frame: number
      bubble: Bubble
      talking: boolean
      mood: Mood
      stats: Stats
      level: Level
      who: Who
      walk: boolean
      gaze: { gx: number; gy: number }
      sound: number
      gest: string
      run: Run
    }
  }
}
