<template>
  <div class="max-w-xl lg:max-w-2xl w-full">
    <div class="tracking-complaint--search relative mb-8">
      <JdsSearch
        placeholer="Masukkan ID aduan"
        icon
        button
        value=""
        v-on="$listeners"
      />
    </div>
  </div>
</template>
