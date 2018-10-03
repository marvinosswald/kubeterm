<template>
  <div id="wrapper">
      <PodList></PodList>
  </div>
</template>

<script>
  import PodList from './PodList'

  export default {
    name: 'main-view',
    components: { PodList }
  }
</script>

<style>
  /*
    #23272A
      #2C2F33
      #99AAB5
      #FFFFFF
      #7289DA
      #E6375A
   */
  @import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Ubuntu Mono', sans-serif;
    background-color: #23272A;
    color: white;
  }
  ::selection {
    background: #e6375a; /* WebKit/Blink Browsers */
  }
  ::-moz-selection {
    background: #e6375a; /* Gecko Browsers */
  }

    #wrapper {
        align-self: flex-start;
        position: relative;
        width: 100vw;
        flex: 1;
    }
</style>
