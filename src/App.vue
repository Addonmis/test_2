<template lang="jade">
  .container
    article(v-if="message").message.is-info
      .message-body
        span {{message}}
    form(@submit.prevent="save")
      input(type="text" v-model="user.formLastname" name="lastname" placeholder="Фамилия").lastname.input
      input(type="text" v-model="user.formName" name="name" placeholder="Имя").name.input
      input(type="text" v-model="user.formSurname" name="surname" placeholder="Отчество").surname.input
      select(v-model="user.selected").select
        option(v-if="user.selected === 'Выберите из списка'" disabled selected) {{user.selected}}
        option(v-for="role in user.formRole" v-bind:value="role") {{role}}
      .button_save
        button(type="submit").button Сохранить 


    button(@click="del_user").button Очистить локальное хранилище
</template>

<script>

import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'app',
  data () {
    return {
      user: {
        formLastname: "",
        formName: "",
        formSurname: "",
        formRole: [],
        selected: 'Выберите из списка',
      },
      message: ""
    }
  },
  mounted: function(){
    if (localStorage.getItem('user_data')){
      this.message="load from localStorage";
      const user = JSON.parse(localStorage.getItem('user_data'));
      this.user.formLastname = user.formLastname;
      this.user.formName = user.formName;
      this.user.formSurname = user.formSurname;
      this.user.formRole = user.formRole;
      this.user.selected = user.selected;
    } else{
      this.message="load from api";
      axios.get('http://localhost:3000/api/user/id')
        .then((res) => {
          this.user.formLastname = res.data.lastname;
          this.user.formName = res.data.name;
          this.user.formSurname = res.data.surname;
          this.user.formRole = res.data.list;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  methods:{
    del_user(){
      localStorage.removeItem('user_data');
      location.reload();
    },
    validation(lastname, name, surname, role){
      let error = '';
      if (isEmpty(lastname)){
        error = "Поле 'Фамилия' пустое";
      }
      if (isEmpty(name)){
        error = "Поле 'Имя' пустое";
      }
      if (isEmpty(surname)){
        error = "Поле 'Отчество' пустое";
      }
      if (role === "Выберите из списка"){
        error = "Поле 'Роль' осталось не выбрано";
      }
      return {error, isValid: isEmpty(error)}
    },
    save(){
      if (this.validation(this.user.formLastname, this.user.formName, this.user.formSurname, this.user.selected).isValid){
        localStorage.setItem('user_data', JSON.stringify(this.user));
        location.reload();
      } else {
        this.message = this.validation(this.user.formLastname, this.user.formName, this.user.formSurname, this.user.selected).error;
      }
    }
  }
}
</script>

<style lang="sass">

  @import "../node_modules/bulma/bulma.sass"
  
  .container
    width: 100%
    max-width: 400px
    margin: 20px auto
    input
      margin: 0px 0px 10px 0px
    button
      margin: 20px 0px 20px 0px

</style>
