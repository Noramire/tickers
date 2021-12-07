<template>
  <v-card
    :loading="loading"
    elevation="2"
    max-width="400"
    width="100%"
    class="t-form"
  >
    <v-progress-linear
      slot="loading"
      indeterminate
      class="t-form__loading"
    />
    <v-card-title
      class="t-form__title"
    >
      Авторизация
    </v-card-title>
    <v-form
      ref="form"
      v-model="isFormValid"
      value="false"
    >
      <v-card-text>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Электронная почта"
          required
          @input="onFormChanged"
        />
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          :append-icon="passwordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
          label="Пароль"
          :type="passwordVisibility ? 'text' : 'password'"
          required
          :error-messages="formMessages"
          @click:append="passwordVisibility = !passwordVisibility"
          @input="onFormChanged"
        />
      </v-card-text>
      <v-card-actions
        class="justify-end"
      >
        <v-btn
          :disabled="!isFormValid"
          color="primary"
          class="mr-2"
          @click="authenticate"
        >
          Войти в аккаунт
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { authenticateUser } from '@/tools/simulations';
import { SET_USER } from '@/store/mutation-types';

@Component
export default class TForm extends Vue {
  $refs!: {
    form: Vue & { validate: () => boolean };
  };

  isFormValid = false;
  loading = false;
  // TODO: убрать текст
  email = 'invest@invest.rhonda';
  emailRules = [
    (v: string) => !!v || 'Электронная почта обязательна',
    (v: string) => /.+@.+\..+/.test(v) || 'Электронная почта должна быть действительной',
  ];
  password = '123456';
  passwordVisibility = false;
  passwordRules = [
    (v: string) => !!v || 'Пароль обязателен',
  ];

  formMessages: string[] = [];

  onFormChanged() {
    this.formMessages = [];
  }

  async authenticate() {
    const formRef = this.$refs?.form;
    const validated = formRef.validate();

    if (validated) {
      this.isFormValid = false;
      this.loading = true;
      // Используется заместо запроса к бэкенду
      const response = await authenticateUser(this.email, this.password);

      if (response) {
        this.$store.commit(SET_USER, response);
        this.$router.push('/');
        return;
      }

      this.formMessages = ['Данные неверны'];
      this.isFormValid = true;
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
.t-form {
  padding: 0 25px 25px;
  text-align: center;

  .t-form__title {
    justify-content: center;
    margin-top: 25px;
  }
}
</style>
