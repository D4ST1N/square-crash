<template>
  <div v-if="achievement" class="achievement">
    <div class="achievement__wrapper">
      <h1 class="achievement__title">{{ showedTitle }}</h1>
      <div class="achievement__wing"></div>
      <div class="achievement__wing achievement__wing--right"></div>
      <div class="achievement__badge">
        <img :src="`img/achievements/${achievement.name}.png`" :alt="$text(achievement.label)" class="achievement__icon">
      </div>
      <div class="achievement__label">{{ $text(achievement.label) }}</div>
      <button class="achievement__close" @click="closeAchievement">{{ $text('ACHIEVEMENTS.BUTTON') }}</button>
    </div>
  </div>
</template>

<script>
  import $event                from '../resources/utils/events';
  import randomInt             from '../resources/utils/randomInt';
  import getAchievementsStatus from '../resources/utils/getAchievementsStatus';

  export default {
    name: "achievement",

    data() {
      return {
        achievement: undefined,
        title: this.$text('ACHIEVEMENTS.TITLE'),
        showedTitle: '',
      };
    },

    mounted() {
      $event.$on('achievementUnlocked', this.showAchievement);
    },

    methods: {
      setAchievementUnlocked(name) {
        const achievements = getAchievementsStatus();
        achievements[name] = true;
        localStorage.setItem('achievements', JSON.stringify(achievements))
      },

      showAchievement(achievement) {
        if (getAchievementsStatus(achievement.name)) {
          return;
        }

        $event.$emit('pauseGame');
        this.achievement = achievement;
        this.setAchievementUnlocked(achievement.name);
        let caret = 0;
        const tick = () => {
          caret += 1;
          this.showedTitle = this.title.slice(0, caret);

          if (this.title.length <= caret) {
            clearTimeout(timerId);
          } else {
            timerId = setTimeout(tick, randomInt(50, 80));
          }
        };
        let timerId = setTimeout(tick, randomInt(50, 80));
      },

      closeAchievement() {
        this.achievement = null;
        $event.$emit('continueGame');
      },
    },
  }
</script>

<style lang="scss">
  .achievement {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    animation: overlay-in 2s ease-out both;

    &__title {
      position: absolute;
      top: -90px;
      color: rgba(69,90,100 ,1);
      overflow: hidden;
      white-space: nowrap;
      margin: 0 auto;
      animation: title-in .5s steps(50, end);
    }

    &__close {
      position: absolute;
      top: 120%;
      border: none;
      background: transparent;
      color: #fff;
      font-size: 16px;
      text-decoration: underline;
      cursor: pointer;
      animation: button-in .5s ease-in-out 2s both;
    }

    &__wrapper {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    &__wing {
      width: 140px;
      height: 140px;
      position: absolute;
      left: -100px;
      top: -40px;
      transform-origin: 100% 80%;
      opacity: 0;
      animation: wing-in 1.1s backwards, left-wing-in .5s ease-in 1s forwards;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: url('../assets/img/wing.png') no-repeat center;
        background-size: contain;
      }

      &--right {
        left: initial;
        right: -100px;
        transform-origin: 18% 68.6%;
        animation: wing-in 1.1s backwards, right-wing-in .5s ease-in 1s forwards;

        &::before {
          transform: scale(-1, 1);
        }
      }
    }

    &__badge {
      width: 100%;
      height: 100%;
      background: rgba(128,222,234 ,1);
      border: 5px solid rgba(0,151,167 ,1);
      border-radius: 50%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: badge-in .5s ease-out both, badge-colorize 1s ease-in .5s both;
      box-shadow: 2px 2px 8px 0 rgba(0,0,0,.4);
    }

    &__icon {
      width: 60%;
      height: 60%;
      animation: icon-colorize 1s ease-in .5s both;
    }

    &__label {
      position: absolute;
      top: 80%;
      white-space: nowrap;
      padding: 4px 10px;
      background: rgba(38,166,154 ,1);
      color: #fff;
      font-weight: 600;
      font-size: 18px;
      border-radius: 0 0 4px 5px;
      animation: label-in .75s ease-in-out 1.5s both;
    }
  }

  @keyframes overlay-in {
    0% {
      background: transparent;
    }
    100% {
      background: rgba(0,77,64 ,.3);
    }
  }

  @keyframes badge-in {
    0% {
      transform: translateY(300%) scale(.6);
      opacity: 0;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes badge-colorize {
    0% {
      background: rgba(176,190,197 ,1);
      border-color: rgba(69,90,100 ,1);
    }
    100% {
      background: rgba(128,222,234 ,1);
      border-color: rgba(0,151,167 ,1);
    }
  }

  @keyframes icon-colorize {
    0% {
      filter: grayscale(100%);
    }
    100% {
      filter: grayscale(0);
    }
  }

  @keyframes wing-in {
    0% {
      opacity: 0;
    }
    90% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes left-wing-in {
    0% {
      transform: rotate(-135deg) scale(.4) translate(35%, 30%);
      opacity: 1;
    }
    100% {
      transform: rotate(0) scale(1) translateX(0) translateY(0);
      opacity: 1;
    }
  }

  @keyframes right-wing-in {
    0% {
      transform: rotate(-225deg) scale(.4) translate(35%, 30%);
      opacity: 1;
    }
    100% {
      transform: rotate(0) scale(1) translateX(0) translateY(0);
      opacity: 1;
    }
  }

  @keyframes label-in {
    0% {
      transform: translateY(150%) scale(.6);
      opacity: 0;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes title-in {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes button-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>