<template>
    <div :class="{expander:true,opened:expanded,closed:!expanded}">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        expanded: Boolean
    }
}
</script>
