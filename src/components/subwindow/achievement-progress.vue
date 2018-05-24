<template>
  <div class="achievement-progress">
      <modal
        :title="$text('ACHIEVEMENTS.PROGRESS.TITLE')"
        :show="show"
        :wide="true"
        @onHide="hideModal"
      >
        <div class="achievement-progress__wrapper" slot="content">
          <achieve v-for="achieve in sortedList" :achieve="achieve" :key="achieve.name" />
        </div>
        <button slot="footer" class="button achievement-progress__button" @click="hideModal">{{ $text('ACHIEVEMENTS.BUTTON') }}</button>
      </modal>
  </div>
</template>

<script>
  import modal  from './modal';
  import $event from '../../resources/utils/events';
  import achievements from '../../resources/achievements';
  import achieve from '../achieve';

  export default {
    name: "achievement-progress",
    components: {
      modal,
      achieve,
    },

    data() {
      return {
        achievements,
        show: false,
      };
    },

    mounted() {
      $event.$on('showAchievementsProgress', this.showModal);
    },

    computed: {
      sortedList() {
        const sort = (item1, item2) => {
          if (item1.isSecret) {
            return 1;
          }

          if (item2.isSecret) {
            return -1
          }

          return 0
        };
        const filter = achievement => achievement.isAvailable;

        return [...achievements.list].sort(sort).filter(filter);
      }
    },

    methods: {
      showModal() {
        this.show = true;
      },

      hideModal() {
        this.show = false;
      },
    },
  }
</script>

<style lang="scss">
  .achievement-progress {
    &__wrapper {
      display: flex;
      flex-wrap: wrap;
      max-width: 800px;
      max-height: 75vh;
      overflow: auto;
      justify-content: space-between;
    }

    &__button.button {
      margin-top: 20px;
      font-size: 24px;
      font-weight: 600;
    }
  }
</style>