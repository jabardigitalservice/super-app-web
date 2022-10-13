<template>
  <div class="border-style">
    <div class="lg:flex justify-center items-start mt-8 lg:mt-0 mx-10 lg:mx-0 pb-3">
      <div class="flex-shrink-0">
        <picture>
          <source
            :srcset="require(`@/assets/icons/${iconDark}`)"
            media="(prefers-color-scheme: dark)"
          >
          <img :src="require(`@/assets/icons/${iconLight}`)" width="46" height="46">
        </picture>
      </div>
      <div class="lg:ml-5 mt-5 lg:mt-0 min-w-0 flex-1">
        <h1 class="uppercase text-[16px] font-[Roboto] font-bold">
          {{ title }}
        </h1>
        <p class="text-[10px] font-[Lato] mt-3 mb-3 text-[#424242]">
          {{ description }}
        </p>
        <NuxtLink :to="link" class="font-[Lato] text-green-600 font-bold text-[14px] mb-3">
          Baca {{ title }} Kami
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MenuPrivasi',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    iconDark: {
      type: String,
      default: ''
    },
    iconLight: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: '#'
    }
  }
}
</script>

<style scoped>
.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aqua;
}

.border-style{
  border-bottom: 2px solid #F5F5F5;
}

@media (prefers-color-scheme: dark) {
  p{
    color: #AAB0B7;
  }
}

@media (prefers-color-scheme: dark) and (min-width:1024px) {
  .border-style{
    border:none
  }
}

@media (prefers-color-scheme: dark) and (max-width:1024px) {
  .border-style{
    border-bottom: 1px solid #292C2A;
    width: 100%;
  }
}

</style>
