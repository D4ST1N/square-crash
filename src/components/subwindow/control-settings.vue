<template>
  <div class="control-settings">
    <modal
      :title="$text('CONTROL_SETTINGS.TITLE')"
      :show="show"
      :wide="true"
      @onHide="hideModal"
    >
      <div class="control-settings__wrapper" slot="content">
        <div v-for="(item, key) in settings" :key="key" class="control-settings__item">
          {{ $text(`CONTROL_SETTINGS.KEYS.${key.toUpperCase()}`) }}:
          <span class="control-settings__key">{{ item }}</span>
          <button class="control-settings__button" @click="changeKey(key)">
            <edit :width="16" :height="16" />
          </button>
        </div>
      </div>
      <button slot="footer" class="button" @click="hideModal">{{ $text('CONTROL_SETTINGS.BUTTON') }}</button>
    </modal>
    <changeControlModal :showChangeModal="showChangeModal" :changedKey="changedKey" @keyPressed="keyPressed"/>
  </div>
</template>

<script>
  import modal              from './modal';
  import edit               from '../icons/edit';
  import changeControlModal from './change-control-modal';
  import $event             from '../../resources/utils/events';
  import control            from '../../resources/utils/control';

  export default {
    name: "control-settings",
    components: {
      modal,
      edit,
      changeControlModal,
    },

    data() {
      return {
        show:            false,
        settings:        undefined,
        showChangeModal: false,
        changedKey:      undefined,
      };
    },

    mounted() {
      $event.$on('showControlSettings', this.showModal);
      control.loadSettings();
      this.settings = control.settings;
    },

    methods: {
      changeKey(key) {
        this.changedKey = key;
        this.showChangeModal = true;
      },

      keyPressed(key, newKey) {
        console.log(key, newKey);
        this.settings[key] = newKey;
        this.showChangeModal = false;
        control.changeSettings(this.settings);
      },

      showModal() {
        this.show = true;
      },

      hideModal() {
        this.show = false;
        $event.$emit('showMainMenu');
      },
    },
  }
</script>

<style scoped lang="scss">
  .control-settings {
    &__wrapper {
      display: flex;
      flex-direction: column;
    }

    &__item {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
    }

    &__key {
      background: #fff;
      color: rgba(38,50,56 ,1);
      padding: 4px 8px;
      margin: 0 8px;
      border-radius: 5px;
      font-family: monospace;
      line-height: 1;
    }

    &__button {
      padding: 4px;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 5px;

      &:hover {
        background-color: rgba(255, 255, 255, .25);
      }
    }
  }
</style>