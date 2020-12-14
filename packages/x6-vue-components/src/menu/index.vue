<template>
  <div>222</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Inject, Prop, Provide } from 'vue-property-decorator'

@Component({ name: 'MenuBar' })
export default class MenuBar extends Vue {
  @Inject({ default: '' }) path!: string

  @Prop({ required: true })
  readonly name!: string

  @Prop({ default: false })
  readonly isArrayItem!: boolean

  @Provide('path') get groupPath(): string {
    if (this.isArrayItem) {
      return `${this.path}[${this.name}]`
    }

    if (this.path === '') {
      return this.name
    }

    return `${this.path}.${this.name}`
  }
}
</script>

<style scoped>
div {
  width: 100px;
}
</style>
