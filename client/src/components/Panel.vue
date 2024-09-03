<template>
    <div :class="['panel', size]">
        <div class="panel-header">
            <button class="panel-button"></button>
            <div class="panel-title">{{ title }}</div>
        </div>
        <div class="panel-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    size: {
        type: String,
        default: 'small'
    }
})
</script>

<style lang="less" scoped>
.panel {
    width: 364px;
    

    &.small {
        background-image: url('/images/panel-small.svg');
        height: 234px;
    }

    &.medium {
        background-image: url('/images/panel-medium.svg');
        height: 284px;
    }

    &.large {
        background-image: url('/images/panel-large.svg');
        height: 729px;
    }

    .panel-header {
        display: flex;
        padding: 9px 9px 0 9px;
        gap: 16px;
    }

    .panel-button {
        background-color: transparent;
        background-image: url('/images/panel-button.svg');
        background-position: center;
        background-repeat: no-repeat;
        width: 32px;
        height: 32px;
        box-sizing: border-box;
        align-items: center;
        outline: none;
        cursor: pointer;
        border: none;
        color: #ffffff;
    }

    .panel-title {
        color: #FFFFFF;
        font-size: 24px;
        font-weight: bold;
    }

    .panel-content {
        padding: 8px 12px 8px 15px;
    }
}
</style>