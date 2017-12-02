<template>
  <div>
    <cookie-law theme="custom" :message="cookieMessage"></cookie-law>
  </div>
</template>

<script>
import CookieLaw from 'vue-cookie-law'

export default {
  name: 'custom-cookie-law',
  components: { CookieLaw },
  data: () => ({
    cookieMessage: 'This web app uses cookies to ensure you get the best experience.'
  })
}
</script>

<style>
.Cookie--custom {
  background: #2196f3;
  padding: 1.250em;
  color: #fff;
}
.Cookie--custom .Cookie__button {
  background: #ff9800;
  padding: 0.625em 3.125em;
  color: #000;
  border-radius: 2px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  font-weight: 500;
  text-transform: uppercase;
}
.Cookie--custom .Cookie__button:hover {
  background-color: #fb8c00;
}
</style>