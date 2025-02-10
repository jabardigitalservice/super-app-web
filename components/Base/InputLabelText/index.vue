<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
          { 'border-red-500': error, 'border-gray-300': !error },
          { 'bg-gray-100': disabled }
        ]"
        @input="$emit('input', $event.target.value)"
      >
      <slot name="suffix"></slot>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
    <p v-if="helpText" class="mt-1 text-sm text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    }
  }
}
</script>

