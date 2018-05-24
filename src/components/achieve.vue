<template>
  <div class="achieve">
    <div v-if="isAchievementLocked" :class="{'achieve__locker': true, 'achieve__locker--secret': achieve.isSecret }">
      <div class="achieve__locker-lock"></div>
    </div>
    <div class="achieve__icon-wrapper">
      <img :src="`img/achievements/${achieve.name}.png`" :alt="$text(achieve.label)" class="achieve__icon">
    </div>
    <div v-if="achieve.isSecret" data-locked="true" class="achieve__content">
      <div class="achieve__label">{{ uglifyString($text(achieve.label)) }}</div>
      <div class="achieve__description">{{ uglifyString($text(achieve.description)) }}</div>
      <div class="achieve__reward">{{ uglifyString($text(achieve.reward)) }}</div>
    </div>
    <div v-else class="achieve__content">
      <div class="achieve__label">{{ $text(achieve.label) }}</div>
      <div class="achieve__description">{{ $text(achieve.description) }}</div>
      <div class="achieve__reward">{{ $text(achieve.reward) }}</div>
    </div>
  </div>
</template>

<script>
  import getAchievementsStatus from '../resources/utils/getAchievementsStatus';
  import uglifyString          from '../resources/utils/uglifyString';

  export default {
    name: "achieve",
    props: {
      achieve: {
        type: Object,
        required: true,
      }
    },

    computed: {
      isAchievementLocked() {
        return !getAchievementsStatus(this.achieve.name);
      },
    },

    methods: {
      uglifyString,
    }
  }
</script>

<style lang="scss">
  .achieve {
    display: flex;
    align-items: center;
    width: 380px;
    box-sizing: border-box;
    padding: 10px 20px;
    background: rgba(25,118,210 ,1);
    box-shadow: 2px 2px 6px 0 rgba(0,151,167 ,.6);
    border-radius: 10px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;

    &__locker {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 20px;
      box-sizing: border-box;
      background: rgba(84,110,122 ,.60);

      &--secret {
        background: rgba(84,110,122 ,.99);
        justify-content: center;
      }

      &-lock {
        width: 80px;
        height: 80px;
        background: url("../assets/img/lock.png") no-repeat center;
        background-size: contain;
        opacity: .9;
      }
    }

    &__icon {
      width: 65%;
      height: 65%;
    }

    &__icon-wrapper {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(128,222,234 ,1);
      border: 3px solid rgba(0,151,167 ,1);
      border-radius: 50%;
    }

    &__content {
      display: flex;
      flex-direction: column;
      text-align: left;
      width: calc(100% - 80px);
      padding-left: 15px;
      box-sizing: border-box;
    }

    &__label {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    &__description {
      margin-bottom: 10px;
      font-size: 14px;
    }

    &__reward {
      font-weight: 600;
      font-size: 14px;
    }
  }
</style>