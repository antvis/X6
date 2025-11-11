import type { Animation } from './animation'

export class AnimationManager {
  animations: Animation[] = []

  addAnimation(animation: Animation) {
    this.animations.push(animation)
  }

  getAnimations() {
    return this.animations
  }
}
