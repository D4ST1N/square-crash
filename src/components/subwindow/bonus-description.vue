<template>
  <div class="bonus-description">
    <div v-show="show" class="bonus-description__accent" :style="{ top: top + 'px', left: left + 'px' }"></div>
    <modal
      :title="$text('BONUS.POPUP.TITLE')"
      :show="show"
      :left="modalLeft"
      :top="modalTop"
      :after="afterLeave"
      ref="modal"
    >
      <p slot="content">
        {{ $text(`BONUS.DESCRIPTION.${name.toUpperCase()}`) }}
      </p>
      <button ref="ok" slot="footer" class="button" autofocus @click="hideModal">{{ $text('BONUS.POPUP.BUTTON') }}</button>
    </modal>
  </div>
</template>

<script>
  import modal              from './modal';
  import $event             from '../../resources/utils/events';
  import getCanvas          from '../../resources/utils/getCanvas';
  import collision          from '../../resources/utils/collision';

  export default {
    name: "bonus-description",
    components: {
      modal,
    },
    props: {
      player: Object,
    },

    data() {
      return {
        show: false,
        name: '',
        left: 0,
        top: 0,
        modalLeft: 0,
        modalTop: 0,
        buffer: [],
        bonusDescShowed: false,
      };
    },

    mounted() {
      $event.$on('bonusSpawned', this.addToBuffer);
    },

    methods: {
      addToBuffer(bonus) {
        const showedBonuses = this.getShowedBonuses();

        if (showedBonuses.includes(bonus.name)) {
          return;
        }

        this.buffer.push(bonus);
        this.bonusPicked();
      },

      afterLeave() {
        if (this.buffer.length > 0) {
          this.bonusPicked();
        }
      },

      getShowedBonuses() {
        return JSON.parse(localStorage.getItem('showedBonuses')) || [];
      },

      bonusPicked() {
        if (this.bonusDescShowed) {
          return;
        }

        const bonus = this.buffer[0];
        this.bonusDescShowed = true;
        this.name = bonus.name;

        $event.$emit('pauseGame');
        this.showModal();
        this.$nextTick(() => {
          this.fixModalPosition(bonus);
          this.$refs.ok.focus();
          this.left = this.getAccentPosition(bonus).x;
          this.top = this.getAccentPosition(bonus).y;
        });
        const showedBonuses = this.getShowedBonuses();
        showedBonuses.push(bonus.name);
        localStorage.setItem('showedBonuses', JSON.stringify(showedBonuses));
      },

      fixModalPosition(bonus) {
        const container = this.$refs.modal.$refs.container;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const field = getCanvas();
        const modal = {
          pos: {
            x: field.width / 2 - width / 2,
            y: field.height / 2 - height / 2,
          },
          size: {
            width,
            height,
          },
        };
        const accent = {
          pos: {
            x: this.getAccentPosition(bonus).x,
            y: this.getAccentPosition(bonus).y,
          },
          size: {
            width: 70,
            height: 70,
          },
        };
        this.modalLeft = 0;
        this.modalTop = 0;

        if (collision.test.rectRect(modal, accent)) {
          const distanceX = Math.abs(modal.pos.x - accent.pos.x);
          const distanceY = Math.abs(modal.pos.y - accent.pos.y);
          const moveLeft = modal.size.width - distanceX + 20;
          const moveRight = distanceX + accent.size.width + 20;
          const moveUp = modal.size.height - distanceY + 20;
          const moveDown = distanceY + accent.size.height + 20;
          const minMove = Math.min(moveLeft, moveRight, moveUp, moveDown);

          switch (minMove) {
            case moveLeft:
              this.modalLeft = -moveLeft;
              break;
            case moveUp:
              this.modalTop = -moveUp;
              break;
            case moveRight:
              this.modalLeft = moveRight;
              break;
            case moveDown:
              this.modalTop = moveDown;
              break;
            default:
              break;
          }
        }
      },

      getAccentPosition(bonus) {
        return {
          x: bonus.pos.x - this.player.offset.x - 35,
          y: bonus.pos.y - this.player.offset.y - 35,
        }
      },

      showModal() {
        this.show = true;
      },

      hideModal() {
        this.show = false;
        this.buffer.shift();
        console.log(1);
        this.bonusDescShowed = false;
        $event.$emit('continueGame');
      },
    },
  }
</script>

<style lang="scss">
  .bonus-description {
    .subwindow__overlay {
      background: transparent;
    }

    &__accent {
      position: fixed;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: transparent;
      box-shadow: 0 0 0 200vw rgba(55, 71, 79, 0.6);
    }
  }
</style>